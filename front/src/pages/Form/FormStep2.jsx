import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function FormStep2({ register, errors, control, watch, tipoInscripcion, trigger, resetField, next, back }) {
  const SMMLV_DEFAULT = 1750905;
  const GARANTIA_FACTOR = 150;
  const garantiaMinima = SMMLV_DEFAULT * GARANTIA_FACTOR;
  registerLocale("es", es);

  const fechaLimiteInscripcion = new Date(2026, 9, 13); // Mes 9 = octubre
  fechaLimiteInscripcion.setHours(0, 0, 0, 0);

  const fechaExpedicionWatch = watch('fechaExpedicion');

  const maxVigencia = new Date(fechaLimiteInscripcion);
  maxVigencia.setDate(maxVigencia.getDate() + 150);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  
  const formatToLocalDateString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const validateStep = async () => {
    const fieldsToValidate = [
      "certificadoExistencia",
      "estadosFinancieros",
      "autorizacionSubasta",
      "sarlaft",
      "autorizacionTratamientoDatos",
      tipoInscripcion === "grupal" ? "componentePlural" : null,
      "garantiaMonto",
      "instrumentoTipo",
      "entidadEmisora",
      "instrumentoNumero",
      "fechaExpedicion",
      "vigenciaInstrumento"
    ].filter(Boolean);

    const valid = await trigger(fieldsToValidate);

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
      <h4>II. REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL</h4>

      <br />
      <p className="text-muted small">
        Al adjuntar los documentos requeridos, tenga en cuenta que todos los archivos deben estar en formato <strong>PDF, XLS o XLSX</strong> y no deben superar un tamaño máximo de <strong>5 MB</strong>.
      </p>
      <div className="borderGreen rounded-4 mb-3 p-4">
        <h5 className="text-muted">A. Documentación Legal y Financiera</h5>
        <p>
          El proponente deberá aportar la siguiente documentación, de carácter obligatorio, para efectos de la verificación de su existencia y representación legal, tratamiento de datos y solvencia económica:
        </p>

        <div className="mb-3">
          <label htmlFor="certificadoExistencia" className="form-label"><strong>1. Certificado de Existencia y Representación Legal *</strong></label>
          <p className="text-muted small">Expedido con una antelación no mayor a <strong> treinta (30) días calendario </strong> a la fecha de cierre de la inscripción...
          </p>
          <input
            className={`form-control ${errors.certificadoExistencia ? 'is-invalid' : ''}`}
            type="file"
            id="certificadoExistencia"
            accept=".pdf,.xls,.xlsx"
            {...register("certificadoExistencia", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.certificadoExistencia?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="estadosFinancieros" className="form-label"><strong>2. Estados Financieros Auditados *</strong></label>
          <input
            className={`form-control ${errors.estadosFinancieros ? 'is-invalid' : ''}`}
            type="file"
            id="estadosFinancieros"
            accept=".pdf,.xls,.xlsx"
            {...register("estadosFinancieros", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.estadosFinancieros?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="autorizacionSubasta" className="form-label"><strong>3. Autorización para participar en la Subasta *</strong></label>
          <input
            className={`form-control ${errors.autorizacionSubasta ? 'is-invalid' : ''}`}
            type="file"
            id="autorizacionSubasta"
            accept=".pdf,.xls,.xlsx"
            {...register("autorizacionSubasta", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.autorizacionSubasta?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="sarlaft" className="form-label"><strong>4. Documentación que respalde la verificación de SARLAFT *</strong></label>
          <input
            className={`form-control ${errors.sarlaft ? 'is-invalid' : ''}`}
            type="file"
            id="sarlaft"
            accept=".pdf,.xls,.xlsx"
            {...register("sarlaft", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.sarlaft?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="autorizacionTratamientoDatos" className="form-label"><strong>5. Autorización para el tratamiento de datos personales *</strong></label>
          <input
            className={`form-control ${errors.autorizacionTratamientoDatos ? 'is-invalid' : ''}`}
            type="file"
            id="autorizacionTratamientoDatos"
            accept=".pdf,.xls,.xlsx"
            {...register("autorizacionTratamientoDatos", {
              required: "Este documento es obligatorio",
              validate: {
                checkFileType: validateFileType,
                checkFileSize: validateFileSize,
              },
            })}
          />
          <div className="invalid-feedback">{errors.autorizacionTratamientoDatos?.message}</div>
        </div>

        {tipoInscripcion === "grupal" && (
          <div className="mb-3">
            <label htmlFor="componentePlural" className="form-label"><strong>6. Conformación del proponente bajo la estructura plural *</strong></label>
            <input
              className={`form-control ${errors.componentePlural ? 'is-invalid' : ''}`}
              type="file"
              id="componentePlural"
              accept=".pdf,.xls,.xlsx"
              {...register("componentePlural", {
                required: "Este documento es obligatorio",
                validate: {
                  checkFileType: validateFileType,
                  checkFileSize: validateFileSize,
                },
              })}
            />
            <div className="invalid-feedback">{errors.componentePlural?.message}</div>
          </div>
        )}
      </div>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <h5 className="text-muted">B. Garantía de Seriedad de la Oferta</h5>
        <div className="row gx-3 gy-2">
          <div className="col-md-12">
            <label className="form-label">Monto de la Garantía (COP) *</label>
            <div className="input-group">
              <span className="input-group-text">COP</span>
              <input
                type="number"
                className={`form-control ${errors.garantiaMonto ? 'is-invalid' : ''}`}
                placeholder="Valor en pesos colombianos"
                onWheel={(e) => e.target.blur()}
                {...register('garantiaMonto', {
                  required: 'Monto de garantía obligatorio',
                  valueAsNumber: true,
                  validate: (value) => {
                    return value >= garantiaMinima
                      ? true
                      : `El monto debe ser mínimo ${garantiaMinima.toLocaleString()} COP`;
                  }
                })}
              />
              <div className="invalid-feedback">{errors.garantiaMonto?.message}</div>
            </div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Tipo de Instrumento *</label>
            <select className={`form-select ${errors.instrumentoTipo ? 'is-invalid' : ''}`} {...register('instrumentoTipo', { required: 'Seleccione el tipo de instrumento' })}>
              <option value="">-- Seleccione una opción --</option>
              <option value="cheque">Cheque de Gerencia</option>
              <option value="cdt">CDT Endosado</option>
            </select>
            <div className="invalid-feedback">{errors.instrumentoTipo?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Entidad Emisora del Instrumento *</label>
            <input
              className={`form-control ${errors.entidadEmisora ? 'is-invalid' : ''}`}
              {...register('entidadEmisora', {
                required: 'Entidad emisora obligatoria',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
            />
            <div className="invalid-feedback">{errors.entidadEmisora?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Número del Instrumento *</label>
            <input
              className={`form-control ${errors.instrumentoNumero ? 'is-invalid' : ''}`}
              {...register('instrumentoNumero', {
                required: 'Número del instrumento obligatorio',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 15, message: 'Máximo 15 caracteres' },
              })}
            />
            <div className="invalid-feedback">{errors.instrumentoNumero?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label me-2">Fecha de Expedición del Instrumento * </label>
            <Controller
              control={control}
              name="fechaExpedicion"
              rules={{
                required: 'Fecha de expedición obligatoria',
                validate: (v) => {
                  if (!v) return 'Fecha obligatoria';
                  const expedicion = parseLocalDate(v);
                  if (expedicion.getTime() > hoy.getTime()) {
                    return 'La fecha de expedición no puede ser una fecha futura';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <DatePicker
                  locale="es"
                  className={`form-control ${errors.fechaExpedicion ? 'is-invalid' : ''}`}
                  placeholderText="dd/MM/yyyy"
                  selected={parseLocalDate(field.value) || null}
                  onChange={(d) => {
                    field.onChange(formatToLocalDateString(d));
                    trigger('vigenciaInstrumento');
                  }}
                  dateFormat="dd/MM/yyyy"
                  maxDate={hoy}
                />
              )}
            />
            <div className="invalid-feedback">{errors.fechaExpedicion?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label me-2">Vigencia del Instrumento * </label>
            <Controller
              control={control}
              name="vigenciaInstrumento"
              rules={{
                required: 'Vigencia obligatoria',
                validate: (v) => {
                  if (!v) return 'Vigencia obligatoria';
                  const vigencia = parseLocalDate(v);
                  if (fechaExpedicionWatch) {
                    const expedicion = parseLocalDate(fechaExpedicionWatch);
                    if (vigencia.getTime() < expedicion.getTime()) {
                      return 'La vigencia no puede ser anterior a la fecha de expedición';
                    }
                  }
                  if (vigencia.getTime() > maxVigencia.getTime()) {
                    return 'La vigencia no puede superar los 150 días calendario posteriores al límite de inscripción';
                  }
                  return true;
                }
              }}
              render={({ field }) => {
                const expedicion = fechaExpedicionWatch ? parseLocalDate(fechaExpedicionWatch) : null;
                const minDateCalendar = expedicion || hoy;

                return (
                  <DatePicker
                    locale="es"
                    className={`form-control ${errors.vigenciaInstrumento ? 'is-invalid' : ''}`}
                    placeholderText="dd/MM/yyyy"
                    selected={parseLocalDate(field.value)}
                    onChange={(d) => field.onChange(formatToLocalDateString(d))}
                    dateFormat="dd/MM/yyyy"
                    minDate={minDateCalendar}
                    maxDate={maxVigencia}
                  />
                );
              }}
            />
            <div className="invalid-feedback">{errors.vigenciaInstrumento?.message}</div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn buttonsBack" onClick={() => {
          resetField("certificadoExistencia");
          resetField("estadosFinancieros");
          resetField("autorizacionSubasta");
          resetField("sarlaft");
          resetField("autorizacionTratamientoDatos");
          resetField("componentePlural");
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