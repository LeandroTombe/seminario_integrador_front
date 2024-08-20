import Sidebar from "./SidebarCoordinador";
import "./Inicio.css";
import List from "./List";
import Carrusel from "./Carrusel";

function AlumnosInhabilitados() {
  const matriz = [
    ["DATOS DE PRUEBA", "-"],
    ["DATOS DE PRUEBA", "-"],
    ["DATOS DE PRUEBA", "-"],
  ];
  return (
    <>
      <div>
        <Sidebar />
        <div className="content">
          <div>
            <Carrusel
              alumnosEquivalencias="22"
              alumnosInhabilitados="25"
              alumnosTotal="47"
              pagos="103"
              pagosPendientes="43"
            />
            <List
              data={matriz}
              headerL={[
                "Legajo",
                "Apellido",
                "nombre",
                "DNI",
                "Correo",
                "Comision",
                "Fecha de inhabilitacion",
                "motivo",
                "monto que debe",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AlumnosInhabilitados;
