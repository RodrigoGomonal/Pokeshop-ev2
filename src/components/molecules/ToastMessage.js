import { useEffect, useRef } from "react";

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current) {
      const bsModal = new window.bootstrap.Modal(modalRef.current);
      bsModal.show();
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-danger" data-bs-dismiss="modal" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
