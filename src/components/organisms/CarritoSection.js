import CartList from "../molecules/CartList";
import CartSummary from "../molecules/CartSummary";
import { useEffect, useState } from "react";
import { updateCartCount } from "../../utils/CartUtils";
import CartReceiptModal from "../molecules/CartReceiptModal";

export default function CarritoCompraSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  // Escuchar cambios en el carrito para actualizar el contador y forzar render
  useEffect(() => {
    // inicializa contador del carrito en el nav
    updateCartCount();

    // cuando se actualiza el carrito (agregar, eliminar, confirmar, etc.)
    const handleCartUpdate = () => {
      updateCartCount(); // refresca contador
      setRefreshKey((k) => k + 1); // cambia clave -> fuerza render
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  return (
    <>  
      <section className="container mt-4 rounded-4 p-4 shadow-sm bg-white">
        <h1 className="text-center mb-5 fw-bold">Mi carrito de compras</h1>
        <div className="container mt-5 mb-5">
          
          <div className="row">
            {/* Columna izquierda: productos */}
            <div className="col-12 col-lg-8" id="cart-items-container">
              <CartList key={`list-${refreshKey}`}/>
            </div>

            {/* Columna derecha: resumen */}
            <div
              className="col-12 col-lg-4 mt-4 mt-lg-0"
              style={{ borderLeft: "1px solid #b9b9b9", height: "auto" }}
            >
              <div className="row ms-1">
                <hr />
                <CartSummary/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CartReceiptModal/>
    </>
  );
}
