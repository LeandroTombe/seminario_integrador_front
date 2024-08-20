import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  text: string;
  destino: string;
}

function Card({ title, text, destino }: Props) {
  return (
    <NavLink
      to={"/coordinador/" + destino}
      className="card"
      style={{
        width: "200px",
        textDecoration: "none",
      }}
    >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
      </div>
    </NavLink>
  );
}

export default Card;
