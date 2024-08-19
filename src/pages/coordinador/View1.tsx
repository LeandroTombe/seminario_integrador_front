// import Card from "./Card";
import React from "react";
import Carrusel from "./Carrusel";
// import Collapse from "./Collapse";
import List from "./List";
// import NavBar from "./NavBar";

function View1() {
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
    /*
   <div className="row">
        <button className="col btn" type="button" data-bs-toggle="button">
          <Card title={"$ 234563,25"} text={"Total recaudado en el mes"} />
        </button>
        <button className="col btn" type="button" data-bs-toggle="button">
          <Card title={"34"} text={"Alumnos pendientes de pago"} />
        </button>
        <button className="col btn" type="button" data-bs-toggle="button">
          <Card title={"55"} text={"Alumnos inhabilitados"} />
        </button>

      </div>
    */
    <>
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
    </>
  );
}
export default View1;
