import React from 'react';
import Badge from 'react-bootstrap/Badge';
import SeccionCompromiso from './SeccionCompromiso'; // Asegúrate de tener este componente

const InfoCompromiso = ({ compromiso }) => {
  return (
    <div className="conteinerInfo">
      <Badge bg="primary" className="mb-3">
        Año: {compromiso.año} Cuatrimestre: {compromiso.cuatrimestre}
      </Badge>
      <h2>Valores de cuotas y moras:</h2>
      <SeccionCompromiso texto="Valor de matrícula" valorInicial={compromiso.importe_matricula} />
      <SeccionCompromiso texto="Valor de cuota completa" valorInicial={compromiso.importe_completo} />
      <SeccionCompromiso texto="Valor de cuota reducida" valorInicial={compromiso.importe_reducido} />
      <SeccionCompromiso texto="Valor de primer mora completa" valorInicial={compromiso.importe_pri_venc_comp} />
      <SeccionCompromiso texto="Valor de segunda mora completa" valorInicial={compromiso.importe_seg_venc_comp} />
      <SeccionCompromiso texto="Valor de primer mora reducida" valorInicial={compromiso.importe_pri_venc_red} />
      <SeccionCompromiso texto="Valor de segunda mora reducida" valorInicial={compromiso.importe_seg_venc_red} />
    </div>
  );
};

export default InfoCompromiso;