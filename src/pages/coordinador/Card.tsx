import React from "react";

interface Props {
  title: string;
  text: string;
}

function Card({ title, text }: Props) {
  return (
    <div
      className="card"
      style={{
        width: "200px",
      }}
    >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
}
export default Card;
