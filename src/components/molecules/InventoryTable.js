import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import DeletProdModal from "./DeletProdModal";
import UpdateProductModal from "./UpdateProdModal";
import AddProductModal from "./AddProdModal";
import ButtonAction from "../atoms/ButtonAction";
import SearchInput from "../atoms/SearchInput";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import AuthService from "../../services/AuthService";
import '../../App.css';

export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const prodPerPag = 10;

  // Cargar productos y categorías desde la BD
  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductServices.getAllProducts();
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("Error al cargar los productos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await CategoryServices.getAllCategories();
      setCategorias(response.data || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  // Obtener nombre de categoría por ID
  const getCategoryName = (categoryId) => {
    const categoria = categorias.find(c => c.id === categoryId);
    return categoria?.name || `ID: ${categoryId}`;
  };
  
  // Filtro de búsqueda
  const filtrados = items.filter(p => {
    const nombre = p.name || '';
    const coincideNombre = nombre.toLowerCase().includes(search.toLowerCase());
    const coincideId = String(p.id).includes(search);
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

  // Función para cerrar modal correctamente
  const closeModal = (modalId) => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // Asegurar limpieza completa
      setTimeout(() => {
        // Remover todos los backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        
        // Limpiar clases y estilos del body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Limpiar atributos del modal
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.removeAttribute('aria-modal');
      }, 150);
    }
  };
  // Solo mostrar botones de acción si es Admin
  // Aquí se asume que hay una función o variable que indica si el usuario es admin
  const esAdmin = (() => {
    const usuarioActual = AuthService.getCurrentUser();
    return usuarioActual && usuarioActual.tipousuario_id === 1;
  })();
  // Acciones de los botones que abren los modales y manejan CRUD

  // ---- AGREGAR ----
  // Abrir modal de agregar
  const handleOpenAdd = () => {
    if (!esAdmin) {
      alert("Solo los administradores pueden agregar productos");
      return;
    }
    const modal = new Modal(document.getElementById("ModalAgregar"));
    modal.show();
  };
  // Agregar producto
  const handleAdd = async (nuevoProducto) => {
    if (!esAdmin) {
      alert("Solo los administradores pueden agregar productos");
      return;
    }
    try {
      await ProductServices.createProduct(nuevoProducto);
      closeModal("ModalAgregar");
      await fetchProducts();
      setPagina(1);
    } catch (err) {
      console.error("Error al agregar producto:", err);
      alert("Error al agregar el producto: " + (err.response?.data?.message || err.message));
    }
  };

  // ---- ELIMINAR ----
  // Abrir modal de eliminar
  const handleOpenDelete = (producto) => {
    if (!esAdmin) {
      alert("Solo los administradores pueden eliminar productos");
      return;
    }
    setProductoSeleccionado(producto);
    const modal = new Modal(document.getElementById("ModalEliminar"));
    modal.show();
  };
  // Eliminar producto
  const handleDelete = async (id) => {
    if (!esAdmin) {
      alert("Solo los administradores pueden eliminar productos");
      return;
    }
    try {
      await ProductServices.deleteProduct(id);
      closeModal("ModalEliminar");
      await fetchProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("Error al eliminar el producto: " + (err.response?.data?.message || err.message));
    }
  };

  // ---- ACTUALIZAR ----
  // Abrir modal de actualizar
  const handleOpenUpdate = (producto) => {
    if (!esAdmin) {
      alert("Solo los administradores pueden editar productos");
      return;
    }
    setProductoSeleccionado(producto);
    const modal = new Modal(document.getElementById("ModalActualizar"));
    modal.show();
  };
  // Actualizar producto
  const handleUpdate = async (productoActualizado) => {
    if (!esAdmin) {
      alert("Solo los administradores pueden editar productos");
      return;
    }
    try {
      await ProductServices.updateProduct(productoActualizado.id, productoActualizado);
      closeModal("ModalActualizar");
      await fetchProducts();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      alert("Error al actualizar el producto: " + (err.response?.data?.message || err.message));
    }
  };

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / prodPerPag);
  const productosPaginados = filtrados.slice((pagina - 1) * prodPerPag, pagina * prodPerPag);
  
  const siguiente = () => { if (pagina < totalPaginas) setPagina(pagina + 1); };
  const anterior = () => { if (pagina > 1) setPagina(pagina - 1); };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        { /* Boton de Agregar - Solo Admin*/ }
        {esAdmin && (
          <ButtonAction 
            icon="bi-plus-lg" 
            label="Agregar Producto" 
            variant="success" 
            onClick={handleOpenAdd}
          />
        )}
        <SearchInput 
          placeholder="Buscar por ID o nombre" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            {esAdmin && ( 
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
            )}
            {!esAdmin && ( 
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio uds(CLP)</th>
                <th>Stock Actual</th>
              </tr>
            )}
          </thead>
          <tbody>
            {productosPaginados.map((p) => {
              const stockColorClass = getStockColorClass(p);
              
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition duration-150">
                  { /* ID del producto */ }
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.id}
                  </td>
                  { /* Imagen del producto con manejo de error */ }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ height: "50px"}}
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/50x50/ccc/000?text=N/A"; 
                      }}
                    />
                  </td>
                  { /* Nombre */ }
                  <td>{p.name}</td>
                  { /* Categoría */ }
                  <td>
                    <span className="badge bg-info text-dark">
                      {getCategoryName(p.category_id)}
                    </span>
                  </td>
                  { /* Precio por unidad y total */ }
                  <td>${Number(p.price).toLocaleString('es-CL')}</td>
                  {esAdmin && ( <td>${(Number(p.price) * Number(p.stock_actual)).toLocaleString('es-CL')}</td> )}
                  
                  { /* Stock actual con color según nivel */ }
                  <td>
                    <span className={`px-3 py-1 rounded ${stockColorClass}`}>
                      {p.stock_actual}
                    </span>
                  </td>       
                  {esAdmin && ( <td>{p.stock_critico}</td> )}
                  { /* Estado activo/inactivo */ }
                  {esAdmin && ( 
                    <td>
                      <span className={`px-3 py-1 rounded ${p.active ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  )}
                  
                  { /* Botones de Editar y Eliminar - Solo Admin*/ }
                  {esAdmin && (
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2" 
                        onClick={() => handleOpenUpdate(p)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  )}
                  {esAdmin && (
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleOpenDelete(p)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {productosPaginados.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-4"> 
        <ul className="pagination justify-content-center"> 
          <li className="page-item"> 
            <button 
              className="btn btn-outline-primary" 
              disabled={pagina === 1} 
              onClick={anterior}
            > 
              <i className="bi bi-arrow-left"></i> 
              Anterior 
            </button> 
          </li> 
          <li className="page-item ms-3"> 
            <button 
              className="btn btn-primary" 
              disabled={pagina === totalPaginas} 
              onClick={siguiente}
            > 
              Siguiente 
              <i className="bi bi-arrow-right"></i> 
            </button> 
          </li> 
        </ul> 
        <p className="text-center text-muted">
          Página {pagina} de {totalPaginas || 1}
        </p> 
      </nav>
      {/* Modales de Agregar, Editar y Eliminar - Solo Admin*/}
      {esAdmin && (
        <>
          <DeletProdModal 
            producto={productoSeleccionado} 
            onDelete={() => handleDelete(productoSeleccionado?.id)}
          />
          <UpdateProductModal 
            producto={productoSeleccionado} 
            onUpdate={handleUpdate}
          />
          <AddProductModal onAdd={handleAdd} />
        </>
      )}
    </>
  );
}