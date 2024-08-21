import Sidebar from "./SidebarCoordinador";
import "./Inicio.css";
import List from "./List";
import Carrusel from "./Carrusel";
// fecha y hora de ultima actualizacion
// fecha y hora de eltimo refresco
function Inicio() {
  return (
    <>
      <Sidebar />
      <div className="content">
        <h1>Inicio</h1>
        <Carrusel
          alumnosEquivalencias="22"
          alumnosInhabilitados="25"
          alumnosTotal="47"
          pagos="103"
          pagosPendientes="43"
        />
        <List
          data={[
            [
              "22345",
              "desza joaquin",
              "$ 10",
              "123414",
              "2356257",
              "43784638",
              "pendiente",
            ],
            [
              "23453",
              "ramon valdez",
              "20040",
              "1241514",
              "4553767",
              "348364838",
              "pendiente",
            ],
            [
              "12344",
              "peter parker",
              "$33123",
              "544567",
              "4374584368",
              "346834883",
              "pagado",
            ],
          ]}
          headerL={[
            "Legajo",
            "Nombre",
            "Monto",
            "Mora",
            "Total",
            "Pagado",
            "Estado",
          ]}
        />
      </div>
    </>
  );
}

export default Inicio;
