import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

//Modificar para que ingrese por parametro los datos a mostrar

function CardInicio({ title, text }) {
  return (
    <Row xs={1} md={4} className="g-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Body>
              <Card.Title>25/280</Card.Title>
              <Card.Text>
                Alumnos inhabilitados
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default CardInicio;