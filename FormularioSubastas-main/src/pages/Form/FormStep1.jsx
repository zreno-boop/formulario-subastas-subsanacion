import Swal from 'sweetalert2';
//import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEnvelope, FaPhoneAlt, FaLongArrowAltRight, FaTrash, FaPlus } from 'react-icons/fa';
import Logos from '../../assets/logosEmpresas.png';


export default function FormStep1({ register, errors, watch, setValue, clearErrors, trigger, fieldsIntegrantes, appendIntegrante, removeIntegrante, replaceIntegrantes, next }) {

  const tipoInscripcion = watch("tipoInscripcion");
  const telefonoPattern = /^(3\d{9}|60\d{1}\d{7}|018000\d{6})$/;

  useEffect(() => {
    if (!tipoInscripcion) return;

    if (tipoInscripcion === "individual") {
      replaceIntegrantes([
        {
          email: "",
          razonSocial: "",
          nit: "",
          domicilio: "",
          representante: "",
          cedulaRep: "",
          direccionNotificacion: "",
          telefono: ""
        }
      ]);
      clearErrors("integrantes");
    }

    if (tipoInscripcion === "grupal") {
      const camposIndividuales = [
        "email",
        "razonSocial",
        "nit",
        "domicilio",
        "representante",
        "cedulaRep",
        "direccionNotificacion",
        "telefono",
        "autorizacionOrgano",
        "autorizacionOrganoDocumento"
      ];

      camposIndividuales.forEach(campo => setValue(campo, ""));
      clearErrors(camposIndividuales);
    }
  }, [tipoInscripcion, replaceIntegrantes, setValue, clearErrors]);

  const handleRemoveIntegrante = (index, remove) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este integrante será eliminado permanentemente.",
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
          title: "Integrante eliminado",
          text: "El integrante ha sido eliminado correctamente.",
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
    const fieldsToValidate =
      tipoInscripcion === "individual"
        ? [
          "tipoInscripcion",
          "email",
          "razonSocial",
          "nit",
          "domicilio",
          "representante",
          "cedulaRep",
          "direccionNotificacion",
          "telefono",
        ]
        : ["tipoInscripcion", "integrantes"];

    const valid = await trigger(fieldsToValidate);

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
      <br />
      <h2 className="card-title text-center">FORMATO DE INSCRIPCIÓN Y ACEPTACIÓN DE TÉRMINOS Y CONDICIONES</h2>
      <br />
      <h6 className="text-center text-muted mb-3">PROCESO DE SUBASTA DE CERTIFICADOS DE CONSTRUCCIÓN Y DESARROLLO EMITIDOS BAJO LA MODALIDAD ANTICIPADA</h6>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <div className="row mb-3">
          <div className="col-md-12 col-lg-6">
            <label className="form-label"><strong>Convoca:</strong></label>
            <div className="p-2 mt-1 titulos">Empresa de Renovación y Desarrollo Urbano de Bogotá D.C.</div>
          </div>
          <div className="col-md-12 col-lg-6">
            <label className="form-label"><strong>Fecha de Convocatoria:</strong></label>
            <div className="p-2 mt-1 titulos">26 de diciembre de 2025</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12 col-lg-6">
            <label className="form-label"><strong>Fecha de Inicio del Proceso de Inscripción:</strong></label>
            <div className="p-2 mt-1 titulos">20 de enero de 2026</div>
          </div>
          <div className="col-md-12 col-lg-6">
          <label className="form-label"><strong>Plazo Límite del Proceso de Inscripción:</strong></label>
            <div className="p-2 mt-1 titulos">9 de febrero de 2026</div>
          </div>
        </div>
        <br />
        <img src={Logos} className="img-fluid img-logos" alt="logosEmpresas" />
        <br />
      </div>
      <br />
      <h4>I. INFORMACIÓN LEGAL Y DE CONTACTO DEL PROPONENTE</h4>
      <p>Podrán participar en la subasta los fondos inmobiliarios, fideicomisos de parqueo,
        promotores, desarrolladores y constructores legalmente constituidos, de manera
        individual o como estructura plural.</p>

      <p>Seleccione a continuación si se presentará de manera individual o como estructura plural:</p>

      <div className="row gx-3 gy-2">
        <div className="col-md-12 col-lg-6">
          <div className="form-check custom-check">
            <input
              id="radioIndividual"
              type="radio"
              value="individual"
              className="form-check-input"
              {...register("tipoInscripcion", { required: "Debe seleccionar una opción" })}
            />
            <label className="form-check-label">Inscripción individual</label>
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="form-check custom-check">
            <input
              id="radioGrupal"
              type="radio"
              value="grupal"
              className="form-check-input"
              {...register("tipoInscripcion", { required: "Debe seleccionar una opción" })}
            />
            <label className="form-check-label">Estructura plural</label>
          </div>
          {errors.tipoInscripcion && (
            <p className="text-danger small">{errors.tipoInscripcion.message}</p>
          )}
          <br />
        </div>
      </div>

      {tipoInscripcion === "individual" && (
        <div className="row gx-3 gy-2">
          <hr />
          <h5>Inscripción individual</h5>
          <div className="col-md-12">
            <label className="form-label">Correo Electrónico *</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' },
                })}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Nombre o Razón Social *</label>
            <input
              type="text"
              className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
              {...register('razonSocial', {
                required: 'Nombre o razón social obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                pattern: {
                  value: /^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/,
                  message: 'Sólo se permiten letras, números, espacios, puntos guiones y &',
                },
                validate: (v) =>
                  /[<>]/.test(v) ? 'Contiene caracteres inválidos' : true,
              })}
            />
            <div className="invalid-feedback">{errors.razonSocial?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Cédula o NIT (Número de Identificación Tributaria) *</label>
            <input
              type="text"
              className={`form-control ${errors.nit ? 'is-invalid' : ''}`}
              {...register('nit', {
                required: 'Cédula o NIT obligatorio',
                validate: {
                  noCeroInicial: (value) => {
                    const v = String(value || "");
                    return !v.startsWith('0') || 'No puede iniciar en 0';
                  }
                },
                pattern: {
                  value: /^\d{6,12}$/,
                  message: 'Solo números',
                },
                minLength: {
                  value: 6,
                  message: 'Debe tener mínimo 6 dígitos',
                },
                maxLength: {
                  value: 12,
                  message: 'Debe tener máximo 12 dígitos',
                },
              })}
            />
            <div className="invalid-feedback">{errors.nit?.message}</div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Domicilio Principal *</label>
            <input
              className={`form-control ${errors.domicilio ? 'is-invalid' : ''}`}
              placeholder="Ciudad/País. Ej.: Bogotá/Colombia"
              {...register('domicilio', {
                required: 'Domicilio obligatorio',
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+\/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/,
                  message: 'Formato inválido. Usa Ciudad/País',
                },
                validate: (v) =>
                  v.split('/').length === 2 &&
                    v.split('/')[0].trim().length > 1 &&
                    v.split('/')[1].trim().length > 1
                    ? true
                    : 'Debe contener Ciudad y País válidos',
              })}
            />
            <div className="invalid-feedback">{errors.domicilio?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Nombre del Representante Legal *</label>
            <input
              className={`form-control ${errors.representante ? 'is-invalid' : ''}`}
              {...register('representante', {
                required: 'Nombre del representante obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                pattern: { value: /^[A-Za-zÀ-ÿ\s]+$/, message: 'Sólo letras y espacios' },
              })}
            />
            <div className="invalid-feedback">{errors.representante?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Cédula de ciudadanía del Representante *</label>
            <input
              className={`form-control ${errors.cedulaRep ? 'is-invalid' : ''}`}
              {...register('cedulaRep', {
                required: 'Cédula del representante obligatoria',
                validate: {
                  noCeroInicial: (value) => {
                    const v = String(value || "");
                    return !v.startsWith('0') || 'No puede iniciar en 0';
                  }
                },
                pattern: {
                  value: /^\d{6,12}$/,
                  message: 'Solo números',
                },
                minLength: {
                  value: 6,
                  message: 'Debe tener mínimo 6 dígitos',
                },
                maxLength: {
                  value: 12,
                  message: 'Debe tener máximo 12 dígitos',
                },
              })}
            />
            <div className="invalid-feedback">{errors.cedulaRep?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Dirección Notificación Física (Opcional)</label>
            <input
              className={`form-control ${errors.direccionNotificacion ? 'is-invalid' : ''}`}
              {...register('direccionNotificacion', {
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
              })}
            />
            <div className="invalid-feedback">{errors.direccionNotificacion?.message}</div>
          </div>

          <div className="col-md-12 col-lg-6">
            <label className="form-label">Teléfono de Contacto *</label>
            <div className="input-group">
              <span className="input-group-text"><FaPhoneAlt /></span>
              <input
                type="text"
                className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                {...register('telefono', {
                  required: 'Teléfono obligatorio',
                  pattern: { value: telefonoPattern, message: 'Formato teléfono inválido sin espacios, sólo números. (ej: celular inicia con 3 o fijo inicia por 6 o 0)' },
                })}
              />
              <div className="invalid-feedback">{errors.telefono?.message}
              </div>
            </div>
          </div>

        </div>
      )}

      {tipoInscripcion === "grupal" && (
        <div className="row gx-3 gy-2">
          <hr />
          <h5>Inscripción estructura plural</h5>
          {fieldsIntegrantes.map((item, index) => (
            <div key={item.id} className="card borderGreen rounded-4 mb-3">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Integrante #{index + 1}</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveIntegrante(index, removeIntegrante)}
                    disabled={fieldsIntegrantes.length === 1}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>

                <div className="row gx-3 gy-2">

                  <div className="col-md-12">
                    <label className="form-label">Correo Electrónico *</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <input
                        type="email"
                        className={`form-control ${errors.integrantes?.[index]?.email ? 'is-invalid' : ''}`}
                        {...register(`integrantes.${index}.email`, {
                          required: 'El correo es obligatorio',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' },
                        })}
                      />
                      <div className="invalid-feedback">{errors.integrantes?.[index]?.email?.message}</div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Nombre o Razón Social *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.integrantes?.[index]?.razonSocial ? 'is-invalid' : ''}`}
                      {...register(`integrantes.${index}.razonSocial`, {
                        required: 'Nombre o razón social obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        pattern: {
                          value: /^(?=.*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9.,\-\s&#%+/()'"]{3,150}$/,
                          message: 'Sólo se permiten letras, números, espacios, puntos guiones y &',
                        },
                        validate: (v) =>
                          /[<>]/.test(v) ? 'Contiene caracteres inválidos' : true,
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.razonSocial?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Cédula o NIT (Número de Identificación Tributaria) *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.integrantes?.[index]?.nit ? 'is-invalid' : ''}`}
                      {...register(`integrantes.${index}.nit`, {
                        required: 'Cédula o NIT obligatorio',
                        validate: {
                          noCeroInicial: (value) => {
                            const v = String(value || "");
                            return !v.startsWith('0') || 'No puede iniciar en 0';
                          }
                        },
                        pattern: {
                          value: /^\d{6,12}$/,
                          message: 'Solo números',
                        },
                        minLength: {
                          value: 6,
                          message: 'Debe tener mínimo 6 dígitos',
                        },
                        maxLength: {
                          value: 12,
                          message: 'Debe tener máximo 12 dígitos',
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.nit?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Domicilio Principal *</label>
                    <input
                      className={`form-control ${errors.integrantes?.[index]?.domicilio ? 'is-invalid' : ''}`}
                      placeholder="Ciudad/País. Ej.: Bogotá/Colombia"
                      {...register(`integrantes.${index}.domicilio`, {
                        required: 'Domicilio obligatorio',
                        pattern: {
                          value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+\/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/,
                          message: 'Formato inválido. Usa Ciudad/País',
                        },
                        validate: (v) =>
                          v.split('/').length === 2 &&
                            v.split('/')[0].trim().length > 1 &&
                            v.split('/')[1].trim().length > 1
                            ? true
                            : 'Debe contener Ciudad y País válidos',
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.domicilio?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Nombre del Representante Legal *</label>
                    <input
                      className={`form-control ${errors.integrantes?.[index]?.representante ? 'is-invalid' : ''}`}
                      {...register(`integrantes.${index}.representante`, {
                        required: 'Nombre del representante obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        pattern: { value: /^[A-Za-zÀ-ÿ\s]+$/, message: 'Sólo letras y espacios' },
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.representante?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Cédula de ciudadanía del Representante *</label>
                    <input
                      className={`form-control ${errors.integrantes?.[index]?.cedulaRep ? 'is-invalid' : ''}`}
                      {...register(`integrantes.${index}.cedulaRep`, {
                        required: 'Cédula del representante obligatoria',
                        validate: {
                          noCeroInicial: (value) => {
                            const v = String(value || "");
                            return !v.startsWith('0') || 'No puede iniciar en 0';
                          }
                        },
                        pattern: {
                          value: /^\d{6,12}$/,
                          message: 'Solo números',
                        },
                        minLength: {
                          value: 6,
                          message: 'Debe tener mínimo 6 dígitos',
                        },
                        maxLength: {
                          value: 12,
                          message: 'Debe tener máximo 12 dígitos',
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.cedulaRep?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Dirección Notificación Física (Opcional)</label>
                    <input
                      className={`form-control ${errors.integrantes?.[index]?.direccionNotificacion ? 'is-invalid' : ''}`}
                      {...register(`integrantes.${index}.direccionNotificacion`, {
                        minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.direccionNotificacion?.message}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Teléfono de Contacto *</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaPhoneAlt /></span>
                      <input
                        type="text"
                        className={`form-control ${errors.integrantes?.[index]?.telefono ? 'is-invalid' : ''}`}
                        {...register(`integrantes.${index}.telefono`, {
                          required: 'Teléfono obligatorio',
                          pattern: { value: telefonoPattern, message: 'Formato teléfono inválido sin espacios, sólo números. (ej: celular inicia con 3 o fijo inicia por 6 o 0)' },
                        })}
                      />
                      <div className="invalid-feedback">{errors.integrantes?.[index]?.telefono?.message}
                      </div>
                    </div>
                  </div>

                  <div className="form-check mb-3 custom-check d-flex align-items-start pt-3">
                    <input
                      id={`autorizacionOrgano-${index}`}
                      className={`form-check-input ${errors.integrantes?.[index]?.autorizacionOrgano ? 'is-invalid' : ''}`}
                      type="checkbox"
                      {...register(`integrantes.${index}.autorizacionOrgano`, {
                        required: 'Debe aceptar los términos y condiciones'

                      })}
                    />
                    <label className="form-check-label ms-2" htmlFor={`autorizacionOrgano-${index}`}>
                      Declaro que cuento con la autorización expresa del órgano competente, otorgada conforme a los estatutos sociales, para participar en calidad de estructura plural.
                    </label>
                  </div>
                  {errors.integrantes?.[index]?.autorizacionOrgano && (
                    <div className="invalid-feedback d-block">
                      {errors.integrantes?.[index]?.autorizacionOrgano.message}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor={`autorizacionOrganoDocumento-${index}`} className="form-label">
                      Adjuntar documento de autorización del órgano competente *
                    </label>
                    <input
                      className={`form-control ${errors.integrantes?.[index]?.autorizacionOrganoDocumento ? 'is-invalid' : ''}`}
                      type="file"
                      id={`autorizacionOrganoDocumento-${index}`}
                      accept=".pdf, application/pdf"
                      {...register(`integrantes.${index}.autorizacionOrganoDocumento`, {
                        required: "Este documento es obligatorio",
                        validate: {
                          checkFileType: validateFileType,
                          checkFileSize: validateFileSize,
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.integrantes?.[index]?.autorizacionOrganoDocumento?.message}</div>
                  </div>

                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btnAgregar"
            disabled={tipoInscripcion === "individual"}
            onClick={() =>
              appendIntegrante({
                email: "",
                razonSocial: "",
                nit: "",
                domicilio: "",
                representante: "",
                cedulaRep: "",
                direccionNotificacion: "",
                telefono: ""
              })
            }
          >
            <FaPlus /> Agregar Integrante
          </button>
        </div>
      )}

      <div className="text-end mt-5">
        <button type="button" className="btn buttons" onClick={validateStep}>
          Siguiente <FaLongArrowAltRight />
        </button>
      </div>


    </>
  );
}