import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { clearCart } from "../../utils/CartUtils";

export default function CartReceiptModal({ show, onClose, onConfirm, cartItems = [], total: totalProp, onRefresh }) {
  const [showSuccess, setShowSuccess] = useState(false);

  // calcular total local si no viene
  const total = totalProp ?? cartItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

  // bloquear scroll cuando modal está abierto
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const handleConfirm = () => {
    // animación de éxito
    setShowSuccess(true);
    // 🔥 Vaciar carrito y notificar actualización
    clearCart();
    
    if (onRefresh) onRefresh();
    
    // Llamada de callback externo si se desea
    if (typeof onConfirm === "function") onConfirm();

    // cerrar después de la animación
    setTimeout(() => {
      setShowSuccess(false);
      if (typeof onClose === "function") onClose();
    }, 1400);
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-modal-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1050,
        }}
        onClick={() => { /* click fuera NO cierra (requisito) */ }}
      />

      {/* Modal */}
      <div
        className="cart-modal d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1060,
          pointerEvents: "none",
        }}
      >
        <div
          className="modal-card shadow-lg"
          style={{
            width: "min(920px, 95%)",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            pointerEvents: "auto",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Success overlay */}
          {showSuccess && (
            <div style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              background: "rgba(255,255,255,0.95)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              padding: 20,
            }}>
              <div style={{
                fontSize: 56,
                lineHeight: 1,
                transform: "scale(1)",
                transition: "transform .25s ease",
              }}>🤑</div>
              <h4 style={{ margin: 0 }}>Compra realizada</h4>
              <p style={{ margin: 0, color: "#666" }}>¡Gracias por tu compra!</p>
            </div>
          )}

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #eee" }}>
            <h5 style={{ margin: 0 }}>🧾 Resumen de compra</h5>
            <button
              aria-label="Cerrar"
              onClick={() => typeof onClose === "function" && onClose()}
              style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 20, maxHeight: "60vh", overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <div className="alert alert-info text-center">Tu carrito está vacío.</div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#666" }}>
                      <th style={{ padding: "8px 6px" }}>Producto</th>
                      <th style={{ padding: "8px 6px", textAlign: "center" }}>Cantidad</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Precio ud.</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((it) => (
                      <tr key={it.id}>
                        <td style={{ padding: "10px 6px", verticalAlign: "middle", display: "flex", gap: 12, alignItems: "center" }}>
                          <img
                            src={it.image || it.imagen || ""}
                            alt={it.name || it.nombre || "producto"}
                            style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8, border: "1px solid #e6e6e6" }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/eee/aaa?text=N/A"; }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, textAlign: "left" }}>{it.name ?? it.nombre}</div>
                            <div style={{ fontSize: 12, color: "#777", textAlign: "left" }}>{(it.category || it.categoria) ?? ""}</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 6px", textAlign: "center" }}>{it.quantity ?? it.cantidad ?? 1}</td>
                        <td style={{ padding: "10px 6px", textAlign: "right" }}>
                          ${(it.price ?? it.precio ?? 0).toLocaleString("es-CL")}
                        </td>
                        <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 700 }}>
                          ${((it.price ?? it.precio ?? 0) * (it.quantity ?? it.cantidad ?? 1)).toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14, gap: 18 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#666" }}>Total</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#198754" }}>
                      ${total.toLocaleString("es-CL")}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: 16, borderTop: "1px solid #eee" }}>
            <div style={{ alignSelf: "center", color: "#666" }}>
              {cartItems.length} artículo(s)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => typeof onClose === "function" && onClose()}
              >
                Cerrar
              </button>
              <button
                className="btn btn-success"
                onClick={handleConfirm}
                disabled={cartItems.length === 0}
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CartReceiptModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  cartItems: PropTypes.array,
  total: PropTypes.number,
};
