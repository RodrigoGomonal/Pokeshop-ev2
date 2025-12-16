import { useState, useEffect } from "react";
import CategoryServices from "../../services/CategoryServices";

export default function AddProductModal({ onAdd }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    price: "",
    image: "",
    category_id: "",
    description: "",
    stock_actual: "",
    stock_critico: "",
    active: false,
  });

  // Cargar categorías desde la BD
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await CategoryServices.getAllCategories();
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        alert("Error al cargar las categorías");
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!nuevoProducto.name || !nuevoProducto.category_id) {
      alert("Por favor completa los campos obligatorios (Nombre y Categoría).");
      return;
    }

    if (!nuevoProducto.price || Number(nuevoProducto.price) <= 0) {
      alert("Por favor ingresa un precio válido.");
      return;
    }

    setLoading(true);

    const productoParaEnviar = {
      name: nuevoProducto.name,
      price: Number(nuevoProducto.price),
      image: nuevoProducto.image ? nuevoProducto.image:'https://images.wikidexcdn.net/mwuploads/wikidex/7/74/latest/20230123181629/Pok%C3%A9mu%C3%B1eco_EP.png' ,
      category_id: Number(nuevoProducto.category_id),
      description: nuevoProducto.description || "",
      stock_actual: Number(nuevoProducto.stock_actual) || 0,
      stock_critico: Number(nuevoProducto.stock_critico) || 5,
      active: nuevoProducto.active,
    };

    try {
      await onAdd(productoParaEnviar);

      /* // Cerrar modal correctamente
      const modalEl = document.getElementById("ModalAgregar");
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();

      // Limpiar backdrop manualmente si quedó
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, 300); */

      // Limpia los campos
      setNuevoProducto({
        name: "",
        price: "",
        image: "",
        category_id: "",
        description: "",
        stock_actual: "",
        stock_critico: "",
        active: false,
      });
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="ModalAgregar"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="ModalAgregarLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title" id="ModalAgregarLabel">
              <i className="bi bi-plus-circle me-2"></i>
              Agregar producto
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {/* Nombre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={nuevoProducto.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del producto"
                />
              </div>

              {/* Categoría */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="category_id"
                  value={nuevoProducto.category_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias
                    .filter((c) => c.active || c.activo)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.nombre}
                      </option>
                    ))}
                </select>
              </div>

              {/* Precio */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Precio (CLP) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={nuevoProducto.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Stock Actual */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Stock Actual</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_actual"
                  value={nuevoProducto.stock_actual}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Stock Crítico */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Stock Crítico</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_critico"
                  value={nuevoProducto.stock_critico}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Imagen */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">URL Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={nuevoProducto.image}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={nuevoProducto.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descripción del producto..."
                ></textarea>
              </div>

              {/* Estado */}
              <div className="col-12 align-center">
                <div className="form-check form-switch d-flex justify-content-center align-items-center gap-5">
                  <label className="form-check-label" htmlFor="activeSwitch">
                    Estado del producto:
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    name="active"
                    checked={nuevoProducto.active}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Agregar producto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}