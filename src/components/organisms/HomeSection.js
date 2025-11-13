import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductGrid from "../molecules/ProductGridH.js";
import productos from "../../data/Products.js";
import '../../App.css';
export default function SectionNovedades() {
  return (
    <>  
        <section className="container-xxl bg-lechuga py-5 text-center rounded-4 mb-5 pokeMartBackground">
        <Container className="p-4 rounded-4">
            <Row className="align-items-center">
            <Col md={6}>
                <h1 className="fw-bold mb-4">Tienda Pokémon Online</h1>
                <p className="mb-4">
                Bienvenido a PokeStore, tu tienda online de confianza para el cuidado de tu Pokémon.
                Descubre una amplia gama de productos, ofertas exclusivas y envíos rápidos.
                </p>
                <Link to="/productos">
                <Button variant="primary" className="rounded-pill px-4">
                    Ver productos
                </Button>
                </Link>
            </Col>
            <Col md={6}>
                <img
                src="https://images.wikidexcdn.net/mwuploads/wikidex/9/99/latest/20250108072751/Tienda_Pok%C3%A9mon_en_RFVH.png"
                alt="Tienda Pokémon"
                className="img-fluid rounded-5 shadow"
                style={{ height: "300px", objectFit: "contain" }}
                />
            </Col>
            </Row>
        </Container>
        </section>

        <section className="container-xxl bg-carne pb-5 py-4 rounded-4 mb-5">
            
            <ProductGrid productos={productos} />
        </section>
    </>
  );
}
