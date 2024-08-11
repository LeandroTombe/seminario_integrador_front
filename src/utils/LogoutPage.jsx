import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Mostrar un mensaje de confirmación de logout
        swal.fire({
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión correctamente.',
            icon: 'success',
            toast: true,
            timer: 2000,
            position: 'top',
            timerProgressBar: true,
            showConfirmButton: false
        });

        // Redirigir al usuario después de un breve retraso
        setTimeout(() => {
            navigate('/login');
        }, 2000); // Tiempo de retraso en ms (2 segundos en este caso)
    }, [navigate]);

    return (
        <div>
            {/* Aquí podrías agregar un mensaje o diseño adicional si lo deseas */}
            <h1>Por favor espera...</h1>
        </div>
    );
};

export default LogoutPage;