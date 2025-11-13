import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.nombre && form.email && form.mensaje) {
      setEnviado(true);
      setForm({ nombre: "", email: "", mensaje: "" });
      setTimeout(() => setEnviado(false), 4000);
    }
  };

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center rounded" 
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "800px",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div className="row g-0">
          {/* Panel izquierdo */}
          <div
            className="col-md-5 d-flex flex-column justify-content-between text-white p-4"
            style={{ backgroundColor: "#428CFF" }}
          >
            <div>
              <h3 className="fw-bold mb-3">Contáctanos</h3>
              <p className="text-light">
                Si tienes dudas o sugerencias, escríbenos. Te responderemos lo
                antes posible.
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i> PokeShop@gmail.com
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i> +56 9 5555 5555
              </p>
              <p className="mb-0">
                <i className="bi bi-geo-alt-fill me-2"></i> Santiago, Chile
              </p>
            </div>
          </div>

          {/* Panel derecho */}
          <div
            className="col-md-7 p-4"
            style={{ backgroundColor: "#8CBFFF" }}
          >
            <h4 className="mb-4 text-center" style={{ color: "#656C73" }}>
              Envíanos un mensaje
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#656C73" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="form-control"
                  style={{ borderColor: "#D9B88F" }}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#656C73" }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  style={{ borderColor: "#D9B88F" }}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#656C73" }}>
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  rows="4"
                  value={form.mensaje}
                  onChange={handleChange}
                  className="form-control"
                  style={{ borderColor: "#D9B88F", resize: "none" }}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn text-white fw-semibold"
                  style={{
                    backgroundColor: "#428CFF",
                    border: "none",
                  }}
                >
                  <i className="bi bi-send-fill me-2"></i> Enviar mensaje
                </button>
              </div>

              {enviado && (
                <div className="alert alert-success mt-3 text-center py-2 mb-0" role="alert">
                  ¡Tu mensaje fue enviado con éxito!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
