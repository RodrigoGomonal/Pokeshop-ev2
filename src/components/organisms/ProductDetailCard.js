import React, { useEffect ,useState } from "react";
import QuantitySelector from "../molecules/QuantitySelector";
import ButtonAction from "../atoms/ButtonAction";
import CategoryServices from "../../services/CategoryServices.js";

export default function ProductDetailCard({ product, onAddToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [categoryName, setCategoryName] = useState("Cargando...");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (product?.category_id) {
          const response = await CategoryServices.getCategoriesById(product.category_id);
          setCategoryName(response.data.name);
        } else {
          setCategoryName("Sin categoría");
        }
      } catch (error) {
        console.error("Error al cargar la categoría:", error);
        setCategoryName("Categoría no disponible");
      }
    };

    fetchCategory();
  }, [product?.category_id]);

  if (!product) return <p>Producto no encontrado.</p>;

  const handleAddToCart = () => {
    onAddToCart(product, cantidad);
  };

  return (
    <div className="container text-start mb-5">
      <div className="row g-4">
        <div className="col-md-6">
          <div
            className="position-relative overflow-hidden rounded-3 shadow-sm bg-light"
            style={{
              padding: "40px",
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid"
              style={{ height: "400px", objectFit: "contain", transition: "transform 0.3s ease" }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">Categoría: {categoryName}</p>
          <h4 className="text-danger">${product.price} CLP</h4>
          <p>{product.description || "Sin descripción disponible"}</p>
          <div className="row mt-5"> 
            <div className="col-md-4"><ButtonAction label="Agregar al Carro" onClick={handleAddToCart} /></div>
            <div className="col-md-8"><QuantitySelector cantidad={cantidad} setCantidad={setCantidad} /></div>
          </div>

          <div className="mt-4 p-3 bg-light rounded-3 text-center">
            <div className="row g-3 small text-muted">
              <div className="col-6">
                <i className="bi bi-truck me-2"></i>
                Envío a todo Chile
              </div>
              <div className="col-6">
                <i className="bi bi-shield-check me-2"></i>
                Compra segura
              </div>
              <div className="col-6">
                <i className="bi bi-arrow-clockwise me-2"></i>
                Devolución gratis
              </div>
              <div className="col-6">
                <i className="bi bi-star-fill me-2"></i>
                Producto original
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 
