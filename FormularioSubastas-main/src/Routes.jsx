import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
//import SubsanacionForm from './pages/Form/SubsanacionForm';
import SubsanacionFormSarlaft from './pages/Form/SubsanacionFormSarlaft';

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/formulario">
      <Switch>
        <Route path="/" element={<SubsanacionFormSarlaft />} />
      </Switch>
    </BrowserRouter>
  );
}
