import React from "react";

export default function DeleteModal({ titulo, nombre, onDelete }) {
  return (
    <div className="modal fade" id="ModalEliminar" data-bs-backdrop="static" data-bs-keyboard="false"
      tabIndex="-1" aria-labelledby="ModalEliminarLabel" aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="ModalEliminarLabel">
              {titulo}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>
              ¿Seguro que deseas eliminar el producto{" "}
              <strong>{nombre}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
