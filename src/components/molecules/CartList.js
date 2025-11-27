import React, { useEffect, useState } from "react";
import { getCart, saveCart } from "../../utils/CartUtils";
import ProductServices from "../../services/ProductServices.js";


export default function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar carrito y productos de BD
  useEffect(() => {
    cargarCarrito();
    
    // Escuchar cambios en el carrito
    const handleUpdate = () => cargarCarrito();
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const cargarCarrito = async () => {
    try {
      // 1. Obtener carrito de localStorage (solo IDs y cantidades)
      const cart = getCart(); // [{ id: 1, quantity: 2 }, ...]

      if (cart.length === 0) {
        setCartItems([]);
        setCargando(false);
        return;
      }

      // 2. Obtener productos completos desde la BD
      const response = await ProductServices.getAllProducts();
      const productos = response.data;

      // 3. Enlazar productos con cantidades del carrito
      const detailCart = cart
        .map((item) => {
          const prod = productos.find((p) => p.id === item.id);
          return prod ? { ...prod, quantity: item.quantity } : null;
        })
        .filter(Boolean);

      setCartItems(detailCart);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    } finally {
      setCargando(false);
    }
  };

  // Eliminar producto del carrito
  const removeItem = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter((item) => item.id !== productId);
    saveCart(updatedCart);
  };

  // Actualizar cantidad
  const updateQuantity = (productId, action) => {
    const cart = getCart();
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          let newQty = item.quantity;
          if (action === "increment") newQty++;
          else if (action === "decrement" && item.quantity > 1) newQty--;
          else if (action === "decrement" && item.quantity === 1) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean);

    saveCart(updatedCart);
  };

  if (cargando) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        Tu carrito está vacío. ¡Añade algunos productos!
      </div>
    );
  }

  return (
    <div id="cart-items-container">
      {cartItems.map((item) => {
        const subtotal = (item.price || 0) * (item.quantity || 0);
        return (
          <div
            className="card mb-3 cart-item shadow-sm"
            key={item.id}
            style={{ maxWidth: "540px" }}
          >
            <div className="row g-0 align-items-center">
              {/* Imagen */}
              <div className="col-md-3 d-flex justify-content-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid rounded-start"
                  style={{ height: "100px", objectFit: "contain" }}
                />
              </div>

              {/* Detalles */}
              <div className="col-md-5 text-start">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted">
                    Precio unitario: ${(item.price || 0).toLocaleString("es-CL")}
                  </p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>

              {/* Cantidad y subtotal */}
              <div className="col-md-4 d-flex align-items-center justify-content-center">
                <div className="card-body">
                  <h5 className="card-title subtotal-display">
                    ${subtotal.toLocaleString("es-CL")}
                  </h5>
                  <p className="card-text">Cantidad: {item.quantity}</p>
                  <div className="input-group input-group-sm w-75 mx-auto">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.id, "decrement")}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.id, "increment")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}