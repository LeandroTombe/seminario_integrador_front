import React from 'react';
import ReactDOM from 'react-dom/client';
import ImportarUsuarios from './pages/importaciones/ImportarUsuarios.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import Login from './pages/cuentas/login/Login.jsx';
import Desautorizacion from './components/Desautorizacion.jsx';

/* Paginas de coordinador */ 
import Configuracion from './pages/coordinador/Configuracion.jsx';
import Inicio from './pages/coordinador/Inicio.jsx';
import Mensajes from './pages/coordinador/Mensajes.jsx';
import Reportes from './pages/coordinador/Reportes.jsx';
import RecuperarPass from './pages/cuentas/login/RecuperarPass.jsx';
import VerificarNuevoPassword from './pages/cuentas/login/VerificarNuevoPassword.jsx';


const App = () => {
  return (
    <div className="app">
      <div className="content">
        <Routes>
      

          {/* Paginas de coordinador */}

          <Route path="/estudiante" element={<ProtectedRoute element={<Inicio />} roles={['Admin', 'Coordinador', 'Alumno']} />} />

          <Route path="/coordinador/inicio" element={<Inicio />} />
          <Route path="/coordinador/mensajes" element={<Mensajes />} />
          <Route path="/coordinador/reportes" element={<Reportes />} />
          <Route path="/coordinador/configuracion" element={<Configuracion />} />
          <Route path="/coordinador/importaciones-validas" element={<ImportarUsuarios />} />



          <Route path="/importar" element={ <ProtectedRoute> <ImportarUsuarios /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPass />} />
          <Route path="/verificar-nuevo-password" element={<VerificarNuevoPassword />} />



          <Route path="/unauthorized" element={<ProtectedRoute element={<Desautorizacion />} />} />

        </Routes>
      </div>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);