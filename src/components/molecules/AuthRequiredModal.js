import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRequiredModal({ show, onClose }) {
  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = () => {
    // Guardar URL de retorno
    localStorage.setItem("redirectAfterLogin", "/carritoCompra");
    navigate("/Login");
  };

  const handleRegister = () => {
    localStorage.setItem("redirectAfterLogin", "/carritoCompra");
    navigate("/RegisterUsu");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1050,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1060,
          pointerEvents: "none",
        }}
      >
        <div
          className="card shadow-lg"
          style={{
            width: "min(450px, 90%)",
            pointerEvents: "auto",
          }}
        >
          {/* Header */}
          <div className="card-header bg-danger text-dark d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-lock-fill me-2"></i>
              Autenticación Requerida
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body */}
          <div className="card-body text-center">
            <div className="mb-3">
              <i className="bi bi-person-circle" style={{ fontSize: "4rem", color: "#428CFF" }}></i>
            </div>
            <h5 className="mb-3">Debes iniciar sesión para continuar</h5>
            <p className="text-muted">
              Para realizar una compra necesitas tener una cuenta activa.
            </p>
          </div>

          {/* Footer */}
          <div className="card-footer bg-light d-flex gap-2 justify-content-center">
            <button
              className="btn btn-primary"
              onClick={handleLogin}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={handleRegister}
            >
              <i className="bi bi-person-plus me-2"></i>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </>
  );
}