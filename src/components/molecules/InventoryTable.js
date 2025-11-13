import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import DeletProdModal from "./DeletProdModal";
import UpdateProductModal from "./UpdateProdModal";
import AddProductModal from "./AddProdModal";
import productos from "../../data/Products.js";
import ButtonAction from "../atoms/ButtonAction";
import SearchInput from "../atoms/SearchInput";
import { getProducts, saveProducts } from "../../utils/CartUtils";
import '../../App.css';

export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const prodPerPag = 10;
  // Cargar productos desde data o localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("productos");
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems(productos);
        localStorage.setItem("productos", JSON.stringify(productos));
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
      setItems(productos);
    }
  }, []);
  // Guardar productos en localStorage al cambiar items
  useEffect(() => {
    if (!items || items.length === 0) return;

    const stored = localStorage.getItem("productos");
    const prev = stored ? JSON.parse(stored) : [];

    // Compara los contenidos para evitar reescritura infinita
    const iguales = JSON.stringify(prev) === JSON.stringify(items);
    if (!iguales) {
      saveProducts(items);
      // Emitimos el evento solo si hay un cambio real
      window.dispatchEvent(new Event("products-updated"));
    }
  }, [items]);

  // Escuchar cambios globales en productos, pero solo si son distintos
  useEffect(() => {
    const actualizar = () => {
      const nuevos = getProducts();
      // Evita setState si los productos son iguales
      setItems((prev) => {
        const iguales = JSON.stringify(prev) === JSON.stringify(nuevos);
        return iguales ? prev : nuevos;
      });
      setPagina(1);
    };

    window.addEventListener("products-updated", actualizar);
    return () => window.removeEventListener("products-updated", actualizar);
  }, []);
  
  // Filtro de búsqueda
  const filtrados = items.filter(p => {
    const nombreValido = p.name && typeof p.name === 'string';// 1. Verificación que p.nombre existe .
    const coincideNombre = nombreValido && p.name.toLowerCase().includes(search.toLowerCase());// 2. Definir la lógica de búsqueda.
    const coincideId = String(p.id).includes(search);// 3. Lógica de búsqueda por ID 
    return coincideNombre || coincideId;
  });
  // Determinar clase de color según stock
  const getStockColorClass = (p) => {
    const actual = Number(p.stock_actual);
    const critico = Number(p.stock_critico);

    if (isNaN(actual) || isNaN(critico)) return "bg-secondary text-white";
    if (actual <= critico) return "bg-danger text-white";
    if (actual <= critico * 1.5) return "bg-warning text-dark";
    return "bg-success text-white";
  };
  
  // ---- AGREGAR ----
  const handleOpenAdd = () => {// Abrir modal de agregar
    const modal = new Modal(document.getElementById("ModalAgregar"));
    modal.show();
  };
  const handleAdd = (nuevoProducto) => {// Agregar producto
    setItems((prev) => {
      const actualizados = [...prev, nuevoProducto];
      localStorage.setItem("productos", JSON.stringify(actualizados));
      return actualizados;
    });
  };

  // ---- ELIMINAR ----
  const handleOpenDelete = (producto) => {// Abrir modal de eliminación
    setProductoSeleccionado(producto);
    const modal = new Modal(document.getElementById("ModalEliminar"));
    modal.show();
  };
  const handleDelete = (id) => {// Eliminar producto
    setItems((prev) => prev.filter((p) => p.id !== id));
    const modalEl = document.getElementById("ModalEliminar");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  };
  // ---- ACTUALIZAR ----
  const handleOpenUpdate = (producto) => {// Abrir modal de actualización
    setProductoSeleccionado(producto);
    const modal = new Modal(document.getElementById("ModalActualizar"));
    modal.show();
  };
  const handleUpdate = (productoSeleccionado) => {// Actualizar producto
    setItems((prev) =>
      prev.map((p) =>
        p.id === productoSeleccionado.id ? productoSeleccionado : p
      )
    );
  };
  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / prodPerPag);
  const productosPaginados = filtrados.slice((pagina - 1) * prodPerPag, pagina * prodPerPag);
  // Cambiar de página
  const siguiente = () => { if (pagina < totalPaginas) setPagina(pagina + 1); };
  const anterior = () => {  if (pagina > 1) setPagina(pagina - 1); };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <ButtonAction icon="bi-plus-lg" label="Agregar Producto" variant="success" onClick={handleOpenAdd}/>
        <SearchInput placeholder="Buscar por ID o nombre" value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio uds(CLP)</th>
              <th>Precio Total(CLP)</th>
              <th>Stock Actual</th>
              <th>Stock Crítico</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => {
              const stockColorClass = getStockColorClass(p);
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition duration-150 ">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={p.image} alt={p.name} style={{ height: "50px"}}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50x50/ccc/000?text=N/A"; }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td>${(p.price * p.stock_actual).toLocaleString('es-CL')}</td>
                  <td> <span className={`px-3 py-1 rounded ${stockColorClass}`}> {p.stock_actual} </span> </td>
                  <td>{p.stock_critico}</td>
                  <td>
                    <span className={`px-3 py-1 rounded ${p.activo ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenUpdate(p)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                  <td>
                    <button  className="btn btn-sm btn-outline-danger" onClick={() => handleOpenDelete(p)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
            {productosPaginados.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginacion */} 
      <nav className="mt-4"> 
        <ul className="pagination justify-content-center"> 
          <li className="page-item"> 
            <button className="btn btn-outline-primary" disabled={pagina === 1} onClick={anterior} > 
              <i className="bi bi-arrow-left"></i> 
              Anterior 
            </button> 
          </li> 
          <li className="page-item ms-3"> 
            <button className="btn btn-primary" disabled={pagina === totalPaginas} onClick={siguiente}> 
              Siguiente 
              <i className="bi bi-arrow-right"></i> 
            </button> 
          </li> 
        </ul> 
          <p className="text-center text-muted"> Página {pagina} de {totalPaginas || 1} </p> 
      </nav>

      <DeletProdModal producto={productoSeleccionado} onDelete={() => handleDelete(productoSeleccionado?.id)}/>
      <UpdateProductModal producto={productoSeleccionado} onUpdate={handleUpdate}/>
      <AddProductModal onAdd={handleAdd} />
    </>
  );
}