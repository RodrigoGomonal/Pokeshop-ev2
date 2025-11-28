import React, { useEffect, useState } from "react";
import { getCart } from "../../utils/CartUtils";
import { getCurrentUser } from "../../utils/UserUtils";
import CartReceiptModal from "./CartReceiptModal";
import AuthRequiredModal from "./AuthRequiredModal";
import ProductServices from "../../services/ProductServices.js";
import CategoryServices from "../../services/CategoryServices";

export default function CartSummary() {
  const [cart, setCart] = useState([]);
  const [cupon, setCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadCart();
    
    const onUpdate = () => loadCart();
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const loadCart = async () => {
    try {
      // 1. Obtener carrito de localStorage (solo IDs y cantidades)
      const cartItems = getCart();
      if (cartItems.length === 0) {
        setCart([]);
        return;
      }

      // 2. Obtener productos y categorías desde BD
      const [productosRes, categoriasRes] = await Promise.all([
        ProductServices.getAllProducts(),
        CategoryServices.getAllCategories()
      ]);

      const productos = productosRes.data;
      const categorias = categoriasRes.data;

      // 3. Enlazar productos con cantidades del carrito
      const detalle = cartItems
        .map((ci) => {
          const p = productos.find((x) => x.id === ci.id);
          if (!p) return null;
          // Buscar nombre de categoría
          const categoria = categorias.find((c) => c.id === p.category_id);
          // Normalizar campos para el modal
          return {
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            quantity: ci.quantity,
            category: categoria ? categoria.name : "Sin categoría",
          };
        })
        .filter(Boolean);

      setCart(detalle);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

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

  const handleOpen = () => {
    const usuario = getCurrentUser();
    if (!usuario) {
      setShowAuthModal(true);
      return;
    }
    setShowReceipt(true);
  };

  const handleClose = () => setShowReceipt(false);
  const handleCloseAuth = () => setShowAuthModal(false);
  
  const handleConfirmPurchase = () => {
    loadCart();
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
      <AuthRequiredModal
        show={showAuthModal}
        onClose={handleCloseAuth}
      />
      <hr />
    </>
  );
}
