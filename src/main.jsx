import React from 'react';
import ReactDOM from 'react-dom/client';
import ImportarUsuarios from './pages/cuentas/ImportarUsuarios.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Login from './pages/login/Login.jsx';
import Sidebar from './components/Sidebar.jsx';

/* Paginas de coordinador */ 
import Configuracion from './pages/coordinador/Configuracion.jsx';
import Inicio from './pages/coordinador/Inicio.jsx';
import Mensajes from './pages/coordinador/Mensajes.jsx';
import Reportes from './pages/coordinador/Reportes.jsx';

const App = () => {
  return (
    <div className="app">
      <div className="content">
        <Routes>
      

          {/* Paginas de coordinador */}

          <Route path="/inicio" element={<Inicio />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />



          <Route path="/importar" element={ <ProtectedRoute> <ImportarUsuarios /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
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