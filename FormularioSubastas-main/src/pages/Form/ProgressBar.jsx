import { motion } from "framer-motion";

export default function ProgressBar({ step, total }) {
  const progress = Math.round((step / total) * 100);

  return (
    <div className="w-100 mb-2">
      
      {/* Texto arriba */}
      <div className="d-flex justify-content-between mb-1">
        <strong>Paso {step} de {total}</strong>
        <strong>{progress}%</strong>
      </div>

      {/* Contenedor barra */}
      <div 
        className="progress" 
        style={{
          height: "14px",
          backgroundColor: "#cccccc",
          borderRadius: "30px",
          overflow: "hidden"
        }}
      >
        {/* Barra animada */}
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "14px",
            background: "var(--color-three)",
            borderRadius: "30px",
          }}
        />
      </div>

    </div>
  );
}