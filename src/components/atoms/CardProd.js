import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";

export default function CardProd({ producto, onAddToCart }) {
  if (!producto.activo || producto.stock_actual === 0) return null;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(producto.id);
  };

  return (
    <motion.div
      className="col"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-100 border-0 shadow-sm rounded-4 overflow-hidden"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Redirige a la pagina detalle pasando el id por el link */}
        <a href={`/detalleProducto/${producto.id}`} className="text-decoration-none text-dark">
          <div className="text-center p-3 bg-light">
            <Card.Img
              variant="top"
              src={producto.image}
              alt={producto.name}
              style={{
                height: "150px",
                objectFit: "contain",
                transition: "transform 0.3s ease",
              }}
              className="hover-zoom"
            />
          </div>
        </a>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="text-center fw-bold">{producto.name}</Card.Title>
            <p className="text-center text-muted small mb-2">{producto.category}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="fw-bold text-danger">${producto.price}</span>
            <button
              className="btn btn-success btn-sm rounded-pill px-3"
              onClick={handleAdd}
            >
              Añadir
            </button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}