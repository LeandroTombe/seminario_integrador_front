import List from "./List";
import Carrusel from "./Carrusel";
import Sidebar from "./SidebarCoordinador";

function Inicio2() {
  const matriz = [
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
  ];
  return (
    <>
    <div>
      <Sidebar/>
      <Carrusel />
      <List
        data={matriz}
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

export default Inicio2;
