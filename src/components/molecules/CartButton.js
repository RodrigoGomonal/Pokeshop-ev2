import ButtonLink from "../atoms/ButtonLink";
import CartCount from "../atoms/CartCount";
import { useEffect, useState } from "react";
import { updateCartCount } from "../../utils/CartUtils";

export default function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Actualizar al montar
    setCount(updateCartCount());

    // Escuchar cambios en el carrito (evento personalizado)
    const handleCartUpdate = () => {
      const newCount = updateCartCount();
      setCount(newCount);
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  return (
    <div className="position-relative align-items-center d-flex me-3">
      <ButtonLink label="Carrito" href="/carritoCompra" variant="success" icon="cart" />
      {count > 0 && <CartCount count={count} />}
    </div>
  );
}
