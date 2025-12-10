import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductServices from "../../services/ProductServices.js";

export default function RelatedProducts({ currentProductId }) {
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductServices.getProductsByCategId(currentProductId);
        setRelacionados(response.data);
      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
        setRelacionados([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId]);

  if (loading) {
    return (
      <section className="container rounded-4 mb-5">
        <h3 className="pb-3">Productos Relacionados</h3>
        <div className="text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </section>
    );
  }

  if (relacionados.length === 0) {
    return (
      <section className="container rounded-4 mb-5">
        <h3 className="pb-3">Productos Relacionados</h3>
        <p className="text-muted">No hay productos relacionados disponibles.</p>
      </section>
    );
  }

  return (
    <section className="container rounded-4 mb-5">
      <h3 className="pb-3">Productos Relacionados</h3>
      <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 g-5 d-flex flex-nowrap overflow-x-auto">
        {relacionados.map((prod) => (
          <div className="col" key={prod.id}>
            <Link to={`/detalleProducto/${prod.id}`} className="text-decoration-none">
              <div className="card h-100 prod-card">
                <img
                  src={prod.image}
                  className="card-img-top"
                  alt={prod.name}
                  style={{ height: "100px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">{prod.name}</h5>
                  <p className="text-center text-danger fw-bold">${prod.price} CLP</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
