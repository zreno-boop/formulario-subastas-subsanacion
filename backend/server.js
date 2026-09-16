require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3001;

const getBogotaDate = () => {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const createUploadDir = (req, res, next) => {
  try {
    const submissionId = crypto.randomUUID();
    req.uploadPath = path.join(uploadsDir, submissionId);
    fs.mkdirSync(req.uploadPath, { recursive: true });
    next();
  } catch (error) {
    console.error('Error al crear directorio:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la carpeta.' });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, req.uploadPath),
  filename: (req, file, cb) => {
    const safeOriginalName = path.basename(file.originalname);
    cb(null, Date.now() + '-' + safeOriginalName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: getBogotaDate(),
    service: 'RENOBO Form API'
  });
});

app.post('/api/upload', createUploadDir, upload.any(), async (req, res) => {
  try {
    const fechaRecepcion = getBogotaDate();
    const submissionId = path.basename(req.uploadPath);

    // 1. GENERACIÓN DEL CSV CON TODOS LOS DATOS RECIBIDOS
    let csvContent = 'Campo,Valor\n';
    csvContent += `"Fecha de Recepcion","${fechaRecepcion}"\n`;
    csvContent += `"Numero de Radicado","${submissionId}"\n`;

    for (const key in req.body) {
      if (key === 'proyectos' || key === 'integrantes') continue;
      if (req.body[key] !== null && req.body[key] !== undefined) {
        const value = String(req.body[key]).replace(/"/g, '""');
        csvContent += `"${key}","${value}"\n`;
      }
    }

    if (req.body.proyectos) {
      try {
        const proyectos = JSON.parse(req.body.proyectos);
        if (Array.isArray(proyectos)) {
          proyectos.forEach((proyecto, index) => {
            csvContent += `\n"Proyecto ${index + 1}",""\n`;
            for (const pKey in proyecto) {
              if (proyecto[pKey] === null || proyecto[pKey] === undefined) continue;
              if (pKey === 'situacionJuridicaDocumento' && Array.isArray(proyecto[pKey]) && proyecto[pKey][0]) {
                csvContent += `"  - ${pKey}","${proyecto[pKey][0].name || 'Archivo adjunto'}"\n`;
                continue;
              }
              if (typeof proyecto[pKey] === 'object') continue;
              const pValue = String(proyecto[pKey]).replace(/"/g, '""');
              csvContent += `"  - ${pKey}","${pValue}"\n`;
            }
          });
        }
      } catch (e) {
        csvContent += '"proyectos","Error al procesar datos"\n';
      }
    }

    if (req.body.integrantes) {
      try {
        const integrantes = JSON.parse(req.body.integrantes);
        if (Array.isArray(integrantes)) {
          integrantes.forEach((integrante, index) => {
            csvContent += `\n"Integrante ${index + 1}",""\n`;
            for (const iKey in integrante) {
              if (integrante[iKey] === null || integrante[iKey] === undefined) continue;
              if (iKey === 'autorizacionOrganoDocumento' && Array.isArray(integrante[iKey]) && integrante[iKey][0]) {
                csvContent += `"  - ${iKey}","${integrante[iKey][0].name || 'Archivo adjunto'}"\n`;
                continue;
              }
              if (typeof integrante[iKey] === 'object') continue;
              const iValue = String(integrante[iKey]).replace(/"/g, '""');
              csvContent += `"  - ${iKey}","${iValue}"\n`;
            }
          });
        }
      } catch (e) {
        csvContent += '"integrantes","Error al procesar datos"\n';
      }
    }

    if (req.files && req.files.length > 0) {
      csvContent += `\n"Archivos Adjuntos",""\n`;
      req.files.forEach(file => {
        csvContent += `"${file.fieldname}","${file.filename}"\n`;
      });
    }

    const csvFilePath = path.join(req.uploadPath, 'datos_formulario.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf-8');

    // 2. EXTRAER CORREOS DEL USUARIO E INTEGRANTES (PARA CONFIRMACIÓN DE RECEPCIÓN)
    const userRecipients = [];
    if (req.body.email) userRecipients.push(req.body.email.trim());

    if (req.body.integrantes) {
      try {
        const integrantes = JSON.parse(req.body.integrantes);
        if (Array.isArray(integrantes)) {
          integrantes.forEach(integ => {
            if (integ.email) userRecipients.push(integ.email.trim());
          });
        }
      } catch (e) {
        console.error('Error parseando emails de integrantes:', e);
      }
    }

    const uniqueUserRecipients = [...new Set(userRecipients)].filter(Boolean);

    // 3. ENVÍO A) CORREO DE CONFIRMACIÓN AL USUARIO (SIN ADJUNTOS)
    for (const recipientEmail of uniqueUserRecipients) {
      const userMailOptions = {
        from: `"RENOBO" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Confirmación de Recepción - Radicado ${submissionId}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2>Confirmación de envío de formulario</h2>
            <p>Estimado participante,</p>
            <p>Hemos recibido correctamente su inscripción e información asociada.</p>
            
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Número de radicado:</strong> ${submissionId}</p>
              <p style="margin: 5px 0;"><strong>Fecha de recepción:</strong> ${fechaRecepcion} (Hora Colombia)</p>
            </div>

            <p>Su solicitud ha sido radicada y se encuentra en proceso de revisión por nuestro equipo.</p>
            <br>
            <p>Atentamente,<br><strong>Equipo de Subastas - RENOBO</strong></p>
          </div>
        `
      };

      try {
        await transporter.sendMail(userMailOptions);
        console.log(`Confirmación enviada al usuario: ${recipientEmail}`);
      } catch (err) {
        console.error(`Error enviando confirmación a ${recipientEmail}:`, err);
      }
    }

// 4. ENVÍO B) CORREO INTERNO A LOS REVISORES EN MÚLTIPLES PARTES SI ES NECESARIO
    const revisoresRaw = process.env.ADMIN_EMAILS || '';
    const revisoresList = revisoresRaw.split(',').map(e => e.trim()).filter(Boolean);

    if (revisoresList.length > 0) {
      const MAX_BATCH_BYTES = 20 * 1024 * 1024; // Límite seguro de 20 MB por correo

      // Lista completa de archivos disponibles a adjuntar
      const allFiles = [];
      
      // Siempre incluir el CSV generado primero
      if (fs.existsSync(csvFilePath)) {
        allFiles.push({
          filename: 'datos_formulario.csv',
          path: csvFilePath,
          size: fs.statSync(csvFilePath).size
        });
      }

      // Añadir los adjuntos cargados por el usuario
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          allFiles.push({
            filename: file.originalname,
            path: file.path,
            size: file.size
          });
        });
      }

      // Agrupar adjuntos en lotes que no superen los 20MB
      const batches = [];
      let currentBatch = [];
      let currentBatchSize = 0;

      for (const file of allFiles) {
        // Si incluir este archivo supera el límite, cerramos el lote actual y creamos uno nuevo
        if (currentBatchSize + file.size > MAX_BATCH_BYTES && currentBatch.length > 0) {
          batches.push(currentBatch);
          currentBatch = [];
          currentBatchSize = 0;
        }

        currentBatch.push({ filename: file.filename, path: file.path });
        currentBatchSize += file.size;
      }

      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }

      const totalParts = batches.length;

      // Enviar cada lote como un correo independiente (Parte X de Y)
      for (let index = 0; index < totalParts; index++) {
        const partNumber = index + 1;
        const batchAttachments = batches[index];

        const revisoresMailOptions = {
          from: `"Sistema Subastas RENOBO" <${process.env.GMAIL_USER}>`,
          to: revisoresList.join(','),
          subject: `[NUEVO REGISTRO - PARTE ${partNumber}/${totalParts}] Radicado ${submissionId} - ${req.body.razonSocial || 'Nuevo Postulante'}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2>Nuevo Formulario Recibido para Revisión</h2>
              <p><strong>Atención:</strong> Debido al peso de los adjuntos, esta información se envía en <strong>${totalParts} parte(s)</strong>. Esta es la <strong>Parte ${partNumber} de ${totalParts}</strong>.</p>
              
              <div style="background-color: #f4f4f4; padding: 12px; border-radius: 5px; margin: 15px 0;">
                <ul>
                  <li><strong>Radicado:</strong> ${submissionId}</li>
                  <li><strong>Fecha:</strong> ${fechaRecepcion}</li>
                  <li><strong>Razón Social / Nombre:</strong> ${req.body.razonSocial || 'N/A'}</li>
                  <li><strong>NIT:</strong> ${req.body.nit || 'N/A'}</li>
                  <li><strong>Email de contacto:</strong> ${req.body.email || 'N/A'}</li>
                </ul>
              </div>

              <p>Adjuntos incluidos en este correo (Parte ${partNumber}/${totalParts}):</p>
              <ul>
                ${batchAttachments.map(att => `<li>${att.filename}</li>`).join('')}
              </ul>
            </div>
          `,
          attachments: batchAttachments
        };

        try {
          await transporter.sendMail(revisoresMailOptions);
          console.log(`Correo enviado a revisores (Parte ${partNumber}/${totalParts}) - Radicado: ${submissionId}`);
        } catch (err) {
          console.error(`Error enviando correo a revisores (Parte ${partNumber}/${totalParts}):`, err);
        }
      }

    } else {
      console.warn('No se han definido ADMIN_EMAILS en el archivo .env');
    }
    // 5. RESPUESTA AL FRONTEND
    res.status(200).json({
      message: 'Formulario procesado correctamente.',
      submissionId: submissionId,
      timestamp: fechaRecepcion
    });

  } catch (error) {
    console.error('Error general en POST /api/upload:', error);
    res.status(500).json({ message: 'Ocurrió un error al procesar la solicitud.' });
  }
});

// INICIAR EL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor de RENOBO corriendo en http://localhost:${port}`);
});