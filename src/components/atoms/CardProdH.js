import React from "react";
import { Card } from "react-bootstrap";

export default function CardProdtH({ producto }) {
  if (!producto.activo || producto.stock_actual === 0) return null;
  
  return (
    <div className="col">
      <Card className="h-100 shadow-sm prod-card">
        <a href={`/DetalleProducto/${producto.id}`} className="text-decoration-none">
          <Card.Img
            variant="top"
            src={producto.image}
            alt={producto.name}
            style={{ height: "150px", objectFit: "contain" }}
          />
        </a>
        <Card.Body>
          <Card.Title className="text-center">{producto.name}</Card.Title>
          <div className="d-flex justify-content-between">
            <p className="mb-0 text-muted">{producto.category}</p>
            <p className="mb-0 fw-bold">${producto.price}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
