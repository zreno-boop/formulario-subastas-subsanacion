import { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import Swal from 'sweetalert2';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import ProgressBar from './ProgressBar';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import LogoRenobo from '../../assets/logoRenobo.png';
import { API_BASE_URL } from '../../config';
import './MultiStepForm.css';

export default function MultiStepForm() {
  const SMMLV_DEFAULT = 1423500;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    clearErrors,
    trigger,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      tipoInscripcion: "",
      email: '',
      razonSocial: '',
      nit: '',
      domicilio: '',
      representante: '',
      cedulaRep: '',
      direccionNotificacion: '',
      telefono: '',
      garantiaMonto: '',
      instrumentoTipo: '',
      entidadEmisora: '',
      instrumentoNumero: '',
      fechaExpedicion: '',
      vigenciaInstrumento: '',
      integrantes: [{
        email: "",
        razonSocial: "",
        nit: "",
        domicilio: "",
        representante: "",
        cedulaRep: "",
        direccionNotificacion: "",
        telefono: ""
      }],
      proyectos: [{
        numero: 1, nombre: '', ubicacion: '', tamano: '', estado: '', numCertificados: '',
        idCatastral: '', situacionJuridica: '', fechaLicencia: '', numUnidades: '', indiceEdificabilidad: '', desgloseArea: ''
      }],
      acepta: false,
      firmaNombre: '',
      firmaFecha: '',
    },
  });

  const tipoInscripcion = useWatch({
    control,
    name: "tipoInscripcion"
  });

  useEffect(() => {
    trigger("integrantes");
  }, [trigger, tipoInscripcion]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "proyectos"
  });

  const {
    fields: fieldsIntegrantes,
    append: appendIntegrante,
    remove: removeIntegrante,
    replace: replaceIntegrantes
  } = useFieldArray({
    control,
    name: "integrantes"
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const next = async () => {
    const valid = await trigger([
      "email",
      "razonSocial",
      "nit",
      "domicilio",
      "representante",
      "cedulaRep",
      "direccionNotificacion",
      "telefono"
    ]);

    if (!valid) return;
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const resetForm = () => {
    reset(); // Reset all form fields to default values
    setStep(1); // Go back to the first step
  };

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return; // Evita envíos dobles
    setIsSubmitting(true);

    // Mostrar SweetAlert2 de espera
    Swal.fire({
      title: 'Enviando formulario...',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <p class="mt-3">Por favor espera mientras procesamos la información...</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const formData = new FormData();



      // Append all text fields
      Object.keys(data).forEach(key => {
        if (key === "proyectos" || key === "integrantes") {
          formData.append(key, JSON.stringify(data[key])); // Stringify projects and integrantes array
        } else if (
          key !== "certificadoExistencia" &&
          key !== "estadosFinancieros" &&
          key !== "autorizacionSubasta" &&
          key !== "sarlaft" &&
          key !== "autorizacionTratamientoDatos" &&
          key !== "componentePlural" &&
          key !== "formFileSign" &&
          key !== "situacionJuridicaDocumento"

        ) {
          formData.append(key, data[key]);
        }
      });

      if (data.proyectos && Array.isArray(data.proyectos)) {
        data.proyectos.forEach((proyecto, index) => {
          if (proyecto.situacionJuridicaDocumento?.[0]) {
            formData.append(`proyectos[${index}].situacionJuridicaDocumento`, proyecto.situacionJuridicaDocumento[0]);
          }
        });
      }

      if (data.integrantes && Array.isArray(data.integrantes)) {
        data.integrantes.forEach((integrante, index) => {
          if (integrante.autorizacionOrganoDocumento?.[0]) {
            formData.append(`integrantes[${index}].autorizacionOrganoDocumento`, integrante.autorizacionOrganoDocumento[0]);
          }
        });
      }

      // Append files
      if (data.certificadoExistencia?.[0])
        formData.append("certificadoExistencia", data.certificadoExistencia[0]);
      if (data.estadosFinancieros?.[0])
        formData.append("estadosFinancieros", data.estadosFinancieros[0]);
      if (data.autorizacionSubasta?.[0])
        formData.append("autorizacionSubasta", data.autorizacionSubasta[0]);
      if (data.sarlaft?.[0])
        formData.append("sarlaft", data.sarlaft[0]);
      if (data.autorizacionTratamientoDatos?.[0])
        formData.append("autorizacionTratamientoDatos", data.autorizacionTratamientoDatos[0]);
      if (data.componentePlural?.[0])
        formData.append("componentePlural", data.componentePlural[0]);
      if (data.formFileSign?.[0])
        formData.append("formFileSign", data.formFileSign[0]);


      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();


      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        throw new Error("El servidor no devolvió una respuesta válida (JSON). Revisa la consola para más detalles.");
      }

      if (!response.ok) {
        throw new Error(result.message || "Error en el servidor");
      }

      Swal.close(); // Cerrar spinner
      Swal.fire({
        title: '¡Formulario enviado!',
        text: 'Tu información ha sido registrada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#AFE951',
      }).then(() => {
        resetForm(); // Reset the form after successful submission
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      Swal.close();
      Swal.fire({
        title: 'Error al enviar el formulario',
        text: error.message || 'Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#FE525E',
      });
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
          <AnimatePresence mode="wait">
            <Motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
            >

              {/* CARD PRINCIPAL */}
              <div className="card cardPpal">
                <div className="card-body cardBodyPpal">

                  {/* BARRA DE PROGRESO DENTRO DEL CARD */}
                  <Motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-4"
                  >
                    <ProgressBar step={step} total={totalSteps} />
                  </Motion.div>

                  {/* CONTENIDO DEL STEP */}
                  {step === 1 && <FormStep1 register={register} errors={errors} watch={watch} setValue={setValue} clearErrors={clearErrors} trigger={trigger} fieldsIntegrantes={fieldsIntegrantes} appendIntegrante={appendIntegrante} removeIntegrante={removeIntegrante} replaceIntegrantes={replaceIntegrantes} next={next} />}
                  {step === 2 && <FormStep2 register={register} errors={errors} control={control} watch={watch} tipoInscripcion={tipoInscripcion} trigger={trigger} resetField={resetField} next={next} back={back} />}
                  {step === 3 && <FormStep3 register={register} errors={errors} control={control} fields={fields} append={append} remove={remove} trigger={trigger} resetField={resetField} next={next} back={back} />}
                  {step === 4 && <FormStep4 register={register} watch={watch} setValue={setValue} errors={errors} back={back} onSubmitFinal={handleSubmit(onSubmit)} isSubmitting={isSubmitting} />}

                </div>
              </div>

            </Motion.div>
          </AnimatePresence>
        </div>
      </form>
    </>
  );
}