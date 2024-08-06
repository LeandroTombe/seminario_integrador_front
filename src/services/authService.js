import Swal from 'sweetalert2';


export const recuperarPassword = async (email, navigate) => {
    // Mostrar mensaje de carga
    Swal.fire({
      title: 'Mandando correo, espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      // Cerrar el mensaje de carga
      Swal.close();
  
      if (response.ok) {
        navigate("/verificar-nuevo-password");
        Swal.fire({
          title: "Correo de recuperación enviado. Verifique su bandeja de entrada.",
          icon: "success",
          toast: true,
          timer: 3000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error al enviar el correo de recuperación",
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
  
      // Cerrar el mensaje de carga en caso de error
      Swal.close();
  
      Swal.fire({
        title: "Error al enviar el correo de recuperación",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
};
  



export const validarPassword = async (password, password2, otp, navigate) => {
    // Mostrar mensaje de carga
    Swal.fire({
      title: 'Modificando contraseña, espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/resetpasswordupdate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, password2, otp }),
      });
  
      // Cerrar el mensaje de carga
      Swal.close();
  
      if (response.ok) {
        navigate("/login");
        Swal.fire({
          title: "Password actualizado correctamente",
          icon: "success",
          toast: true,
          timer: 3000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        const errorData = await response.json();
        // Si errorData es un array, manejar cada error individualmente
        let errorMessage = "Error al modificar el password";
        if (Array.isArray(errorData) && errorData.length > 0) {
          errorMessage = errorData.map(err => err[1].join(' ')).join(' ');
        } else if (errorData.msg) {
          errorMessage = errorData.msg;
        }
        Swal.fire({
          title: errorMessage,
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
  
      // Cerrar el mensaje de carga
      Swal.close();
  
      Swal.fire({
        title: "Error al modificar el password",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };