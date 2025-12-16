import { useEffect, useState } from "react";

export default function UpdateUserModal({ usuario, onUpdate, regiones, comunas, tiposUsuario }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellidos: "",
    correo: "",
    clave: "",
    fecha_nac: "",
    telefono: "",
    direccion: "",
    region_id: "",
    comuna_id: "",
    tipoUsuario_id: "",
    active: true,
  });

  // Cargar usuario seleccionado
  useEffect(() => {
    if (usuario) {
      setForm({
        rut: usuario.rut || "",
        nombre: usuario.nombre || "",
        apellidos: usuario.apellidos || "",
        correo: usuario.correo || "",
        clave: "", // No mostrar la contraseña actual
        fecha_nac: usuario.fecha_nac ? usuario.fecha_nac.split('T')[0] : "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        region_id: usuario.region_id || "",
        comuna_id: usuario.comuna_id || "",
        tipoUsuario_id: usuario.tipousuario_id || "",
        active: usuario.active ?? true,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.nombre || !form.correo || !form.region_id || !form.comuna_id || !form.tipoUsuario_id) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Si se ingresó una nueva contraseña, validarla
    if (form.clave && form.clave.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const usuarioActualizado = {
      rut: form.rut,
      nombre: form.nombre,
      apellidos: form.apellidos || "",
      correo: form.correo,
      clave: form.clave || usuario.clave, // Mantener la anterior si no se cambió
      fecha_nac: form.fecha_nac || null,
      telefono: form.telefono || null,
      direccion: form.direccion || null,
      region_id: form.region_id ? Number(form.region_id) : null,
      comuna_id: form.comuna_id ? Number(form.comuna_id) : null,
      tipoUsuario_id: form.tipoUsuario_id? Number(form.tipoUsuario_id) : Number(usuario.tipousuario_id),
      active: form.active,
    };

    try {
      await onUpdate(usuarioActualizado);
    } catch (err) {
      console.error("Error al actualizar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar comunas por región seleccionada
  const comunasFiltradas = form.region_id
    ? comunas.filter(c => c.region_id === Number(form.region_id))
    : comunas;

  return (
    <div
      className="modal fade"
      id="ModalActualizarUsuario"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="ModalActualizarUsuarioLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="ModalActualizarUsuarioLabel">
              <i className="bi bi-pencil-square me-2"></i>
              Actualizar Usuario
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
              {/* RUT (solo lectura) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">RUT</label>
                <input
                  type="text"
                  className="form-control"
                  name="rut"
                  value={form.rut}
                  readOnly
                  disabled
                />
              </div>

              {/* Nombre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nombres
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              {/* Apellidos */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                />
              </div>

              {/* Correo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Correo
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>

              {/* Nueva Contraseña */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="clave"
                  value={form.clave}
                  onChange={handleChange}
                  placeholder="Dejar vacío para no cambiar"
                />
                <small className="text-muted">Mínimo 6 caracteres</small>
              </div>

              {/* Fecha de Nacimiento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_nac"
                  value={form.fecha_nac}
                  onChange={handleChange}
                />
              </div>

              {/* Teléfono */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              {/* Dirección */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              {/* Región */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Región</label>
                <select
                  className="form-select"
                  name="region_id"
                  value={form.region_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar región...</option>
                  {regiones
                    .filter(r => r.active)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Comuna */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Comuna</label>
                <select
                  className="form-select"
                  name="comuna_id"
                  value={form.comuna_id}
                  onChange={handleChange}
                  disabled={!form.region_id}
                >
                  <option value="">Seleccionar comuna...</option>
                  {comunasFiltradas
                    .filter(c => c.active)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Tipo de Usuario */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Tipo de Usuario</label>
                <select
                  className="form-select"
                  name="tipoUsuario_id"
                  value={form.tipoUsuario_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo...</option>
                  {tiposUsuario
                    .filter(t => t.active)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Estado */}
              <div className="col-12">
                <div className="form-check form-switch d-flex justify-content-center align-items-center gap-5">
                  <label className="form-check-label" htmlFor="activeCheck">
                    Usuario activo:
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
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}