import { Carousel } from "react-bootstrap";
import RowOfCards from "./RowOfCards";
import React from "react";

function myCarousel() {
  return (
    <Carousel interval={null}>
      <Carousel.Item>
        <RowOfCards
          title1={"title1"}
          text1={"text1"}
          title2={"title2"}
          text2={"text2"}
          title3={"title3"}
          text3={"text3"}
        />
      </Carousel.Item>
      <Carousel.Item>
        <RowOfCards
          title1={"title1"}
          text1={"text1"}
          title2={"title2"}
          text2={"text2"}
          title3={"title3"}
          text3={"text3"}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default myCarousel;
