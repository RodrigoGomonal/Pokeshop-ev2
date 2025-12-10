import React, { useEffect, useState } from "react";
import MainLayout from "../../templates/MainLayout.js";
import ProductDetailCard from "../../organisms/ProductDetailCard.js";
import RelatedProducts from "../../organisms/RelatedProducts.js";
import { useParams } from "react-router-dom";
import { getCart, saveCart, updateCartCount } from "../../../utils/CartUtils.js";
import ProductServices from "../../../services/ProductServices.js";

export default function DetalleProducto(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductServices.getProductsById(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar el producto');
        console.error('Error al cargar el producto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="text-center mt-5">
          <h3>Producto no encontrado</h3>
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <div className="container mt-4">
            <div className="container text-start mb-1">
              {/* <a href="/Home">Home</a> &gt;{" "}
              <a href="/">Categoría</a> &gt;{" "} 
              <a href="/Productos">Volver</a> */}
            </div>

          <ProductDetailCard product={product} onAddToCart={handleAddToCart} />
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </div>
    </MainLayout>
  );
}