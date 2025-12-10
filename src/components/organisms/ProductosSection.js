// src/components/organisms/ProductosSection.js
import React, { useState, useMemo, useEffect} from "react";
import { getCart, saveCart, updateCartCount } from "../../utils/CartUtils";
import ProductGrid from "../molecules/ProductGrid";
import ProductServices from "../../services/ProductServices.js";
import CategoryServices from "../../services/CategoryServices.js";

export default function ProductosSection() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  
  // Cargar productos DESDE LA API REST
  useEffect(() => {
    ProductServices.getAllProducts()
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  useEffect(() => {
    CategoryServices.getAllCategories()
      .then((res) => {
        setCategorias(res.data || []);
      })
    .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // crear un mapa id -> name usando useMemo para evitar recalculos innecesarios
  useEffect(() => {
    CategoryServices.getAllCategories()
      .then((res) => {
        // Filtrar solo categorías activas
        const categoriasActivas = (res.data || []).filter(
          (cat) => cat && cat.active === true
        );
        const categoriasConTodas = [
          { id: "Todas", name: "Todas" },
          ...categoriasActivas,
        ];
        setCategorias(categoriasConTodas);
      })
    .catch((err) => console.error("Error cargando categorías:", err));
}, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cumpleCategoria =
        categoriaSeleccionada === "Todas" || p.category_id === categoriaSeleccionada;

      const cumpleBusqueda = p.name.toLowerCase().includes(search.toLowerCase());

      return p.active && p.stock_actual > 0 && cumpleCategoria && cumpleBusqueda;
    });
  }, [productos, categoriaSeleccionada, search]);

  const handleAddToCart = (id) => {
      // Obtener el carrito actual
      let cart = getCart();
      const existing = cart.find((item) => item.id === id);
      // Si el producto ya está en el carrito, incrementa la cantidad
      if (existing) { existing.quantity += 1; } 
      else { cart.push({ id, quantity: 1 }); }
      
      saveCart(cart); // Guardar el carrito actualizado
      updateCartCount(); // actualiza inmediatamente el contador
  };
  
  return (
      <section className="container rounded-4 mb-5">
    <div className="row">
      {/* Sidebar de filtros */}
      <aside className="col-md-3 mb-4">
        <div className="p-3 border rounded-4 bg-light shadow-sm">
          <h5 className="fw-bold mb-3 text-center">Filtros</h5>

          {/* Búsqueda */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categorías */}
          <div>
            <label className="fw-bold mb-2 d-block text-center">Categoría</label>
            <ul className="list-group">
              {categorias.map((cat) => (
                <li
                  key={cat.id}
                  className={`list-group-item list-group-item-action ${
                    categoriaSeleccionada === cat.id ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Productos */}
      <div className="col-md-9">
        <ProductGrid productos={productosFiltrados} onAddToCart={handleAddToCart} />
      </div>
    </div>
  </section>
  );
}
