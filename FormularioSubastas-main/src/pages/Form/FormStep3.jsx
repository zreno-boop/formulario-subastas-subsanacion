import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaCaretDown } from 'react-icons/fa';

export default function FormStep3({ register, control, errors, fields, append, remove, trigger, resetField, next, back }) {

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const validateFileType = (value) => {
    const file = value?.[0];
    if (!file) return "Debe adjuntar un archivo";

    if (!allowedTypes.includes(file.type)) {
      return "Formato no permitido. Solo PDF, XLS o XLSX";
    }
    return true;
  };

  const validateFileSize = (value) => {
    const file = value?.[0];
    if (!file) return "Debe adjuntar un archivo";

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "El archivo no debe superar los 5MB";
    }
    return true;
  };

  const handleRemoveProject = (index, remove) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este proyecto será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        remove(index);

        Swal.fire({
          title: "Proyecto eliminado",
          text: "El proyecto ha sido eliminado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm"
          },
          buttonsStyling: false
        });
      }
    });
  };

  const validateStep = async () => {
    const valid = await trigger("proyectos", "situacionJuridicaDocumento");
    if (!valid) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }
    next();
  };

  return (
    <>
      <h4>III. JUSTIFICACIÓN Y DESCRIPCIÓN DE PROYECTOS</h4>

      <p className="text-muted small">Agrega al menos un proyecto.
        El proponente, que se presente de manera individual o como estructura plural,
        declara que los certificados que busca adquirir en la subasta están
        directamente relacionados con la ejecución y desarrollo de proyectos inmobiliarios
        ubicados en Zonas Receptoras de la ciudad de Bogotá D.C.
      </p>

      {fields.map((item, index) => (
        <div key={item.id} className="card borderGreen rounded-4 mb-2 project-card">
          <div className="card-body">

            <h5 className="text-muted">A. Requisitos mínimos</h5>
            <p className="text-muted small"> El proponente, que se presente de manera individual o como estructura plural, deberá incluir
              como requisitos mínimos para cumplir con los requisitos de inscripción a la subasta, los
              siguientes documentos:
            </p>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Proyecto #{index + 1}</strong>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveProject(index, remove)} disabled={fields.length === 1}><FaTrash /> Eliminar</button>
            </div>

            <div className="row gx-2 gy-2">
              <div className="col-md-2">
                <label className="form-label">Número</label>
                <input className="form-control text-center" value={index + 1} readOnly disabled />
              </div>

              <div className="col-md-12">
                <label className="form-label">Nombre del Proyecto *</label>
                <input
                  className={`form-control ${errors.proyectos?.[index]?.nombre ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.nombre`, {
                    required: 'Nombre obligatorio',
                    minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                    validate: (v) => {
                      if (/[<>]/.test(v)) return 'Contiene caracteres inválidos';
                      if (!/^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/.test(v))
                        return 'Sólo se permiten letras, números, espacios, puntos guiones y &';
                      return true;
                    }
                  })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.nombre?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Ubicación (Dirección e identificación de la Zona Receptora) *</label>
                <input
                  className={`form-control ${errors.proyectos?.[index]?.ubicacion ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.ubicacion`, {
                    required: 'Ubicación obligatoria',
                    minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                  })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.ubicacion?.message}</div>
              </div>

              {/* <div className="col-md-12">
                <label className="form-label">Tamaño (Metros cuadrados de construcción total) *</label>
                <input
                  type="number"
                  className={`form-control ${errors.proyectos?.[index]?.tamano ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.tamano`, { required: 'Tamaño obligatorio', valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor que cero' }, max: { value: 96435.38, message: `Debe ser menor que 96435.38` } })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.tamano?.message}</div>
              </div> */}

              <div className="col-md-12">
                <label className="form-label">Estado Actual del Proyecto *</label>
                <select
                  className={`form-select ${errors.proyectos?.[index]?.estado ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.estado`, { required: 'Estado obligatorio' })}
                >
                  <option value="">-- Seleccione una opción --</option>
                  <option value="predios">Predios adquiridos</option>
                  <option value="titulos">Estudio de títulos</option>
                  <option value="diseno">Diseño arquitectónico finalizado</option>
                  <option value="licencia">Trámite de licencia</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="invalid-feedback">{errors.proyectos?.[index]?.estado?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Número de certificados a requerir *</label>
                <input
                  type="number"
                  className={`form-control ${errors.proyectos?.[index]?.numCertificados ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.numCertificados`, { required: 'Cantidad estimada de certificados obligatoria', valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor que cero' } })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.numCertificados?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Identificación catastral y registral *</label>
                <p className="text-muted small">
                  Chip catastral y matrícula inmobiliaria del predio donde se desarrollará el proyecto.
                </p>
                <input
                  type="text"
                  className={`form-control ${errors.proyectos?.[index]?.idCatastral ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.idCatastral`, {
                    required: 'Identificación obligatoria',
                    pattern: {
                      value: /^[A-Za-z0-9./-]{5,30}$/,
                      message: 'Solo letras, números, guion, punto o barra (5-30 caracteres)',
                    },
                  })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.idCatastral?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Situación jurídica y de tenencia del predio *</label>
                <select
                  className={`form-select ${errors.proyectos?.[index]?.situacionJuridica ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.situacionJuridica`, { required: 'Estado obligatorio' })}
                >
                  <option value="">-- Seleccione una opción --</option>
                  <option value="propietario">Propietario</option>
                  <option value="negociacion">En negociación</option>
                  <option value="fideicomiso">En fideicomiso</option>
                  <option value="otra">Otra situación</option>
                </select>
                <div className="invalid-feedback">{errors.proyectos?.[index]?.situacionJuridica?.message}</div>
              </div>
              <p className="text-muted small">
                Adjuntar soporte documental que respalde el estado actual del predio señalado.
              </p>
              <input
                className={`form-control ${errors.proyectos?.[index]?.situacionJuridicaDocumento ? 'is-invalid' : ''}`}
                type="file"
                id={`proyectos.${index}.situacionJuridicaDocumento`}
                accept=".pdf,.xls,.xlsx"
                {...register(`proyectos.${index}.situacionJuridicaDocumento`, {
                  required: "Este documento es obligatorio",
                  validate: {
                    checkFileType: validateFileType,
                    checkFileSize: validateFileSize,
                  },
                })}
              />
              <div className="invalid-feedback">{errors.proyectos?.[index]?.situacionJuridicaDocumento?.message}</div>
            </div>
            <br />
            <p className="text-muted small">
              <strong>Nota: </strong>La información contenida en los requisitos mínimos es de carácter indicativo. En
              consecuencia, durante el desarrollo de la subasta, la oferta de compra de certificados que
              presenten los proponentes podrá diferir del número de certificados a adquirir registrado en esta
              sección.
            </p>
            <hr />
            <br />

            <p className="d-inline-flex gap-1">
              <button className="btn buttonEmpty" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComplementarios" aria-expanded="false" aria-controls="collapseComplementarios">
                <h5 className="text-muted">B. Información complementaria <FaCaretDown /></h5>
              </button>
            </p>
            <div className="collapse" id="collapseComplementarios">
              <div className="card card-body border-0 p-0">

                <p className="text-muted small"> El proponente, que se presente de manera individual o como estructura plural, podrá incluir
                  como requisitos complementarios, y no obligatorios, los siguientes documentos:
                </p>

                <div className="col-md-12 col-lg-6">
                  <label className="form-label me-2">Fecha aproximada de licencia</label>
                  <p className="text-muted small"> Fecha estimada en la que se obtendrá la licencia del proyecto.
                  </p>
                  <Controller
                    control={control}
                    name={`proyectos.${index}.fechaLicencia`}
                    render={({ field }) => (
                      <DatePicker
                        className={`form-control ${errors.proyectos?.[index]?.fechaLicencia ? 'is-invalid' : ''}`}
                        placeholderText="dd/MM/yyyy"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(d) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                        dateFormat="dd/MM/yyyy"
                      />
                    )}
                  />
                  <div className="invalid-feedback">{errors.fechaLicencia?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Número de unidades de vivienda a desarrollar</label>
                  <p className="text-muted small"> Cantidad total de unidades de vivienda que se incluirán en el
                    desarrollo del proyecto.
                  </p>
                  <input
                    type="number"
                    className={`form-control ${errors.proyectos?.[index]?.numUnidades ? 'is-invalid' : ''}`}
                    {...register(`proyectos.${index}.numUnidades`, { valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor que cero' } })}
                  />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.numUnidades?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Edificabilidad</label>
                  <p className="text-muted small"> Índice de edificabilidad previsto para el desarrollo
                    del proyecto.
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.proyectos?.[index]?.indiceEdificabilidad ? 'is-invalid' : ''}`}
                    {...register(`proyectos.${index}.indiceEdificabilidad`, { valueAsNumber: true, min: { value: 0, message: 'Debe ser mayor o igual a cero' } })}
                  />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.indiceEdificabilidad?.message}</div>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Área construida en el uso</label>
                  <p className="text-muted small"> Desglose del área construida (m²) según el uso en el proyecto (residencial, comercial, parqueadero, servicios, entre otros).
                     Área construida en el uso: Corresponde al área construida para un uso en particular, 
                    descontando muros de fachada, muros perimetrales, ductos, estructura, equipamiento comunal privado, circulaciones 
                    comunes y cuartos de acopio. Esta área se usa para efectos del cálculo de equipamiento comunal privado 
                    (Ver 1.3., 1.3.2., A. Exigencia de equipamiento comunal privado), cuartos de acopio (Ver artículo 190, numeral 7 
                    del Decreto Distrital 555 de 2021) y área mínima habitable de la unidad de vivienda (Ver artículo 384 del Decreto
                     Distrital 555 de 2021). (Ver ilustración 01 del Anexo 5 del Decreto Distrital 555 de 2021). Esta definición
                      corresponde a la dispuesta en la página 7 del numeral 1.1. del Capítulo 1 “Normas Urbanísticas Comunes” del 
                      Anexo No. 5 del Decreto Distrital 
                  </p>
                  <textarea
                    className={`form-control ${errors.proyectos?.[index]?.desgloseArea ? 'is-invalid' : ''}`}
                    placeholder={`Ej:
                      Residencial: 1.250 m²
                      Comercial: 430 m²`}
                    rows={4}
                    {...register(`proyectos.${index}.desgloseArea`, {
                      pattern: {
                        value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9:\s\n]+$/,
                        message: 'Formato esperado: Uso: 1.250 m²',
                      },
                    })}
                  />
                  <div className="invalid-feedback">{errors.proyectos?.[index]?.desgloseArea?.message}</div>
                </div>

                <br />
                <p className="text-muted small">
                  <strong>Nota: </strong>La información aportada por los proponentes en el numeral B. “INFORMACIÓN
                  COMPLEMENTARIA” no será considerada como criterio para aceptar o confirmar la inscripción.
                </p>


              </div>
            </div>

          </div>
        </div>
      ))}

      <div className="mb-3">
        <button type="button" className="btn btnAgregar" onClick={() => append({ numero: fields.length + 1, nombre: '', ubicacion: '', tamano: '', estado: '' })}><FaPlus /> Agregar Proyecto</button>
        <div className="text-danger small mt-1">{errors.proyectos?.message}</div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn buttonsBack" onClick={() => {
          resetField("situacionJuridicaDocumento");
          back();
        }}>
          <FaLongArrowAltLeft /> Atrás
        </button>

        <button type="button" className="btn buttons" onClick={validateStep}>
          Siguiente <FaLongArrowAltRight />
        </button>
      </div>
    </>
  );
}