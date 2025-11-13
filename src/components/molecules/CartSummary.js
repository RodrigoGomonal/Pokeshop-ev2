import React, { useEffect, useState } from "react";
import { getCart, getProducts } from "../../utils/CartUtils";
//import productos from "../../data/Products.js";
import CartReceiptModal from "./CartReceiptModal";

export default function CartSummary() {
  const [cart, setCart] = useState([]);
  const [cupon, setCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  const loadCart = () => {
    const cartItems = getCart();
    const storedProducts = getProducts();

    const detalle = cartItems
      .map((ci) => {
        const p = storedProducts.find((x) => x.id === ci.id);
        if (!p) return null;
        // Normalizar la forma que usa el modal:
        return {
          id: p.id,
          name: p.name ?? p.nombre,
          image: p.image ?? p.imagen,
          price: p.price ?? p.precio ?? 0,
          quantity: ci.quantity ?? ci.cantidad ?? 1,
          category: p.category ?? p.categoria,
        };
      })
      .filter(Boolean);
    setCart(detalle);
  };

  useEffect(() => {
    loadCart();
    const onUpdate = () => loadCart();
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const aplicarCupon = () => {
    if (cupon.trim().toUpperCase() === "PIKACHU10") {
      setDescuento(0.1);
      alert("Cupón aplicado: 10% de descuento");
    } else {
      setDescuento(0);
      alert("Cupón inválido");
    }
  };

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
  const totalConDescuento = Math.round(total * (1 - descuento));

  const handleOpen = () => setShowReceipt(true);
  const handleClose = () => setShowReceipt(false);
  const handleConfirmPurchase = () => {
    // ya vaciamos el carrito dentro del modal (localStorage), pero recargamos el estado local
    loadCart();
    // aquí puedes mostrar una notificación global si quieres
    console.log("Compra confirmada: total", totalConDescuento);
  };

  return (
    <>
      <h3 className="mb-4">
        Total: <strong id="cart-total">${totalConDescuento.toLocaleString("es-CL")}</strong>
      </h3>

      <p>Ingrese el cupón de descuento</p>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Cupón de descuento" value={cupon} onChange={(e) => setCupon(e.target.value)} />
        <button className="btn btn-primary" onClick={aplicarCupon}>Aplicar</button>
      </div>

      <button className="btn btn-success w-100" onClick={handleOpen} disabled={cart.length === 0}>
        <i className="fa-solid fa-cart-shopping"></i> Pagar
      </button>

      <CartReceiptModal
        show={showReceipt}
        onClose={handleClose}
        onConfirm={handleConfirmPurchase}
        cartItems={cart}
        total={totalConDescuento}
      />
      <hr />
    </>
  );
}
