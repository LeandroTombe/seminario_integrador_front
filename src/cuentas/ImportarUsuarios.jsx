import { useState } from 'react';
import './ImportarUsuarios.css';

const ImportarUsuarios = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/importar_usuarios/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Usuarios importados con éxito.');
      } else {
        const errorData = await response.json();
        setMessage(`Error al importar usuarios: ${JSON.stringify(errorData.errors)}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Importar Usuarios</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="input"
        />
        <button type="submit" className="button">
          Importar
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ImportarUsuarios;