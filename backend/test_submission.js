const fs = require('fs');
const path = require('path');

async function testSubmission() {
    const formData = new FormData();

    // Add standard fields
    formData.append('tipoInscripcion', 'individual');
    formData.append('razonSocial', 'Test Company');
    formData.append('nit', '123456789');
    formData.append('email', 'test@example.com');

    // Add the field in question
    formData.append('instrumentoTipo', 'cheque');
    formData.append('entidadEmisora', 'Banco Test');
    formData.append('instrumentoNumero', '12345678');
    formData.append('garantiaMonto', '200000000');

    // Add dummy file
    const dummyFileContent = 'dummy content';
    const dummyFile = new Blob([dummyFileContent], { type: 'text/plain' });
    formData.append('certificadoExistencia', dummyFile, 'certificado.txt');

    try {
        console.log('Sending request to http://localhost:3001/api/upload...');
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
            console.log('Submission successful!');
            console.log('Please check the uploads directory for the CSV file and verify "instrumentoTipo" is present.');
        } else {
            console.error('Submission failed:', result);
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

testSubmission();
