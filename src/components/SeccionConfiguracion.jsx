import './SeccionConfiguracion.css'
import React, { useState } from 'react';

// Cuando se guarde un valor diferente hay que actualizar en la base de datos

const SeccionConfiguracion = ({ texto, valorInicial }) => {
  const [value, setValue] = useState(valorInicial);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="item">
      <label>{texto}</label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span className="default-value">{value}</span>
      )}
      <button onClick={handleToggle}>
        {isEditing ? 'Guardar' : 'Modificar'}
      </button>
    </div>
  );
};

export default SeccionConfiguracion