import React, { useEffect, useState } from "react";
import MainLayout from "../../templates/MainLayout.js";
import ProductDetailCard from "../../organisms/ProductDetailCard.js";
import RelatedProducts from "../../organisms/RelatedProducts.js";
import { useParams } from "react-router-dom";
import { getCart, saveCart, updateCartCount, getProducts } from "../../../utils/CartUtils.js";

export default function DetalleProducto(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProducts = getProducts();

    const found = storedProducts.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  const handleAddToCart = (product, cantidad) => {
    if (!product) return;

    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + cantidad }
          : item
      );
    } else {
      updatedCart = [...cart, { id: product.id, quantity: cantidad }];
    }

    saveCart(updatedCart);
    updateCartCount();
    window.dispatchEvent(new Event("cart-updated"));
  };

  if (!product) return <div className="text-center mt-5">Producto no encontrado.</div>;

  return (
    <MainLayout>
        <div className="container mt-4">
            <div className="container text-start mb-1">
              {/* <a href="/Home">Home</a> &gt;{" "}
              <a href="/">Categoría</a> &gt;{" "} 
              <a href="/Productos">Volver</a> */}
            </div>

          <ProductDetailCard product={product} onAddToCart={handleAddToCart} />
          <RelatedProducts />
        </div>
    </MainLayout>
  );
}