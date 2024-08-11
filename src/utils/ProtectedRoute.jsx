import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ element: Component, roles = [], ...rest }) => {
    const { user, authTokens } = useContext(AuthContext);

    // Verificar la autenticación y los roles
    const isAuthenticated = authTokens !== null;
    const hasRole = roles.length === 0 || roles.includes(user?.role);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!hasRole) {
        return <Navigate to="/unauthorized" />; // Ruta opcional para manejar acceso denegado
    }

    return Component;
};
export default ProtectedRoute;
