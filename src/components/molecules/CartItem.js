export default function CartItem({ item, onRemove, onQuantityChange }) {
  const subtotal = (item.price || 0) * (item.cantidad || 1);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center">
        <div className="col-md-3 text-center">
          <img
            src={item.image}
            alt={item.name}
            className="img-fluid rounded-start"
            style={{ height: "100px", objectFit: "contain" }}
          />
        </div>

        <div className="col-md-5">
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p className="card-text text-muted">
              Precio: ${item.price.toLocaleString("es-CL")}
            </p>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onRemove(item.id)}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="card-body">
            <h5 className="card-title text-primary">
              ${subtotal.toLocaleString("es-CL")}
            </h5>
            <div className="input-group input-group-sm w-75 mx-auto">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onQuantityChange(item.id, "decrement")}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={item.cantidad}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => onQuantityChange(item.id, "increment")}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}