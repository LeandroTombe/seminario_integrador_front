import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './LogInStyle.css';

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const legajo = e.target.legajo.value;
    const password = e.target.password.value;

    loginUser(legajo, password);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
      <Row className="w-100 justify-content-center">
        <Col md={5} lg={4}> {/* Ajustado a md={5} para ancho más apropiado */}
          <Card className="p-4 shadow-lg login-card">
            <Card.Body>
              <div className="text-center mb-4">
                <img className="loginLogo mb-3" src="/src/assets/tup_logo.png" alt="Login Logo" />
                <h3 className="mb-3">Iniciar Sesión</h3>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="legajo">
                  <Form.Label>Legajo</Form.Label>
                  <Form.Control
                    type="text"
                    name="legajo"
                    placeholder="Ingrese su legajo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Acceder
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/recuperar-password" className="text-muted">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;