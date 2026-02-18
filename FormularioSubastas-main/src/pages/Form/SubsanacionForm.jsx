import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { motion as Motion } from 'framer-motion';
import LogoRenobo from '../../assets/logoRenobo.png';
import { API_BASE_URL } from '../../config';
import './MultiStepForm.css';
import Logos from '../../assets/logosEmpresas.png';

export default function SubsanacionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDocField, setSelectedDocField] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const tipoInscripcion = watch('tipoInscripcion');

    useEffect(() => {
        // Reset selection when inscription type changes
        setSelectedDocField("");
        setValue("selectedDocFile", null);
        setValue("soporteAclaraciones", null);
    }, [tipoInscripcion, setValue]);


    // Documentos comunes a ambos tipos (sin soporteAclaraciones para la lista de selección)
    const commonFields = [
        { name: 'certificadoExistencia', label: 'Certificado de Existencia y Representación Legal', description: "Expedido con una antelación no mayor a treinta (30) días calendario  a la fecha de cierre de la inscripción, ya sea del proponente inscrito de manera individual o de cada integrante de la estructura plural. Debe acreditarse que el representante legal del proponente inscrito de manera individual, o el representante legal principal del proponente inscrito como estructura plural, tenga facultades para poder presentarse a la subasta o allegar el documento del órgano competente de la persona jurídica correspondiente que ostente dichas facultades." },
        { name: 'estadosFinancieros', label: 'Estados Financieros auditados', description: "Últimos estados financieros auditados disponibles (año 2024) ya sea del proponente inscrito de manera individual o de cada integrante de la estructura plural." },
        { name: 'autorizacionSubasta', label: 'Autorización para participar en la Subasta', description: "El representante legal del proponente inscrito de manera individual, o el representante legal principal del proponente inscrito como estructura plural, deberá contar con la autorización expresa del órgano competente, otorgada conforme a lo dispuesto en los estatutos sociales de la respectiva persona jurídica, cuando sus facultades de representación estén sujetas a límites de cuantía o a la aprobación previa de la junta directiva o del órgano decisorio correspondiente, para efectuar la compra de los certificados de derechos de construcción y desarrollo en la subasta." },
        { name: 'sarlaft', label: 'Documentación que respalde la verificación de SARLAFT', description: "El proponente, ya sea del inscrito de manera individual o cada integrante de la estructura plural, deberá aportar los formatos exigidos por la Sociedad Fiduciaria designada para tal efecto, con el fin de que dicha entidad adelante el proceso de verificación del SARLAFT del proponente." },
        { name: 'autorizacionTratamientoDatos', label: 'Autorización tratamiento de datos personales', description: "El representante legal del proponente inscrito de manera individual, o el representante legal principal del proponente inscrito como estructura plural, deberá incluir la autorización para el tratamiento de datos personales, de acuerdo con el formato que sea remitido por la Empresa de Renovación y Desarrollo Urbano de Bogotá D.C." },
        { name: 'situacionJuridicaDocumento', label: 'Documento que respalde el estado actual del predio señalado', description: "" },
        { name: 'formFileSign', label: 'Firma del representante legal del proponente', description: "Firma del Representante Legal del proponente  inscrito de manera individual o del Representante Legal principal del proponente inscrito como estructura plural" },
    ];

    // Documentos exclusivos de estructura plural
    const pluralFields = [
        { name: 'componentePlural', label: 'Conformación del proponente bajo la estructura plural', description: "En caso de que el proponente se inscriba como estructura plural, deberá aportar el documento que acredite su conformación, incluyendo el objeto, el plazo de vigencia, los porcentajes de participación de cada integrante y la designación y facultades del representante principal del proponente plural." },
        { name: 'autorizacionOrganoDocumento', label: 'Autorización del órgano competente de cada integrante', description: "Declaración de autorización expresa del órgano competente para participar en estructura plural." },
    ];

    const supportField = {
        name: 'soporteAclaraciones',
        label: 'Soporte de aclaraciones o correcciones',
        description: "Adjunte un único archivo en formato PDF que contenga las aclaraciones, correcciones o ajustes relacionados frente a la información de los proyectos registrados en el anterior formulario de inscripción.",
        accept: ".pdf"
    };

    const selectableFields = tipoInscripcion === 'grupal'
        ? [...commonFields, ...pluralFields]
        : commonFields;

    const currentSelectedField = selectableFields.find(f => f.name === selectedDocField);

    const onSubmit = async (data) => {
        if (isSubmitting) return;

        // Check if at least one file is provided
        const hasSelectedFile = data.selectedDocFile?.[0];
        const hasSupportFile = data.soporteAclaraciones?.[0];

        if (!hasSelectedFile && !hasSupportFile) {
            Swal.fire({
                title: 'Sin archivos',
                text: 'Debes adjuntar al menos un documento (el documento a subsanar o el soporte de aclaraciones).',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#AFE951',
            });
            return;
        }

        const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

        // Validate Selected Doc File
        if (hasSelectedFile) {
            const file = data.selectedDocFile[0];
            if (file.size > MAX_FILE_SIZE) {
                Swal.fire({ title: 'Archivo demasiado grande', text: `El archivo "${file.name}" excede los 4 MB.`, icon: 'error', confirmButtonColor: '#FE525E' });
                return;
            }
        }

        // Validate Support File
        if (hasSupportFile) {
            const file = data.soporteAclaraciones[0];
            if (file.size > MAX_FILE_SIZE) {
                Swal.fire({ title: 'Archivo demasiado grande', text: `El archivo "${file.name}" excede los 4 MB.`, icon: 'error', confirmButtonColor: '#FE525E' });
                return;
            }
            if (file.type !== 'application/pdf') {
                Swal.fire({ title: 'Formato no permitido', text: `El soporte de aclaraciones debe ser PDF.`, icon: 'error', confirmButtonColor: '#FE525E' });
                return;
            }
        }

        setIsSubmitting(true);
        Swal.fire({
            title: 'Enviando...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const formData = new FormData();
            formData.append('uuid', data.uuid);
            formData.append('tipoInscripcion', data.tipoInscripcion);

            if (hasSelectedFile) {
                // Agregar labels ANTES que el archivo
                formData.append('fileLabel', currentSelectedField.label);
                formData.append('fieldName', currentSelectedField.name);
                formData.append('file', data.selectedDocFile[0]);
            }

            if (hasSupportFile) {
                // Agregar labels ANTES que el archivo
                formData.append('soporteLabel', supportField.label);
                formData.append('soporteAclaraciones', data.soporteAclaraciones[0]);
            }

            const response = await fetch(`${API_BASE_URL}/subsanacion`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Error en el servidor');

            Swal.fire({
                title: '¡Enviado!',
                text: 'Documentos recibidos correctamente.',
                icon: 'success',
                confirmButtonColor: '#AFE951',
            }).then(() => {
                reset();
                setSelectedDocField("");
                setIsSubmitting(false);
            });
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#FE525E' });
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="divLog">
                <a href="https://renobo.com.co/" target="_blank" rel="noopener noreferrer">
                    <img src={LogoRenobo} className="img-fluid divLog-img" alt="logoRenobo" />
                </a>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="container-fluid py-4">
                    <Motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="card cardPpal">
                            <div className="card-body cardBodyPpal">

                                <h2 className="text-center mb-2" style={{ color: 'var(--color-two)' }}>
                                    Subsanación de Documentos
                                </h2>
                                <p className="text-center mb-4" style={{ color: 'var(--color-thirteen)', fontSize: '0.95em' }}>
                                    Utilice este formulario para corregir o complementar la documentación correspondiente al proceso de subasta de certificados de construcción y desarrollo emitidos bajo la modalidad anticipada.
                                </p>
                                <img src={Logos} className="img-fluid img-logos" alt="logosEmpresas" />
                                <hr style={{ borderColor: 'var(--color-five)', opacity: 0.5 }} />

                                {/* UUID Field */}
                                <div className="mb-4">
                                    <label htmlFor="uuid" className="form-label fw-bold" style={{ color: 'var(--color-two)' }}>
                                        Número de Radicado (UUID) <span style={{ color: 'var(--color-nine)' }}>*</span>
                                    </label>
                                    <input
                                        id="uuid"
                                        type="text"
                                        className={`form-control borderGreen ${errors.uuid ? 'is-invalid' : ''}`}
                                        placeholder="Ej: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                                        {...register('uuid', {
                                            required: 'El UUID de envío es obligatorio.',
                                            pattern: {
                                                value: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                                                message: 'El formato del UUID no es válido.',
                                            },
                                        })}
                                    />
                                    {errors.uuid && <div className="invalid-feedback">{errors.uuid.message}</div>}
                                </div>

                                <hr style={{ borderColor: 'var(--color-five)', opacity: 0.5 }} />

                                {/* Tipo de Inscripción */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold" style={{ color: 'var(--color-two)' }}>
                                        Tipo de inscripción original<span style={{ color: 'var(--color-nine)' }}>*</span>
                                    </label>
                                    <div className="d-flex gap-4 custom-check">
                                        <div className="form-check d-flex align-items-center">
                                            <input
                                                type="radio"
                                                value="individual"
                                                id="tipoIndividual"
                                                {...register('tipoInscripcion', { required: 'Debe seleccionar una opción' })}
                                            />
                                            <label className="form-check-label" htmlFor="tipoIndividual">
                                                Individual
                                            </label>
                                        </div>
                                        <div className="form-check d-flex align-items-center">
                                            <input
                                                type="radio"
                                                value="grupal"
                                                id="tipoGrupal"
                                                {...register('tipoInscripcion', { required: 'Debe seleccionar una opción' })}
                                            />
                                            <label className="form-check-label" htmlFor="tipoGrupal">
                                                Estructura Plural
                                            </label>
                                        </div>
                                    </div>
                                    {errors.tipoInscripcion && (
                                        <p className="text-danger small mt-1">{errors.tipoInscripcion.message}</p>
                                    )}
                                </div>

                                {/* Show documents only after selecting tipo */}
                                {tipoInscripcion && (
                                    <Motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <hr style={{ borderColor: 'var(--color-five)', opacity: 0.5 }} />

                                        <h5 className="mb-3" style={{ color: 'var(--color-three)' }}>
                                            Documentos a subsanar
                                        </h5>
                                        <p className="form-label fw-bold" style={{ color: 'var(--color-two)' }}>
                                            Seleccione el documento que desea corregir o complementar.
                                        </p>

                                        {/* Dropdown for selecting document */}
                                        <div className="mb-4">
                                            <select
                                                className="form-select borderGreen"
                                                value={selectedDocField}
                                                onChange={(e) => setSelectedDocField(e.target.value)}
                                            >
                                                <option value="">-- Seleccione un documento --</option>
                                                {selectableFields.map(field => (
                                                    <option key={field.name} value={field.name}>
                                                        {field.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Selected Document File Input */}
                                        {currentSelectedField && (
                                            <Motion.div
                                                className="field-container mb-4"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={currentSelectedField.name}
                                            >
                                                <label className="form-label fw-bold" style={{ color: 'var(--color-two)' }}>
                                                    Adjuntar: {currentSelectedField.label}
                                                </label>
                                                {currentSelectedField.description && (
                                                    <p className="text-muted small">{currentSelectedField.description}</p>
                                                )}
                                                <input
                                                    type="file"
                                                    className="form-control borderGreen mt-2"
                                                    accept={currentSelectedField.accept || ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"}
                                                    {...register("selectedDocFile")}
                                                />
                                                <span className="small text-muted d-block mt-1">(Máx. 4MB)</span>
                                            </Motion.div>
                                        )}

                                        <hr style={{ borderColor: 'var(--color-five)', opacity: 0.5 }} />

                                        {/* Permanent Support Field */}
                                        <div className="field-container mt-4">
                                            <label className="form-label fw-bold" style={{ color: 'var(--color-two)' }}>
                                                {supportField.label}
                                            </label>
                                            <p className="text-muted small">{supportField.description}</p>
                                            <input
                                                type="file"
                                                className="form-control borderGreen mt-2"
                                                accept=".pdf"
                                                {...register("soporteAclaraciones")}
                                            />
                                            <span className="small text-muted d-block mt-1">(Formato PDF, Máx. 4MB)</span>
                                        </div>
                                    </Motion.div>
                                )}

                                <hr style={{ borderColor: 'var(--color-five)', opacity: 0.5 }} />

                                {/* Submit */}
                                <div className="d-flex justify-content-center gap-3 mt-4 mb-2">
                                    <button
                                        type="submit"
                                        className="buttons"
                                        disabled={isSubmitting || !tipoInscripcion}
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar Subsanación'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </Motion.div>
                </div>
            </form>
        </>
    );
}
