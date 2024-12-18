// AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem("authTokens") ? 
        JSON.parse(localStorage.getItem("authTokens"))
        : null
    );

    const [user, setUser] = useState(
        localStorage.getItem("authTokens") ? 
        jwtDecode(localStorage.getItem("authTokens"))
        : null
    );

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (usuario, password) => {
        try {
            let url = "http://127.0.0.1:8000/api/v1/auth/login/";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ usuario, password })
            });
    
            const data = await response.json();
            console.log(data);
    
            if (response.status === 200) {
                setAuthTokens(data);
                const decodedUser = jwtDecode(data.refresh);
                setUser(decodedUser);
                localStorage.setItem("authTokens", JSON.stringify(data));
                
                // Redirigir a la página según el rol del usuario
                const userRole = decodedUser.role;
                if (userRole === "Admin") {
                    navigate("/coordinador/reportes");
                } else if (userRole === "Coordinador") {
                    navigate("/coordinador/reportes");
                } else if (userRole === "Alumno") {
                    navigate("/alumno/inicio");
                } else {
                    navigate("/unauthorized");
                }
                
                Swal.fire({
                    title: "Sesión iniciada correctamente",
                    icon: "success",
                    toast: true,
                    timer: 1300,
                    position: 'top',
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else if (response.status === 404 || response.status === 400) {
                Swal.fire({
                    title: data.message,
                    icon: "error",
                    toast: true,
                    timer: 8000,
                    position: 'top',
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            // Verificar si el error es de conexión
            if (error.message.includes('Failed to fetch') || error.message.includes('net::ERR_CONNECTION_REFUSED')) {
                Swal.fire({
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar al servidor. Por favor, inténtelo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                // Manejar otros errores aquí
                Swal.fire({
                    title: 'Error',
                    text: 'Se produjo un error inesperado. Por favor, inténtelo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }};

    const refreshToken = async () => {
        let url = "http://127.0.0.1:8000/api/v1/auth/login/";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh: authTokens.refresh })
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.refresh));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            logoutUser();
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser,
        refreshToken
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (authTokens) {
                const { exp } = jwtDecode(authTokens.access);
                const expirationTime = exp * 1000;
                const currentTime = Date.now();

                if (expirationTime - currentTime < 5 * 60 * 1000) {
                    refreshToken();
                }
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [authTokens, refreshToken]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (authTokens) {
                const { exp } = jwtDecode(authTokens.access);
                const expirationTime = exp * 1000;
                const currentTime = Date.now();

                if (expirationTime < currentTime) {
                    logoutUser();
                }
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [authTokens, logoutUser]);

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

// Export default AuthContext
export default AuthContext;

// Export useAuth hook
export const useAuth = () => useContext(AuthContext);