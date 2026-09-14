import { useEffect } from "react";
import { FaLongArrowAltLeft, FaCheck } from 'react-icons/fa';

export default function FormStep4({ register, watch, setValue, errors, back, onSubmitFinal, isSubmitting }) {

  useEffect(() => {
    const hoy = new Date().toLocaleDateString("es-CO");
    setValue("firmaFecha", hoy);
  }, [setValue]);

  return (
    <>
      <div className="borderGreen rounded-4 mb-3 p-4">
        <h4>IV. DECLARACIONES Y ACEPTACIÓN</h4>

        <p>El proponente, que se presente de manera individual o como estructura plural, bajo la gravedad
          de juramento, declara:</p>
        <ul>
          <li className="mb-2">Que los datos e información contenidos en este formato son veraces y susceptibles de verificación.</li>
          <li className="mb-2">Que ha leído y acepta la totalidad de los términos, condiciones y procedimientos establecidos en el
            reglamento de la subasta, incluyendo el requisito de constituir la Garantía de Seriedad de la Oferta
            como respaldo del proceso de subasta.</li>
          <li className="mb-2">Que conoce que el incumplimiento en el pago de los certificados adjudicados dará lugar a
            la ejecución de la Garantía de Seriedad de la Oferta, sin perjuicio de las acciones legales
            adicionales a que haya lugar.
          </li>
          <li className="mb-2">Que acepta los términos indicados en la Política General de Tratamiento y Protección de Datos 
            Personales de la Empresa de Renovación y Desarrollo Urbano de Bogotá D.C y declara bajo la 
            gravedad de juramento que no está incurso en ninguna de las causales de inhabilidad, incompatibilidad 
            y/o conflicto de intereses generales ni especiales o prohibiciones.
          </li>
        </ul>


        <div className="form-check mb-3 custom-check d-flex align-items-start">
          <input
            id="acepta"
            className={`form-check-input ${errors.acepta ? 'is-invalid' : ''}`}
            type="checkbox"
            {...register('acepta', {
              required: 'Debe aceptar los términos y condiciones'

            })}
          />
          <label className="form-check-label ms-2" htmlFor="acepta">
            Declaro bajo la gravedad de juramento que los datos son veraces y que acepto los términos y condiciones de la subasta.
          </label>
        </div>
        {errors.acepta && (
          <div className="invalid-feedback d-block">
            {errors.acepta.message}
          </div>
        )}
      </div>

      <div className="borderGreen rounded-4 mb-3 p-4">
        <h4>V. ANEXOS</h4>

        <p>
          Se adjuntan, como Anexos al presente formato de inscripción,
          los documentos que respaldan la información diligenciada en
          los numerales:
          <br /><br />
          I. “INFORMACIÓN LEGAL Y DE CONTACTO DEL PROPONENTE”, <br />
          II. “REQUISITOS FINANCIEROS Y DOCUMENTACIÓN LEGAL” <br />
          y III. “JUSTIFICACIÓN Y DESCRIPCIÓN DE PROYECTOS”
          <br /><br />
          del presente documento.
        </p>

        <div className="mb-3">
          <label htmlFor="formFileSign" className="form-label">Firma del Representante Legal del proponente
            inscrito de manera individual o del Representante Legal principal del proponente inscrito como estructura plural *</label>
          <input
            className={`form-control ${errors.formFileSign ? 'is-invalid' : ''}`}
            type="file"
            id="formFileSign"
            accept="image/png, image/jpeg, image/jpg"
            {...register("formFileSign", {
              required: "La firma es obligatoria",
              validate: {
                checkFileType: (value) => {
                  const file = value?.[0];
                  if (!file) return "Debe adjuntar un archivo";
                  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                  if (!allowedTypes.includes(file.type)) return "Formato no permitido. Solo imágenes (PNG o JPG)";
                  return true;
                },
                checkFileSize: (value) => {
                  const file = value?.[0];
                  if (!file) return "Debe adjuntar un archivo";
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSize) return "El archivo no debe superar los 5MB";
                  return true;
                },
              },
            })}
          />
          <div className="invalid-feedback">{errors.formFileSign?.message}</div>
        </div>

        <div className="col-md-12">
          <label className="form-label">Nombre completo del Representante Legal del proponente inscrito de manera individual o 
            del Representante Legal principal del proponente inscrito como estructura plural*</label>
          <input
            type="text"
            className={`form-control ${errors.firmaNombre ? 'is-invalid' : ''}`}
            {...register('firmaNombre', {
              required: 'Nombre del representante Legal obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              pattern: { value: /^[A-Za-zÀ-ÿ\s]+$/, message: 'Sólo letras y espacios' },
            })}
          />
          <div className="invalid-feedback">{errors.firmaNombre?.message}</div>
        </div>

        <div className="col-md-12">
          <label className="form-label">Fecha de Diligenciamiento </label>
          <input
            type="text"
            className={`form-control ${errors.firmaFecha ? 'is-invalid' : ''}`}
            disabled
            value={watch("firmaFecha")}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn buttonsBack" onClick={back}>
          <FaLongArrowAltLeft /> Atrás
        </button>

        <button type="submit" className="btn buttons" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar formulario"}  <FaCheck />
        </button>
      </div>
    </>
  );
}