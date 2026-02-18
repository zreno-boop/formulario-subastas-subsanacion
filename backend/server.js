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

/**
 * Genera la fecha y hora exacta de Colombia (UTC-5)
 */
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

// --- Nodemailer Transporter Setup ---
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

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const createUploadDir = (req, res, next) => {
  try {
    const submissionId = crypto.randomUUID();
    req.uploadPath = path.join(uploadsDir, submissionId);
    fs.mkdirSync(req.uploadPath, { recursive: true });
    next();
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    res.status(500).json({ message: 'Server error: could not create upload directory.' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, req.uploadPath);
  },
  filename: function (req, file, cb) {
    const safeOriginalName = path.basename(file.originalname);
    cb(null, Date.now() + '-' + safeOriginalName);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/upload', createUploadDir, upload.any(), async (req, res) => {
  try {
    // GENERACIÓN DE LA FECHA (SIN DEPENDENCIA DEL FRONT)
    const fechaRecepcion = getBogotaDate();

    // 1. Guardar en CSV
    let csvContent = 'Campo,Valor\n';
    csvContent += `"Fecha de Recepción","${fechaRecepcion}"\n`; // <--- Sello de tiempo en el archivo

    for (const key in req.body) {
      if (key === 'proyectos' || key === 'integrantes') continue;
      if (req.body[key] !== null && req.body[key] !== undefined) {
        const value = String(req.body[key]).replace(/"/g, '""');
        csvContent += `"${key}","${value}"\n`;
      }
    }

    // Proceso de Proyectos
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
        csvContent += '"proyectos","Error al procesar los datos del proyecto"\n';
      }
    }

    // Proceso de Integrantes
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
        csvContent += '"integrantes","Error al procesar los datos de los integrantes"\n';
      }
    }

    // Archivos Adjuntos
    if (req.files && req.files.length > 0) {
      csvContent += `\n"Archivos Adjuntos",""\n`;
      req.files.forEach(file => {
        csvContent += `"${file.fieldname}","${file.filename}"\n`;
      });
    }

    const csvFilePath = path.join(req.uploadPath, 'datos_formulario.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf-8');

    // 2. Envío de correos
    const recipients = [];
    if (req.body.email) recipients.push(req.body.email);
    if (req.body.integrantes) {
      try {
        const integrantes = JSON.parse(req.body.integrantes);
        if (Array.isArray(integrantes)) {
          integrantes.forEach(integ => { if (integ.email) recipients.push(integ.email); });
        }
      } catch (e) { console.error('Error email parse:', e); }
    }

    const uniqueRecipients = [...new Set(recipients)];
    const submissionId = path.basename(req.uploadPath);

    for (const recipientEmail of uniqueRecipients) {
      const mailOptions = {
        from: `"RENOBO" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Confirmación de envío de formulario',
        html: `
          <p>Estimado participante,</p>
          <p>Hemos recibido correctamente su inscripción.</p>
          <p>Número de radicado: <strong>${submissionId}</strong></p>
          <p>Fecha de recepción: <strong>${fechaRecepcion} (Hora Colombia)</strong></p>
          <br>
          <p>Atentamente,<br><strong>Equipo de Subastas</strong></p>
        `
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error(`Email error to ${recipientEmail}:`, err);
      }
    }

    // 3. Respuesta final (El JSON que recibe el front)
    res.status(200).json({
      message: 'Form data and files uploaded successfully!',
      submissionId: submissionId,
      timestamp: fechaRecepcion // <--- Se confirma el tiempo en la respuesta JSON
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing the form.' });
  }
});

// --- SUBSANACIÓN ---

const subsanacionDir = path.join(__dirname, 'uploads', 'subsanacion');
if (!fs.existsSync(subsanacionDir)) {
  fs.mkdirSync(subsanacionDir, { recursive: true });
}

const subsanacionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uuid = req.body.uuid || 'unknown';
    const dynamicSubsanacionDir = path.join(subsanacionDir, `subsanacion-${uuid}`);
    if (!fs.existsSync(dynamicSubsanacionDir)) {
      fs.mkdirSync(dynamicSubsanacionDir, { recursive: true });
    }
    cb(null, dynamicSubsanacionDir);
  },
  filename: function (req, file, cb) {
    const safeOriginalName = path.basename(file.originalname);
    const uuid = req.body.uuid || 'unknown';
    const timestamp = Date.now();
    
    // Obtener el label descriptivo enviado desde el front
    let descriptor = file.fieldname;
    if (file.fieldname === 'file' && req.body.fileLabel) {
      descriptor = req.body.fileLabel;
    } else if (file.fieldname === 'soporteAclaraciones' && req.body.soporteLabel) {
      descriptor = req.body.soporteLabel;
    }

    // Limpiar el descriptor para que sea un nombre de archivo válido
    const safeDescriptor = descriptor.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    cb(null, `subsanacion-${uuid}-${timestamp}-${safeDescriptor}-${safeOriginalName}`);
  }
});

const uploadSubsanacion = multer({ 
  storage: subsanacionStorage,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB
});

app.post('/api/subsanacion', uploadSubsanacion.any(), async (req, res) => {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: 'El UUID de envío es requerido.' });
    }

    // Validate that the original submission exists
    const originalDir = path.join(uploadsDir, uuid);
    if (!fs.existsSync(originalDir)) {
      return res.status(404).json({ message: 'No se encontró un envío con ese UUID. Verifique el número de radicado.' });
    }

    // Try to get email from original CSV
    let recipientEmail = null;
    const csvPath = path.join(originalDir, 'datos_formulario.csv');
    if (fs.existsSync(csvPath)) {
      try {
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n');
        for (const line of lines) {
          // Match "email","value" pattern in CSV
          const match = line.match(/^"email","(.+?)"$/i);
          if (match) {
            recipientEmail = match[1];
            break;
          }
        }
      } catch (e) {
        console.error('Error reading CSV for email:', e);
      }
    }

    const fechaSubsanacion = getBogotaDate();
    const timestamp = Date.now();

    // Log subsanación info con nombres descriptivos
    let subsanacionLog = `UUID Original: ${uuid}\nFecha Subsanación: ${fechaSubsanacion}\nArchivos del envío:\n`;
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        let descriptor = file.fieldname;
        if (file.fieldname === 'file' && req.body.fileLabel) {
          descriptor = req.body.fileLabel;
        } else if (file.fieldname === 'soporteAclaraciones' && req.body.soporteLabel) {
          descriptor = req.body.soporteLabel;
        }
        subsanacionLog += `  - ${descriptor}: ${file.filename}\n`;
      });
    }

    // Guardar un archivo de log ÚNICO para este evento de carga (con timestamp)
    const dynamicSubsanacionUploadDir = path.join(subsanacionDir, `subsanacion-${uuid}`);
    const logPath = path.join(dynamicSubsanacionUploadDir, `subsanacion-${uuid}-${timestamp}-log.txt`);
    fs.writeFileSync(logPath, subsanacionLog, 'utf-8');

    // Send confirmation email
    if (recipientEmail) {
      const mailOptions = {
        from: `"RENOBO" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Confirmación de subsanación de documentos',
        html: `
          <p>Estimado participante,</p>
          <p>Hemos recibido correctamente la <strong>subsanación</strong> de documentos para su inscripción.</p>
          <p>Número de radicado original: <strong>${uuid}</strong></p>
          <p>Fecha de subsanación: <strong>${fechaSubsanacion} (Hora Colombia)</strong></p>
          <p>Los documentos enviados han sido registrados exitosamente.</p>
          <br>
          <p>Atentamente,<br><strong>Equipo de Subastas</strong></p>
        `
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Subsanación email sent to ${recipientEmail}`);
      } catch (err) {
        console.error(`Email error to ${recipientEmail}:`, err);
      }
    } else {
      console.warn(`No email found for UUID ${uuid}, skipping email notification.`);
    }

    res.status(200).json({
      message: 'Subsanación recibida exitosamente.',
      uuid: uuid,
      timestamp: fechaSubsanacion,
      filesReceived: req.files ? req.files.length : 0
    });

  } catch (error) {
    console.error('Error en subsanación:', error);
    res.status(500).json({ message: 'Error al procesar la subsanación.' });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});