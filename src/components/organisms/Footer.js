import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Logo from "../atoms/Logo";
import '../../App.css';

export default function Footer() {
  return (
    <footer className="footer py-4 shadow-sm w-100 mt-5 pokeMartBackground">
      <Container>
        <Row className="row-cols-1 row-cols-lg-2">
          <Col lg={7}>
            <Row className="mb-2">
              <Col xs={6} lg={3}>
                <Logo />
              </Col>
            </Row>
            <Row>
              <div className="d-flex gap-4 fs-4 text-star">
                <p className="mb-0">© 2025 PokeStore</p>
              </div>
            </Row>
          </Col>
          <Col lg={4}>
            <p>¡Suscríbete para recibir nuevas ofertas!</p>
            <Form className="d-flex">
              <Form.Control type="email" placeholder="Correo electrónico" />
              <Button variant="success" type="button">
                Suscribirse
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
