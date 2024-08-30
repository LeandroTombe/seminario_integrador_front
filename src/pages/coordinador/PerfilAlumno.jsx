import Layout from "../../Layout";
import React from "react";

const PerfilAlumno = ({ legajo, nombre }) => {
  return (
    <Layout>
      legajo nro: {legajo}
      perfil de {nombre}
      DATOS...
    </Layout>
  );
};

export default PerfilAlumno;
