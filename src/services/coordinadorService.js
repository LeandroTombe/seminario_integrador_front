import Swal from 'sweetalert2';


export const getConfiguracionCuotas = async (authTokens) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/estudiantes/configuracionCuotas/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authTokens.access}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch configuration");
    }

    return response.json();
};


export const updateConfiguracionCuotas = async (authTokens, configuracion) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/estudiantes/configuracionCuotas/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authTokens.access}`
        },
        body: JSON.stringify(configuracion)
    });

    if (response.ok) {
        Swal.fire({
            title: "Valores modificados correctamente",
            icon: "success",
            toast: true,
            timer: 1500,
            position: 'top',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    } else {
        Swal.fire({
            title: "Error al modificar los valores",
            icon: "error",
            toast: true,
            timer: 6000,
            position: 'top',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    }

    return response.json();
};