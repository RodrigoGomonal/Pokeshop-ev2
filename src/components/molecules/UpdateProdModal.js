
import { useEffect, useState } from "react";
import CategoryServices from "../../services/CategoryServices";

export default function UpdateProductModal({ producto, onUpdate }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    image: "",
    category_id: "",
    description: "",
    stock_actual: 0,
    stock_critico: 0,
    active: true,
  });

  // Cargar categorías desde la BD
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await CategoryServices.getAllCategories();
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  // Cargar producto seleccionado
  useEffect(() => {
    if (producto) {
      setForm({
        name: producto.name || "",
        price: producto.price || 0,
        image: producto.image || "",
        category_id: producto.category_id || "",
        description: producto.description || "",
        stock_actual: producto.stock_actual || 0,
        stock_critico: producto.stock_critico || 0,
        active: producto.active ?? true,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.category_id) {
      alert("Por favor completa todos los campos obligatorios (Nombre y Categoría).");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Por favor ingresa un precio válido.");
      return;
    }

    setLoading(true);

    const productoActualizado = {
      ...producto,
      name: form.name,
      price: Number(form.price),
      image: form.image || 'https://images.wikidexcdn.net/mwuploads/wikidex/7/74/latest/20230123181629/Pok%C3%A9mu%C3%B1eco_EP.png',
      category_id: Number(form.category_id),
      description: form.description,
      stock_actual: Number(form.stock_actual),
      stock_critico: Number(form.stock_critico),
      active: form.active,
    };

    try {
      await onUpdate(productoActualizado);
      // El cierre del modal se maneja en el padre
    } catch (err) {
      console.error("Error al actualizar:", err);
      // No mostramos alert aquí, se maneja en el padre
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="ModalActualizar"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="ModalActualizarLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="ModalActualizarLabel">
              <i className="bi bi-pencil-square me-2"></i>
              Actualizar producto
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
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Categoría */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  name="category_id"
                  className="form-select"
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccione categoría</option>
                  {categorias
                    .filter((c) => c.active)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Imagen */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Imagen (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>

              {/* Stock Actual */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Stock actual</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_actual"
                  value={form.stock_actual}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Stock Crítico */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Stock crítico</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock_critico"
                  value={form.stock_critico}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descripción del producto..."
                ></textarea>
              </div>

              {/* Estado */}
              <div className="col-12">
                <div className="form-check form-switch d-flex justify-content-center align-items-center gap-5">
                  <label className="form-check-label" htmlFor="activeCheck">
                    Estado del producto:
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="activeCheck"
                    name="active"
                    checked={form.active}
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
              className="btn btn-primary"
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
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}