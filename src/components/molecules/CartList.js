import React, { useEffect, useState } from "react";
import { getCart, saveCart, updateCartCount, getProducts } from "../../utils/CartUtils";
//import productos from "../../data/Products.js";

export default function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const [cargado, setCargado] = useState(false);
  ///const [productos, setProductos] = useState([]);

  // Cargar el carrito al montar el componente
  useEffect(() => {
    // Obtener el carrito actual
      const cart = getCart();
      // Carga los productos más recientes desde localStorage
      const storedProducts = getProducts();
      //setProductos(storedProducts);
      
      // Enlazar los productos por id
      const detailCart = cart.map(item => {
        const prod = storedProducts.find(p => p.id === item.id);
        return prod ? { ...prod, quantity: item.quantity } : null;
      }).filter(Boolean); // quita los null por si algún id ya no existe
      setCartItems(detailCart);
      setCargado(true);
  }, []);
  // Sincroniza el carrito en localStorage y estado
  const syncCart = (updatedCart) => {
    saveCart(updatedCart);
    setCartItems(updatedCart);
    updateCartCount();
    window.dispatchEvent(new Event("cart-updated")); // 🔔 notificar cambio
  };
  // Función para eliminar un producto del carrito
  const removeItem = (productName) => {
    const updatedCart = cartItems.filter((item) => item.name !== productName);
    saveCart(updatedCart);
    setCartItems(updatedCart);
    updateCartCount();
  };
  // Función para actualizar cantidad de un producto en el carrito
  const updateQuantity = (productName, action) => {
    const updatedCart = cartItems.map((item) => {
      if (item.name === productName) {
        let newQty = item.quantity;
        if (action === "increment") newQty++;
        else if (action === "decrement" && item.quantity > 1) newQty--;
        else if (action === "decrement" && item.quantity === 1) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean); // elimina nulls (productos borrados)

    saveCart(updatedCart);
    setCartItems(updatedCart);
    updateCartCount();
    syncCart(updatedCart);
  };
  // Si está vacío muestra un mensaje
  if (cargado && cartItems.length === 0) {
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
            data-name={item.name}
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
                    Precio unitario: $
                    {(item.price || 0).toLocaleString("es-CL")}
                  </p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item.name)}
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
                      onClick={() => updateQuantity(item.name, "decrement")}
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
                      onClick={() => updateQuantity(item.name, "increment")}
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