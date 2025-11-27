// src/utils/CartUtils.js

  import  productos  from "../data/Products.js"; 
/**
 * Carga los productos desde localStorage y escucha cambios globales.
 * 
 * @param {Function} setItems - Setter del estado de productos.
 * @param {Function} setPagina - Setter del estado de página (opcional).
 * @returns {Function} cleanup - Remueve el event listener.
 */
/* export const loadCartData = (setItems, setPagina) => {
  // Cargar datos iniciales
  const productos = getProducts();
  if (productos && Array.isArray(productos)) {
    setItems(productos);
  }
  // Definir listener de actualización global
  const actualizar = () => {
    const nuevos = getProducts();
    setItems(nuevos);
    if (setPagina) setPagina(1);
  };

  // Agregar el event listener
  window.addEventListener("products-updated", actualizar);

  // Retornar función de limpieza para useEffect
  return () => window.removeEventListener("products-updated", actualizar);
}; */

// --------------------- Funciones compartidas del carrito ---------------------

const CART_KEY = "pokeStoreCart";

// Obtiene el carrito desde localStorage 
export const getCart = () => {
  const cartJSON = localStorage.getItem(CART_KEY);
  return cartJSON ? JSON.parse(cartJSON) : [];
};
// Guarda el carrito en localStorage y notifica cambios
export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Notifica a todos los componentes que el carrito cambió
  window.dispatchEvent(new Event("cart-updated"));
};
// Actualiza el carrito con una nueva lista de items
export const updateCart = (items) => {
  if (!items || !Array.isArray(items)) return;
  saveProducts(items);
  window.dispatchEvent(new Event("products-updated"));
};
// Elimina completamente el carrito y notifica
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
};
// Actualiza el contador visible en el navbar
export function updateCartCount() {
  const carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  const total = carrito.reduce((sum, item) => sum + item.quantity , 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = total;
  return total;
}

// Escucha global para mantener actualizado el contador siempre
window.addEventListener("cart-updated", updateCartCount);
// --------------------- Agregar producto al carrito ---------------------

/**
 * Agrega un producto al carrito (solo guarda id y cantidad)
 * @param {number} productId - ID del producto
 * @param {number} quantity - Cantidad a agregar
 */
export const addToCart = (productId, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  saveCart(cart);
};

// --------------------- Funciones compartidas del inventario ---------------------

// Copia de seguridad del inventario original
const RESET_INVENTORY = JSON.parse(JSON.stringify(productos));
const PRODUCT_KEY = "productos";
// Inicializa el inventario en localStorage si no existe
let InventarioProductos = JSON.parse(localStorage.getItem(PRODUCT_KEY));
// Si no hay inventario guardado, usa la lista inicial
if (!InventarioProductos) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(productos));
  InventarioProductos = productos;
}
// Obtiene la lista de productos del inventario
export function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];
}
// Guarda la lista de productos en el inventario
export function saveProducts(prodList) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(prodList));
  window.dispatchEvent(new Event("products-updated")); // 🔹 Notificar a React
}
// Resetea el inventario al estado inicial
export function resetInventory() {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(RESET_INVENTORY));
  window.dispatchEvent(new Event("products-updated")); // 🔹 Notificar actualización
}
// -------------------------------------------------------------------------------