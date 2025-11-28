import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { clearCart } from "../../utils/CartUtils";
import CartServices from "../../services/CartServices.js";
import CartDetailServices from "../../services/CartDetailServices.js";
import InvoiceServices from "../../services/InvoiceServices.js";
import InvoiceDetailServices from "../../services/InvoiceDetailServices.js";
import { getCurrentUser } from "../../utils/UserUtils.js";

export default function CartReceiptModal({ show, onClose, onConfirm, cartItems = [], total: totalProp, descuento = 0 }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [metodoPagoId, setMetodoPagoId] = useState(1);
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [loading, setLoading] = useState(false);

  const total = totalProp ?? cartItems.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      // Cargar dirección del usuario
      const usuario = getCurrentUser();
      if (usuario && usuario.direccion) {
        setDireccionEnvio(usuario.direccion);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const handleConfirm = async () => {
    if (!direccionEnvio.trim()) {
      alert("Por favor ingresa una dirección de envío");
      return;
    }

    setLoading(true);

    try {
      const usuario = getCurrentUser();
      if (!usuario) {
        alert("Error: Usuario no autenticado");
        return;
      }

      // 1. Crear carrito en BD
      const carritoData = {
        usuario_id: usuario.id,
        estado: "activo"
      };
      const carritoRes = await CartServices.createCart(carritoData);
      const carritoId = carritoRes.data.id;

      // 2. Crear detalles del carrito
      for (const item of cartItems) {
        const detalleCarrito = {
          carrito_id: carritoId,
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price,
          subtotal: item.price * item.quantity
        };
        await CartDetailServices.createCartDetail(detalleCarrito);
      }

      // 3. Calcular totales
      const subtotal = Math.round(total / 1.19);
      const iva = total - subtotal;

      // 4. Crear boleta
      const numeroBoleta = `BOL-${Date.now()}-${usuario.id}`;
      const boletaData = {
        numero_boleta: numeroBoleta,
        usuario_id: usuario.id,
        carrito_id: carritoId,
        metodoPago_id: metodoPagoId,
        subtotal: subtotal,
        iva: iva,
        total: total,
        direccion_envio: direccionEnvio,
        estado: "pagado"
      };
      const boletaRes = await InvoiceServices.createInvoice(boletaData);
      const boletaId = boletaRes.data.id;

      // 5. Crear detalles de boleta
      for (const item of cartItems) {
        const detalleBoleta = {
          boleta_id: boletaId,
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price,
          subtotal: item.price * item.quantity
        };
        await InvoiceDetailServices.createInvoiceDetail(detalleBoleta);
      }

      // 6. Actualizar estado del carrito
      await CartServices.updateCart(carritoId, { ...carritoData, estado: "completado" });

      // 7. Limpiar carrito local
      clearCart();

      // 8. Mostrar éxito
      setShowSuccess(true);
      if (onConfirm) onConfirm();

      setTimeout(() => {
        setShowSuccess(false);
        if (onClose) onClose();
      }, 1400);

    } catch (error) {
      console.error("Error al procesar compra:", error);
      alert("Hubo un error al procesar tu compra. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="cart-modal-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1050,
        }}
      />

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
              <div style={{ fontSize: 56 }}>✅</div>
              <h4 style={{ margin: 0 }}>Compra realizada</h4>
              <p style={{ margin: 0, color: "#666" }}>¡Gracias por tu compra!</p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #eee" }}>
            <h5 style={{ margin: 0 }}>🧾 Resumen de compra</h5>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 20, maxHeight: "60vh", overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <div className="alert alert-info text-center">Tu carrito está vacío.</div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#666" }}>
                      <th style={{ padding: "8px 6px" }}>Producto</th>
                      <th style={{ padding: "8px 6px", textAlign: "center" }}>Cant.</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Precio</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((it) => (
                      <tr key={it.id}>
                        <td style={{ padding: "10px 6px", verticalAlign: "middle", display: "flex", gap: 12, alignItems: "center" }}>
                          <img
                            src={it.image}
                            alt={it.name}
                            style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8, border: "1px solid #e6e6e6" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{it.name}</div>
                            <div style={{ fontSize: 12, color: "#777" }}>{it.category}</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 6px", textAlign: "center" }}>{it.quantity}</td>
                        <td style={{ padding: "10px 6px", textAlign: "right" }}>
                          ${it.price.toLocaleString("es-CL")}
                        </td>
                        <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 700 }}>
                          ${(it.price * it.quantity).toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <hr />

                <div className="mb-3">
                  <label className="form-label fw-bold">Método de Pago:</label>
                  <select
                    className="form-select"
                    value={metodoPagoId}
                    onChange={(e) => setMetodoPagoId(parseInt(e.target.value))}
                  >
                    <option value={1}>Efectivo</option>
                    <option value={2}>Tarjeta de Crédito</option>
                    <option value={3}>Tarjeta de Débito</option>
                    <option value={4}>Transferencia</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Dirección de Envío:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Calle 123, Depto 45, Comuna"
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                  />
                </div>

                <div style={{ textAlign: "right", marginTop: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#198754" }}>
                    Total: ${total.toLocaleString("es-CL")}
                  </div>
                  {descuento > 0 && (
                    <small className="text-success">Descuento aplicado: {(descuento * 100)}%</small>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderTop: "1px solid #eee" }}>
            <div style={{ alignSelf: "center", color: "#666" }}>
              {cartItems.length} artículo(s)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button
                className="btn btn-success"
                onClick={handleConfirm}
                disabled={cartItems.length === 0 || loading}
              >
                {loading ? "Procesando..." : "Confirmar compra"}
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
  descuento: PropTypes.number,
};