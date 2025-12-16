import React from "react";

export default function AdminTitle({ nombre, tipo }) {
  if (tipo === 1) {
    return (
      <div className="text-center mt-5">
        <h1 className="fw-bold text-dark mb-3">
          ¡Hola Administrador(a) {nombre || "Administrador"}!
        </h1>
        <p className="text-muted fs-5">Bienvenido al panel de control de PokeStore</p>
      </div>
    );
  }
  if (tipo === 2) {
    return (
      <div className="text-center mt-5">
        <h1 className="fw-bold text-dark mb-3">
          ¡¡Hola Vendedor(a) {nombre || "Vendedor"}!
        </h1>
        <p className="text-muted fs-5">Bienvenido a tu espacio en PokeStore</p>
      </div>
    );
  }
  
}