import './SeccionCompromiso.css'
import React, { useState } from 'react';

// Cuando se guarde un valor diferente hay que actualizar en la base de datos

const SeccionConfiguracion = ({ texto, valorInicial }) => {

  return (
    <div className="item">
      <h5>{texto}</h5>
      <h5>{valorInicial}</h5>
    </div>
  );
};

export default SeccionConfiguracion