/** List recibe una matriz de strings y imprime una tabla
 * con filas=elementos y columnas=parte
 * REVISAR
 * el ancho de cada parte varia con su longitud
 * cada cada elemento esta dividido en partes y queda feo fgraficamente > podria tratrse de otra form no como listas
 * agregar titulo a la lista
 */

import React from "react";

interface Props {
  data: string[][];
  headerL: string[];
}

function List({ data, headerL }: Props) {
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
      {data.map((elemento) => (
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
