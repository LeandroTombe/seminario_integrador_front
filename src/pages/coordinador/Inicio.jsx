import "./Inicio.css";
import Carrusel from "./Carrusel";
import SearchAndFilter from "./ListFilterSearch";
import Layout from "../../Layout";
// fecha y hora de ultima actualizacion
// fecha y hora de eltimo refresco
function Inicio() {
  return (
    <Layout>
      <Carrusel
        alumnosEquivalencias="22"
        alumnosInhabilitados="25"
        alumnosTotal="47"
        pagos="103"
        pagosPendientes="43"
      />
      <SearchAndFilter />
    </Layout>
  );
}

export default Inicio;
