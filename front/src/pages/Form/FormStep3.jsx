import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { FaTrash, FaPlus, FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';

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
    const valid = await trigger(["proyectos"]);
    if (!valid) {
      setTimeout(() => {
        const firstInvalidElement = document.querySelector(".is-invalid");
        if (firstInvalidElement) {
          firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
          firstInvalidElement.focus();
        }
      }, 50);
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

              <div className="col-md-12">
                <p className="text-muted small">Adjuntar soporte documental que respalde el estado actual del predio señalado.</p>
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

              <div className="col-md-12 col-lg-6">
                <label className="form-label me-2">Fecha aproximada de licencia</label>
                <Controller
                  control={control}
                  name={`proyectos.${index}.fechaLicencia`}
                  rules={{ required: 'La fecha de licencia es obligatoria' }}
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
                <div className="invalid-feedback">{errors.proyectos?.[index]?.fechaLicencia?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Número de unidades de vivienda a desarrollar</label>
                <input
                  type="number"
                  className={`form-control ${errors.proyectos?.[index]?.numUnidades ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.numUnidades`, { 
                      required: 'Número de unidades obligatorio',
                      valueAsNumber: true, 
                      min: { value: 1, message: 'Debe ser mayor que cero' } })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.numUnidades?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Edificabilidad</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control ${errors.proyectos?.[index]?.indiceEdificabilidad ? 'is-invalid' : ''}`}
                  {...register(`proyectos.${index}.indiceEdificabilidad`, { 
                    required: 'Índice de edificabilidad obligatorio',
                    valueAsNumber: true, 
                    min: { value: 0, message: 'Debe ser mayor o igual a cero' } })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.indiceEdificabilidad?.message}</div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Área construida en el uso</label>
                <textarea
                  className={`form-control ${errors.proyectos?.[index]?.desgloseArea ? 'is-invalid' : ''}`}
                  placeholder={`Ej:\nResidencial: 1.250 m²\nComercial: 430 m²`}
                  rows={4}
                  {...register(`proyectos.${index}.desgloseArea`, {
                    required: 'El desglose de área es obligatorio',
                  })}
                />
                <div className="invalid-feedback">{errors.proyectos?.[index]?.desgloseArea?.message}</div>
              </div>

            </div>
            <br />
            <hr />
          </div>
        </div>
      ))}

      <div className="mb-3">
        <button type="button" className="btn btnAgregar" onClick={() => append({ numero: fields.length + 1, nombre: '', ubicacion: '', tamano: '', estado: '' })}><FaPlus /> Agregar Proyecto</button>
        <div className="text-danger small mt-1">{errors.proyectos?.message}</div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn buttonsBack" onClick={() => {
          resetField("proyectos");
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