import React from "react";

export default function AdminTitle({ nombre }) {
  return (
    <div className="text-center mt-5">
      <h1 className="fw-bold text-dark mb-3">
        ¡Hola {nombre || "Administrador"}!
      </h1>
      <p className="text-muted fs-5">Bienvenido al panel de control de PokeStore</p>
    </div>
  );
}