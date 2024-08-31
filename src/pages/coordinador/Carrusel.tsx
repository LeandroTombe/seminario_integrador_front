import { Carousel } from "react-bootstrap";
import RowOfCards from "./RowOfCards";
import React from "react";

interface Props {
  alumnosTotal: string;
  alumnosInhabilitados: string;
  alumnosEquivalencias: string;
  pagos: string;
  pagosPendientes: string;
}

function myCarousel({
  alumnosTotal,
  alumnosInhabilitados,
  alumnosEquivalencias,
  pagos,
  pagosPendientes,
}: Props) {
  const data = [
    // card alumnos inhabiltados
    [
      alumnosInhabilitados + " / " + alumnosTotal,
      "ALUMNOS INHABILITADOS",
      "Alumnos inhabilitados",
    ],
    // listado de alumnos
    [alumnosTotal, "Total Alumnos", "inicio"],
    // listado de pagos realizados
    [pagos, "Pagos Realizados", "pagos"],
  ];

  return (
    <Carousel interval={null}>
      <Carousel.Item>
        <RowOfCards
          title1={data[0][0]}
          text1={data[0][1]}
          dest1={data[0][2]}
          title2={data[1][0]}
          text2={data[1][1]}
          dest2={data[1][2]}
          title3={data[2][0]}
          text3={data[2][1]}
          dest3={data[2][2]}
        />
      </Carousel.Item>
      <Carousel.Item>
        <RowOfCards
          title1={"title1"}
          text1={"text1"}
          dest1="123424"
          title2={"title2"}
          text2={"text2"}
          dest2="123213"
          title3={"title3"}
          text3={"text3"}
          dest3="123442"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default myCarousel;
