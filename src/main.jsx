import React from 'react'
import ReactDOM from 'react-dom/client'
import ImportarUsuarios from './pages/cuentas/ImportarUsuarios.jsx'
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/login/Login.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <Routes>
          <Route path="/importar" element={ <ProtectedRoute> <ImportarUsuarios /> </ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  </React.StrictMode>,
)
