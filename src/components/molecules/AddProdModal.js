import { Modal } from "bootstrap";
import { useState } from "react";
import { categoria } from "../../data/Products";
import productos from "../../data/Products.js";

export default function AddProductModal({ onAdd }) {
    // Estado para los campos del nuevo producto
    const [nuevoProducto, setNuevoProducto] = useState({
        image: "",
        name: "",
        category: "",
        price: "",
        stock_actual: "",
        stock_critico: "",
        activo: true,
    });

    // Maneja el cambio en cada campo
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNuevoProducto((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    }

    // Guardar producto
    const handleSave = () => {
        if (!nuevoProducto.name || !nuevoProducto.category) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        // Genera un ID único
        const id = productos.length ? productos[productos.length - 1].id + 1 : 1;

        const productoConId = { ...nuevoProducto, id, price: Number(nuevoProducto.price) };

        onAdd(productoConId);

        // Cierra el modal
        const modalEl = document.getElementById("ModalAgregar");
        const modal = Modal.getInstance(modalEl);
        if (modal) modal.hide();

        // Limpia los campos
        setNuevoProducto({
        image: "",
        name: "",
        category: "",
        price: "",
        stock_actual: "",
        stock_critico: "",
        activo: true,
        });
    };

  return (
    <div className="modal fade" id="ModalAgregar" data-bs-backdrop="static" data-bs-keyboard="false" 
        tabIndex="-1" aria-labelledby="ModalAgregarLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="ModalAgregarLabel">
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
            {/* Imagen */}
            <div className="mb-3">
              <label className="form-label">URL Imagen</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                name="image"
                value={nuevoProducto.image}
                onChange={handleChange}
              />
            </div>
            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                name="name"
                value={nuevoProducto.name}
                onChange={handleChange}
              />
            </div>

            {/* Categoría */}
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                name="category"
                value={nuevoProducto.category}
                onChange={handleChange}
              >
                <option value="">Seleccionar categoría...</option>
                {categoria
                  .filter((c) => c.activo)
                  .map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
            {/* Precio */}
            <div className="mb-3">
              <label className="form-label">Precio (CLP)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="price"
                value={nuevoProducto.price}
                onChange={handleChange}
              />
            </div>
            {/* Stock Actual */}
            <div className="mb-3">
              <label className="form-label">Stock Actual</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="stock_actual"
                value={nuevoProducto.stock_actual}
                onChange={handleChange}
              />
            </div>
            {/* Stock Crítico */}
            <div className="mb-3">
              <label className="form-label">Stock Crítico</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="stock_critico"
                value={nuevoProducto.stock_critico}
                onChange={handleChange}
              />
            </div>
            {/* Estado */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="activoSwitch"
                name="activo"
                checked={nuevoProducto.activo}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="activoSwitch">
                Activo
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
              Agregar producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
