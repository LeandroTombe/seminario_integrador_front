import { Carousel } from "react-bootstrap";
//import RowOfCards from "./RowOfCards";
import React from "react";
import Row from "react-bootstrap/Row";

function myCarousel() {
  return (
    <Carousel interval={null}>
      <Carousel.Item>
        <Row xs={1} md={2} className="g-4">
          title1={"title1"}
          text1={"text1"}
          title2={"title2"}
          text2={"text2"}
          title3={"title3"}
          text3={"text3"}
        </Row>
      </Carousel.Item>
      <Carousel.Item>
        <Row xs={1} md={2} className="g-4">
          title1={"title1"}
          text1={"text1"}
          title2={"title2"}
          text2={"text2"}
          title3={"title3"}
          text3={"text3"}
        </Row>
      </Carousel.Item>
    </Carousel>
  );
}

export default myCarousel;
