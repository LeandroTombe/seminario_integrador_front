import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import ListFilter from "./ListFilter";

function ButtonsExample() {
  const [searching, setSearching] = useState(""); // Estado para manejar el valor del input

  // Función para manejar los cambios en el input
  const manejarCambio = (event) => {
    setSearching(event.target.value);
  };

  // Función para manejar el envío del formulario
  const manejarEnvio = (event) => {
    event.preventDefault();
    console.log(searching);
  };
  return (
    <>
      <Form onSubmit={manejarEnvio}>
        <InputGroup className="mb-3">
          <Button id="searchButton" type="submit" variant="outline-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </Button>
          <Form.Control
            id="searchText"
            placeholder="Buscar"
            value={searching}
            onChange={manejarCambio}
          />
        </InputGroup>
      </Form>
      <ListFilter
        filter={searching}
        data={[
          [
            "25134",
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
    </>
  );
}

export default ButtonsExample;
