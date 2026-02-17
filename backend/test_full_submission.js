const fs = require('fs');
const path = require('path');

async function testFullSubmission() {
    const formData = new FormData();

    // --- 1. Basic Fields ---
    formData.append('tipoInscripcion', 'grupal'); // Testing 'grupal' to trigger more fields
    formData.append('email', 'test.grupal@example.com');
    formData.append('razonSocial', 'Consorcio Test');
    formData.append('nit', '900123456');
    formData.append('domicilio', 'Bogotá/Colombia');
    formData.append('representante', 'Juan Perez');
    formData.append('cedulaRep', '1010101010');
    formData.append('direccionNotificacion', 'Calle 123 # 45-67');
    formData.append('telefono', '3001234567');

    // --- 2. Integrantes (Array) ---
    // Mocking what the frontend sends. 
    // Note: In frontend, 'autorizacionOrganoDocumento' is a FileList. 
    // JSON.stringify on FileList usually results in {}. 
    // We will simulate this behavior to see if server handles it.
    const integrantes = [
        {
            email: 'socio1@example.com',
            razonSocial: 'Socio 1 SAS',
            nit: '800111222',
            domicilio: 'Medellin/Colombia',
            representante: 'Maria Lopez',
            cedulaRep: '2020202020',
            direccionNotificacion: 'Carrera 1 # 2-3',
            telefono: '3101112222',
            autorizacionOrgano: true, // Checkbox
            // autorizacionOrganoDocumento: [File] -> becomes {} in JSON usually
        }
    ];
    formData.append('integrantes', JSON.stringify(integrantes));

    // Append Integrante File
    const integranteFile = new Blob(['autorizacion socio 1'], { type: 'application/pdf' });
    formData.append('integrantes[0].autorizacionOrganoDocumento', integranteFile, 'auth_socio1.pdf');


    // --- 3. Financial & Legal Docs (Files) ---
    const dummyPdf = new Blob(['dummy pdf content'], { type: 'application/pdf' });
    formData.append('certificadoExistencia', dummyPdf, 'certificado.pdf');
    formData.append('estadosFinancieros', dummyPdf, 'estados.pdf');
    formData.append('autorizacionSubasta', dummyPdf, 'auth_subasta.pdf');
    formData.append('sarlaft', dummyPdf, 'sarlaft.pdf');
    formData.append('autorizacionTratamientoDatos', dummyPdf, 'datos.pdf');
    formData.append('componentePlural', dummyPdf, 'plural.pdf'); // Required for grupal

    // --- 4. Guarantee Info ---
    formData.append('garantiaMonto', '250000000');
    formData.append('instrumentoTipo', 'garantia_bancaria'); // Select field
    formData.append('entidadEmisora', 'Banco de Bogota');
    formData.append('instrumentoNumero', 'GB-12345-X');
    formData.append('fechaExpedicion', '2024-11-01'); // Date string
    formData.append('vigenciaInstrumento', '2025-03-01'); // Date string

    // --- 5. Proyectos (Array) ---
    const proyectos = [
        {
            numero: 1,
            nombre: 'Proyecto Residencial Norte',
            ubicacion: 'Calle 170 # 15-20',
            tamano: '5000',
            estado: 'licencia', // Select field
            numCertificados: '100',
            idCatastral: 'AAA-1234',
            situacionJuridica: 'propietario', // Select field
            // situacionJuridicaDocumento: [File] -> becomes {} in JSON
            fechaLicencia: '2024-12-31',
            numUnidades: '200',
            indiceEdificabilidad: '3.5',
            desgloseArea: '4000'
        }
    ];
    formData.append('proyectos', JSON.stringify(proyectos));

    // Append Proyecto File
    const proyectoFile = new Blob(['soporte proyecto'], { type: 'application/pdf' });
    formData.append('proyectos[0].situacionJuridicaDocumento', proyectoFile, 'soporte_proyecto.pdf');

    // --- 6. Declarations & Signature ---
    formData.append('acepta', 'true'); // Checkbox
    formData.append('firmaNombre', 'Juan Perez');
    formData.append('firmaFecha', '01/12/2024');

    const firmaFile = new Blob(['firma imagen'], { type: 'image/png' });
    formData.append('formFileSign', firmaFile, 'firma.png');


    try {
        console.log('Sending full submission request...');
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
            console.log('Submission successful!');
            console.log(`Submission ID: ${result.submissionId}`);
        } else {
            console.error('Submission failed:', result);
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

testFullSubmission();
