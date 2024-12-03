import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './LogInStyle.css';

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    console.log(e.target.usuario.value);
    e.preventDefault();
    const usuario = e.target.usuario.value;
    const password = e.target.password.value;

    loginUser(usuario, password);
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
                <Form.Group className="mb-3" controlId="usuario">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    placeholder="Ingrese su usuario"
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;