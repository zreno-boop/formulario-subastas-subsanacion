# Formulario de Inscripción y Aceptación de Términos y Condiciones
### Proyecto React + Vite

Este proyecto implementa el **Formulario de Inscripción y Aceptación de Términos y Condiciones** para el **Proceso de Subasta de Certificados de Construcción y Desarrollo Emitidos Bajo la Modalidad Anticipada**.

Incluye:
- React + Vite
- React Hook Form
- React Router DOM
- SweetAlert2
- React Icons
- Bootstrap 5+
- React Datepicker
- Validaciones completas
- Arquitectura modular
- Diseño responsive para móviles

---

# Tecnologías Utilizadas

| Tecnología | Uso |
|-----------|-----|
| **React + Vite** | App principal con bundling rápido |
| **React Hook Form** | Gestión del formulario y validaciones |
| **React Router DOM** | Navegación entre páginas |
| **Bootstrap 5+** | Estilos básicos y grid responsivo |
| **SweetAlert2** | Alertas elegantes para éxito y errores |
| **React Icons** | Iconografía |
| **React Datepicker** | Fechas del formulario |

---

# Estructura del Proyecto

```
src/
│
├── App.jsx
├── App.css
├── main.jsx
├── Routes.jsx
│
├── pages/
│   └── Form/
│       ├── Form.jsx
│       └── Form.css
│
└── assets/
```

---

# Instalación

Clonar el repositorio:
```
git clone https://github.com/tuUsuario/tuRepositorio.git
```

Instalar dependencias:
```
npm install
```

Iniciar servidor de desarrollo:
```
npm run dev
```

---

# Dependencias Implementadas

Instalar Bootstrap:
```
npm install bootstrap
```

Instalar React Hook Form:
```
npm install react-hook-form
```

Instalar React Router DOM:
```
npm install react-router-dom
```

Instalar SweetAlert2:
```
npm install sweetalert2
```

Instalar React Icons:
```
npm install react-icons
```

Instalar React Datepicker:
```
npm install react-datepicker
```

---

# Descripción del Formulario

El formulario contiene:

### **I. Información Legal y de Contacto del Proponente**
Incluye validaciones para correo, nombre, cédula, NIT, domicilio, representante legal, dirección, y teléfono.

### **II. Requisitos Financieros y Documentación Legal**
Se solicita información sobre:
- Certificado de existencia
- Estados financieros auditados
- Autorizaciones
- Documentación SARLAFT

### **Garantía de Seriedad de la Oferta**
Incluye:
- Monto
- Tipo de instrumento
- Entidad emisora
- Número del instrumento
- Fechas de expedición y vigencia

### **III. Justificación y Descripción de Proyectos**
Permite agregar múltiples proyectos con validaciones:
- Número
- Nombre
- Ubicación
- Tamaño (m²)
- Estado actual (select)

### **IV. Declaraciones y Aceptación**
Contiene checkbox obligatorio con declaraciones legales.

### **V. Anexos**
Se listan los documentos que deben anexarse al formulario.

---

# Responsive Design

Incluye estilos personalizados en `Form.css`:
- Ajustes de espaciado
- Columnas adaptativas
- Inputs fluidos
- Secciones colapsables en móviles

---

# Validaciones Destacadas

✔ Correo válido (regex)  
✔ Textos sin caracteres prohibidos  
✔ Valores numéricos estrictos (solo números)  
✔ Teléfono válido para Colombia  
✔ Fechas con reglas lógicas  
✔ Mínimos de caracteres  
✔ Mínimo un proyecto agregado  
✔ Aceptación obligatoria de términos  

---

# Deploy
Puedes desplegar este proyecto con:

### **Vercel**
```
vercel
```

### **Netlify**
```
netlify deploy
```

### **GitHub Pages**
(usar plugin de vite-plugin-gh-pages si se requiere)

---

# Autor
Proyecto configurado para facilitar la inscripción al proceso de subasta de certificados de construcción y desarrollo.

---

# Licencia
MIT