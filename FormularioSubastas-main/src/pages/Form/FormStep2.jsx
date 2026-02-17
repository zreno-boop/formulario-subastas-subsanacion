import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
//import { useWatch } from "react-hook-form";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function FormStep2({ register, errors, control, watch, tipoInscripcion, trigger, resetField, next, back }) {
  const SMMLV_DEFAULT = 1750905;
  const GARANTIA_FACTOR = 150;
  const garantiaMinima = SMMLV_DEFAULT * GARANTIA_FACTOR;
  registerLocale("es", es);
  const fechaHoy = new Date();
  const maxFechaHoy = new Date(fechaHoy);
  maxFechaHoy.setDate(maxFechaHoy.getDate());
  const fechaLimite = new Date(2026, 1, 9); // Mes 1 = febrero
  const maxFecha = new Date(fechaLimite);
  maxFecha.setDate(maxFecha.getDate() + 150);

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
    const valid = await trigger([
      "certificadoExistencia",
      "estadosFinancieros",
      "autorizacionSubasta",
      "sarlaft",
      "autorizacionTratamientoDatos",
      "componentePlural",
      "garantiaMonto",
      "instrumentoTipo",
      "entidadEmisora",
      "instrumentoNumero",
      "fechaExpedicion",
      "vigenciaInstrumento"
    ]);

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
      <h4>II. REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL</h4>

      <br />
      <p className="text-muted small">
        Al adjuntar los documentos requeridos, tenga en cuenta que todos los archivos deben estar en formato <strong>PDF, XLS o XLSX</strong> y no deben superar un tamaño máximo de <strong>60 MB</strong>.
      </p>
      <div className="borderGreen rounded-4 mb-3 p-4">
        <h5 className="text-muted">A. Documentación Obligatoria</h5>
        <p>
          El proponente deberá aportar la siguiente documentación, de carácter obligatorio, para efectos de la verificación de su existencia y representación legal, tratamiento de datos y solvencia económica:
        </p>

        <div className="mb-3">
          <label htmlFor="certificadoExistencia" className="form-label"><strong>1. Certificado de Existencia y Representación Legal *</strong></label>
          <p className="text-muted small">Expedido con una antelación no mayor a <strong> treinta (30) días calendario </strong> a la fecha de cierre de la inscripción,
            ya sea del proponente inscrito de manera individual o de cada integrante de la estructura plural.
          </p>
          <p className="text-muted small">Debe acreditarse que el representante legal del proponente inscrito de manera individual, o el representante legal
            principal del proponente inscrito como estructura plural,
            tenga facultades para poder presentarse a la subasta o allegar el documento del órgano competente de la persona
            jurídica correspondiente que ostente dichas facultades.
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
          <p className="text-muted small">
            Últimos estados financieros auditados disponibles (año 2024) ya sea del proponente inscrito de manera individual o de cada integrante de la
            estructura plural.
          </p>
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
          <p className="text-muted small">El representante legal del proponente
            inscrito de manera individual, o el representante legal principal del proponente inscrito como estructura plural, deberá contar con la autorización expresa del órgano competente,
            otorgada conforme a lo dispuesto en los estatutos sociales de la respectiva persona jurídica, cuando sus facultades de representación
            estén sujetas a límites de cuantía o a la aprobación previa de la junta directiva o del órgano decisorio correspondiente,
            para efectuar la compra de los certificados de derechos de construcción y desarrollo en la subasta.
          </p>
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
          <p className="text-muted small">El proponente, ya sea del inscrito de manera individual o cada integrante de la estructura plural, deberá aportar los
            formatos exigidos por la Sociedad Fiduciaria designada para tal efecto, con el fin de que dicha entidad adelante el proceso de verificación del SARLAFT del
            proponente.
          </p>
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
          <p className="text-muted small">El representante legal del proponente inscrito de manera individual, o el representante legal principal del proponente inscrito como estructura
            plural, deberá incluir la autorización para el tratamiento de datos personales, de acuerdo con el formato que sea remitido por la Empresa de Renovación y
            Desarrollo Urbano de Bogotá D.C.
          </p>
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
            <p className="text-muted small">En caso de que el proponente se inscriba como estructura plural, deberá aportar el documento que acredite su conformación,
              incluyendo el objeto, el plazo de vigencia, los porcentajes de participación de cada integrante y la designación y facultades del representante principal
              del proponente plural.
            </p>
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
        <p>
          El proponente, que se presente de manera individual o como estructura plural, debe constituir
          una Garantía de Seriedad de la Oferta, en los términos y condiciones previstos en el
          reglamento de la subasta, con el objeto de respaldar el cumplimiento íntegro y oportuno de las
          obligaciones asumidas en virtud de la oferta presentada.
        </p>

        <div className="row gx-3 gy-2">
          <div className="col-md-12">
            <label className="form-label">Monto de la Garantía (COP) *</label>
            <p className="text-muted small"> El valor de la garantía debe ser equivalente a ciento
              cincuenta {GARANTIA_FACTOR} (ciento cincuenta) Salarios Mínimos Mensuales Legales Vigentes (SMMLV).
              El valor se solicita en pesos colombianos (COP).
            </p>
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
            <small className="form-text text-muted">Ejemplo cálculo: {GARANTIA_FACTOR} * SMMLV ({SMMLV_DEFAULT.toLocaleString()}) = <strong>{(GARANTIA_FACTOR * SMMLV_DEFAULT).toLocaleString()}</strong> COP</small>
          </div>

          <div className="col-md-12">
            <label className="form-label">Tipo de Instrumento *</label>
            <select className={`form-select ${errors.instrumentoTipo ? 'is-invalid' : ''}`} {...register('instrumentoTipo', { required: 'Seleccione el tipo de instrumento' })}>
              <option value="">-- Seleccione una opción --</option>
              <option value="cheque">Cheque de Gerencia</option>
              <option value="garantia_bancaria">Garantía Bancaria Irrevocable</option>
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
                pattern: {
                  value: /^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/,
                  message: 'Solo se permiten letras, números, espacios y el símbolo &'
                },
                validate: (v) =>
                  /[<>]/.test(v) ? 'Contiene caracteres inválidos' : true,
              })}
            />
            <div className="invalid-feedback">{errors.entidadEmisora?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Número del Instrumento (Garantía Bancaria Irrevocable / Cheque de Gerencia / CDT Endosado) *</label>
            <input
              className={`form-control ${errors.instrumentoNumero ? 'is-invalid' : ''}`}
              {...register('instrumentoNumero', {
                required: 'Número del instrumento obligatorio',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                maxLength: { value: 15, message: 'Máximo 15 caracteres' },
                pattern: { value: /^[A-Za-z0-9-]+$/, message: 'Sólo caracteres alfanuméricos y guiones' },
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

                  const fecha = new Date(v);
                  fecha.setHours(0, 0, 0, 0);

                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);

                  if (fecha.getTime() === hoy.getTime())
                    return 'La fecha de expedición no puede ser la fecha actual';

                  if (fecha > hoy)
                    return 'La fecha de expedición no puede ser futura';

                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  locale="es"
                  className={`form-control ${errors.fechaExpedicion ? 'is-invalid' : ''}`}
                  placeholderText="dd/MM/yyyy"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(d) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                  dateFormat="dd/MM/yyyy"
                  maxDate={maxFechaHoy}
                />
              )}
            />
            <div className="invalid-feedback">{errors.fechaExpedicion?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label me-2">Vigencia del Instrumento * </label>
            <p className="text-muted small">Desde la fecha límite de la inscripción de los
              participantes de la subasta hasta ciento cincuenta (150) días calendario siguientes.
            </p>
            <Controller
              control={control}
              name="vigenciaInstrumento"
              rules={{
                required: 'Vigencia obligatoria',
                validate: (v) => {
                  if (!v) return 'Vigencia obligatoria';

                  const vigencia = new Date(v);
                  vigencia.setHours(0, 0, 0, 0);

                  const fechaExpedicion = watch('fechaExpedicion');
                  if (!fechaExpedicion) return true;

                  const expedicion = new Date(fechaExpedicion);
                  expedicion.setHours(0, 0, 0, 0);

                  if (vigencia < expedicion) {
                    return 'La vigencia no puede ser anterior a la fecha de expedición';
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  locale="es"
                  className={`form-control ${errors.vigenciaInstrumento ? 'is-invalid' : ''}`}
                  placeholderText="dd/MM/yyyy"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(d) => field.onChange(d ? d.toISOString().split("T")[0] : "")}
                  dateFormat="dd/MM/yyyy"
                  minDate={fechaLimite}
                  maxDate={maxFecha}
                />
              )}
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