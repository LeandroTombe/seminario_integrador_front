import "./Inicio.css";
import Carrusel from "./Carrusel";
import SearchAndFilter from "./ListFilterSearch";
import Layout from "../../Layout";
import AlumnosCuatrimestre from "./AlumnosCuatrimestre"
// fecha y hora de ultima actualizacion
// fecha y hora de eltimo refresco
function Inicio() {
  return (
    <Layout>
      <h1>Inicio</h1>
      <AlumnosCuatrimestre/>
    </Layout>
  );
}

export default Inicio;
