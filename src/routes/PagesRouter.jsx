import { Routes, Route } from "react-router-dom";

import ImportarUsuarios from "../pages/importaciones/ImportarUsuarios.jsx";

/* Paginas de autorizacion y autenticacion */
import LogoutPage from "../utils/LogoutPage.jsx";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import Login from "../pages/cuentas/login/Login.jsx";
import Desautorizacion from "../utils/Desautorizacion.jsx";
import RecuperarPass from "../pages/cuentas/login/RecuperarPass.jsx";
import VerificarNuevoPassword from "../pages/cuentas/login/VerificarNuevoPassword.jsx";

/* Paginas de alumno */
import AlumnoInicio from "../pages/alumno/AlumnoInicio.jsx";
import AlumnoMensajes from "../pages/alumno/AlumnoMensajes.jsx";
import AlumnoTramites from "../pages/alumno/AlumnoTramites.jsx";

/* Paginas de coordinador */
import Configuracion from "../pages/coordinador/Configuracion.jsx";
import Inicio from "../pages/coordinador/Inicio.jsx";
import Mensajes from "../pages/coordinador/Mensajes.jsx";
import Reportes from "../pages/coordinador/Reportes.jsx";

const PagesRouter = () => {
    return (
        <>
            <Routes>
                {/* Paginas de alumno */}
                <Route
                    path="/alumno/inicio"
                    element={
                        <ProtectedRoute element={<AlumnoInicio />} roles={["Alumno"]} />
                    }
                />
                <Route
                    path="/alumno/mensajes"
                    element={
                        <ProtectedRoute element={<AlumnoMensajes />} roles={["Alumno"]} />
                    }
                />
                <Route
                    path="/alumno/tramites"
                    element={
                        <ProtectedRoute element={<AlumnoTramites />} roles={["Alumno"]} />
                    }
                />
                {/* Paginas de coordinador */}
                <Route
                    path="/estudiante"
                    element={
                        <ProtectedRoute
                            element={<Inicio />}
                            roles={["Admin", "Coordinador", "Alumno"]}
                        />
                    }
                />
                <Route path="/coordinador/inicio" element={<Inicio />} />
                <Route path="/coordinador/mensajes" element={<Mensajes />} />
                <Route path="/coordinador/reportes" element={<Reportes />} />
                <Route path="/coordinador/configuracion" element={<Configuracion />} />
                <Route
                    path="/coordinador/importaciones-validas"
                    element={<ImportarUsuarios />}
                />
                <Route
                    path="/importar"
                    element={
                        <ProtectedRoute>
                            {" "}
                            <ImportarUsuarios />{" "}
                        </ProtectedRoute>
                    }
                />
                {/* Paginas de autorizacion */}
                <Route path="/" element={<Login />} />
                <Route path="/recuperar-password" element={<RecuperarPass />} />
                <Route
                    path="/verificar-nuevo-password"
                    element={<VerificarNuevoPassword />}
                />
                <Route path="/logout" element={<LogoutPage />} />{" "}
                {/* Ruta para la página de logout */}
                <Route
                    path="/unauthorized"
                    element={<ProtectedRoute element={<Desautorizacion />} />}
                />
            </Routes>
        </>
    );
};

export default PagesRouter;
