import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import SubsanacionForm from './pages/Form/SubsanacionForm';

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/formulario">
      <Switch>
        <Route path="/" element={<SubsanacionForm />} />
      </Switch>
    </BrowserRouter>
  );
}