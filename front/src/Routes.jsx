import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import MultiStepForm from './pages/Form/MultiStepForm';

export default function AppRoutes() { // Renombré 'Routes' a 'AppRoutes' para evitar confusión con el import
  return (
    // AÑADE EL BASENAME: Esto le dice al router que todas las rutas internas 
    // deben construirse y ser navegadas a partir de /formulario/
    <BrowserRouter basename="/formulario"> 
      <Switch>
        {/* Tu componente principal se cargará cuando la URL sea: 
            https://maps.renobo.com.co/formulario/ 
            (que es la raíz del router después del basename) */}
        <Route path="/" element={<MultiStepForm />} />
      </Switch>
    </BrowserRouter>
  );
}