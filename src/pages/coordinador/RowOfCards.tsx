import React from "react";
import Card from "./Card";

interface Props {
  title1: string;
  text1: string;
  dest1: string;
  title2: string;
  text2: string;
  dest2: string;

  title3: string;
  text3: string;
  dest3: string;
}

function RowOfCards({
  title1,
  text1,
  title2,
  text2,
  title3,
  text3,
  dest1,
  dest2,
  dest3,
}: Props) {
  return (
    <div className="row text-center pb-5 pt-2 px-5 ">
      <div className="col d-flex justify-content-end">
        <Card title={title1} text={text1} destino={dest1} />
      </div>
      <div className="col d-flex justify-content-center">
        <Card title={title2} text={text2} destino={dest2} />
      </div>
      <div className="col d-flex justify-content-start">
        <Card title={title3} text={text3} destino={dest3} />
      </div>
    </div>
  );
}

export default RowOfCards;
