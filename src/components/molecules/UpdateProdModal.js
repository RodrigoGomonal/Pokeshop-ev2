import { Modal } from "bootstrap";
import { useEffect, useState } from "react";
import { categoria } from "../../data/Products"; // Importamos lista de categorías

export default function UpdateProductModal({ producto, onUpdate }) {
  const [form, setForm] = useState({
    image: "",
    name: "",
    category: "",
    price: 0,
    stock_actual: 0,
    stock_critico: 0,
    activo: true,
  });

  // Cargar producto seleccionado
  useEffect(() => {
    if (producto) {
      setForm({
        image: producto.image || "",
        name: producto.name || "",
        category: producto.category || "",
        price: producto.price || 0,
        stock_actual: producto.stock_actual || 0,
        stock_critico: producto.stock_critico || 0,
        activo: producto.activo ?? true,
      });
    }
  }, [producto]);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar cambios
  const handleSave = () => {
    if (!form.name || !form.category) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    onUpdate({ ...producto, ...form });

    const modalEl = document.getElementById("ModalActualizar");
    const modal = Modal.getInstance(modalEl);
    if (modal) modal.hide();
  };

  return (
    <div className="modal fade" id="ModalActualizar" data-bs-backdrop="static" data-bs-keyboard="false"
      tabIndex="-1" aria-labelledby="ModalActualizarLabel" aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-white border-secondary">
          <div className="modal-header">
            <h5 className="modal-title" id="ModalActualizarLabel">
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
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  name="category"
                  className="form-select bg-dark text-white border-secondary"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Seleccione categoría</option>
                  {categoria
                    .filter((c) => c.activo)
                    .map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Precio (CLP)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen (URL)</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Stock actual</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  name="stock_actual"
                  value={form.stock_actual}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Stock crítico</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  name="stock_critico"
                  value={form.stock_critico}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="activoCheck"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="activoCheck">
                    Activo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
