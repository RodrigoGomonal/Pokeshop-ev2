import React, { useEffect, useState } from "react";
import CardProdH from "../atoms/CardProdH";
import '../../App.css';

export default function ProductGrid({ productos }) {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga inicial
    if (productos && productos.length > 0) {
      setCargando(false);
    }
  }, [productos]);

  // 1. Mostrar spinner mientras carga
  if (cargando && (!productos || productos.length === 0)) {
    return (
      <div className="pokeMartBackground rounded-4 pt-5 pb-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="mt-3 text-muted">Cargando novedades...</p>
        </div>
      </div>
    );
  }

  // Filtrar solo los productos activos con stock y tomar los últimos 8
  const productosActivos = productos
    .filter((p) => p.active && p.stock_actual > 0)
    .slice(-8);

  // 2. Si ya cargó pero no hay productos (sin conexión o BD vacía)
  if (productosActivos.length === 0) {
    return (
      <div className="pokeMartBackground rounded-4 pt-4 pb-4">
        <h2 className="text-center fw-bold mb-4 adminTitle">Novedades</h2>
        <div className="alert alert-danger text-center mx-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Sin productos disponibles</strong>
          <br />
          <small>Verifica tu conexión o contacta al administrador.</small>
        </div>
      </div>
    );
  }

  // 3. Mostrar productos normalmente
  return (
    <div className="pokeMartBackground rounded-4 pt-4 pb-3">
      <h2 className="text-center fw-bold mb-4 adminTitle">Novedades</h2>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 p-3">
        {productosActivos.map((p) => (
          <CardProdH key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}