import './SeccionConfiguracion.css'
import React, { useState } from 'react';

// Cuando se guarde un valor diferente hay que actualizar en la base de datos

const SeccionConfiguracion = ({ texto, valorInicial }) => {

  return (
    <div className="item">
      <label>{texto}</label>
      <label>{valorInicial}</label>
    </div>
  );
};

export default SeccionConfiguracion