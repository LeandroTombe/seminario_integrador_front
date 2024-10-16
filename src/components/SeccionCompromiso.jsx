import './SeccionCompromiso.css'
import React, { useState } from 'react';

// Cuando se guarde un valor diferente hay que actualizar en la base de datos

const SeccionConfiguracion = ({ texto, valorInicial }) => {

  return (
    <div className="item">
      <h6>{texto}</h6>
      <h6>$ {valorInicial}</h6>
    </div>
  );
};

export default SeccionConfiguracion