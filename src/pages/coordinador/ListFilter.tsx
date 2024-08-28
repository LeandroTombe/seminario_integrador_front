/** List recibe una matriz de strings y imprime una tabla
 * con filas=elementos y columnas=parte
 * REVISAR
 * el ancho de cada parte varia con su longitud
 * cada cada elemento esta dividido en partes y queda feo fgraficamente > podria tratrse de otra form no como listas
 * agregar titulo a la lista
 * LISTFILTER imprime una lista que cumpla filter en el primer componente del elemento
 * mientras no sea indefinido
 */

import { element } from "prop-types";
import React from "react";

interface Props {
  data: string[][];
  headerL: string[];
  filter?: string;
}

function List({ data, headerL, filter }: Props) {
  const dataFilter: string[][] = data.filter((el) =>
    filter === "" ? el : el[0] === filter
  );
  return (
    <ul className="list-group list-group-flush">
      <li
        className="list-group-item list-group-item-action"
        aria-current="true"
      >
        <ul className="row">
          {headerL.map((parte) => (
            <h6 className="col">{parte}</h6>
          ))}
        </ul>
      </li>
      {dataFilter.map((elemento) => (
        <li
          key={elemento[0]}
          className="list-group-item list-group-item-action"
          aria-current="true"
        >
          <ul className="row">
            {elemento.map((parte) => (
              <div className="col">{parte}</div>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default List;
