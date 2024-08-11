// AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

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

    const loginUser = async (email, password) => {
        let url = "http://127.0.0.1:8000/api/v1/auth/login/";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/coordinador/inicio");
            swal.fire({
                title: "Sesión iniciada correctamente",
                icon: "success",
                toast: true,
                timer: 1300,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false
            });
        } else {
            console.log(response.status);
            swal.fire({
                title: "El email no existe o el password es incorrecta",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    };

    const refreshToken = async () => {
        let url = "http://127.0.0.1:8000/api/v1/auth/refresh/";
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
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            logoutUser();
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
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