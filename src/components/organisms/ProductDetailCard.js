import React, { useState } from "react";
import QuantitySelector from "../molecules/QuantitySelector";
import ButtonAction from "../atoms/ButtonAction";

export default function ProductDetailCard({ product, onAddToCart }) {
  const [cantidad, setCantidad] = useState(1);

  if (!product) return <p>Producto no encontrado.</p>;

  const handleAddToCart = () => {
    onAddToCart(product, cantidad);
  };

  return (
    <div className="container text-start mb-5">
      <div className="row">
        <div
          className="col-md-6 text-center"
          style={{
            borderStyle: "solid",
            borderColor: "#ccc",
            borderWidth: "1px",
            padding: "20px",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ height: "400px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">Categoría: {product.category}</p>
          <h4 className="text-danger">${product.price} CLP</h4>
          <p>{product.description || "Sin descripción disponible"}</p>
          <div className="row mt-5"> 
            <div className="col-md-4"><ButtonAction label="Agregar al Carro" onClick={handleAddToCart} /></div>
            <div className="col-md-8"><QuantitySelector cantidad={cantidad} setCantidad={setCantidad} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
