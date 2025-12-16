
import { useState, useEffect } from "react";
import { formatearRut, validarRut, validarCorreo, validarTelefono } from "../../utils/UserUtils";

export default function AddUserModal({ onAdd, regiones, comunas, tiposUsuario }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [nuevoUsuario, setNuevoUsuario] = useState({
    rut: "",
    nombre: "",
    apellidos: "",
    correo: "",
    clave: "",
    fecha_nac: "",
    telefonoCodigo: "+56",
    telefono: "",
    direccion: "",
    region_id: "",
    comuna_id: "",
    tipousuario_id: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nuevoValor = value;
    
    // Formatear RUT automáticamente
    if (name === "rut") {
      nuevoValor = formatearRut(value);
    }
    
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : nuevoValor,
    }));
  };

  // Validaciones en tiempo real
  useEffect(() => {
    const err = {};

    // Validar RUT
    if (nuevoUsuario.rut) {
      if (nuevoUsuario.rut.length >= 12) {
        if (!validarRut(nuevoUsuario.rut)) {
          err.rut = "RUT inválido.";
        }
      } else {
        err.rut = "RUT incompleto.";
      }
    }

    // Validar nombre
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (nuevoUsuario.nombre && (nuevoUsuario.nombre.length < 2 || nuevoUsuario.nombre.length > 50 || !nombreRegex.test(nuevoUsuario.nombre))) {
      err.nombre = "Nombre inválido (solo letras, 2-50 caracteres).";
    }

    // Validar apellidos
    if (nuevoUsuario.apellidos && (nuevoUsuario.apellidos.length < 2 || nuevoUsuario.apellidos.length > 100 || !nombreRegex.test(nuevoUsuario.apellidos))) {
      err.apellidos = "Apellidos inválidos (solo letras, 2-100 caracteres).";
    }

    // Validar correo
    if (nuevoUsuario.correo && !validarCorreo(nuevoUsuario.correo)) {
      err.correo = "Correo no válido (solo duoc.cl, profesor.duoc.cl o gmail.com).";
    }

    // Validar contraseña
    if (nuevoUsuario.clave && (nuevoUsuario.clave.length < 4 || nuevoUsuario.clave.length > 10)) {
      err.clave = "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    // Validar teléfono (opcional)
    if (nuevoUsuario.telefono && !validarTelefono(nuevoUsuario.telefonoCodigo + nuevoUsuario.telefono)) {
      err.telefono = "Teléfono inválido. Formato esperado: +569XXXXXXXX";
    }

    // Validar fecha de nacimiento
    if (nuevoUsuario.fecha_nac && new Date(nuevoUsuario.fecha_nac) > new Date()) {
      err.fecha_nac = "La fecha de nacimiento no puede ser futura.";
    }

    // Validar dirección (opcional)
    if (nuevoUsuario.direccion && (nuevoUsuario.direccion.length < 5 || nuevoUsuario.direccion.length > 255)) {
      err.direccion = "La dirección debe tener entre 5 y 255 caracteres.";
    }

    setErrors(err);
  }, [nuevoUsuario]);

  const handleSave = async () => {
    // Validar campos obligatorios
    const errCheck = { ...errors };
    
    if (!nuevoUsuario.rut) errCheck.rut = "Campo obligatorio.";
    if (!nuevoUsuario.nombre) errCheck.nombre = "Campo obligatorio.";
    if (!nuevoUsuario.apellidos) errCheck.apellidos = "Campo obligatorio.";
    if (!nuevoUsuario.correo) errCheck.correo = "Campo obligatorio.";
    if (!nuevoUsuario.clave) errCheck.clave = "Campo obligatorio.";
    if (!nuevoUsuario.direccion) errCheck.direccion = "Campo obligatorio.";
    if (!nuevoUsuario.region_id) errCheck.region_id = "Debe seleccionar una región.";
    if (!nuevoUsuario.comuna_id) errCheck.comuna_id = "Debe seleccionar una comuna.";

    setErrors(errCheck);

    if (Object.keys(errCheck).length > 0) {
      return;
    }

    setLoading(true);

    const usuarioParaEnviar = {
      rut: nuevoUsuario.rut,
      nombre: nuevoUsuario.nombre,
      apellidos: nuevoUsuario.apellidos,
      correo: nuevoUsuario.correo,
      clave: nuevoUsuario.clave,
      fecha_nac: nuevoUsuario.fecha_nac || null,
      telefono: nuevoUsuario.telefono ? `${nuevoUsuario.telefonoCodigo}${nuevoUsuario.telefono}` : null,
      direccion: nuevoUsuario.direccion,
      region_id: Number(nuevoUsuario.region_id),
      comuna_id: Number(nuevoUsuario.comuna_id),
      tipoUsuario_id: nuevoUsuario.tipousuario_id ? Number(nuevoUsuario.tipousuario_id) : 3,
      active: nuevoUsuario.active,
    };

    try {
      await onAdd(usuarioParaEnviar);

      // Limpiar campos
      setNuevoUsuario({
        rut: "",
        nombre: "",
        apellidos: "",
        correo: "",
        clave: "",
        fecha_nac: "",
        telefonoCodigo: "+56",
        telefono: "",
        direccion: "",
        region_id: "",
        comuna_id: "",
        tipousuario_id: "",
        active: true,
      });
      setErrors({});
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar comunas por región seleccionada
  const comunasFiltradas = nuevoUsuario.region_id
    ? comunas.filter(c => c.region_id === Number(nuevoUsuario.region_id))
    : comunas;

  return (
    <div
      className="modal fade"
      id="ModalAgregarUsuario"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="ModalAgregarUsuarioLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title" id="ModalAgregarUsuarioLabel">
              <i className="bi bi-person-plus me-2"></i>
              Agregar Usuario
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
              {/* RUT */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  RUT <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.rut ? "is-invalid" : ""}`}
                  name="rut"
                  value={nuevoUsuario.rut}
                  onChange={handleChange}
                  placeholder="12.345.678-9"
                  maxLength="12"
                />
                {errors.rut && <div className="text-danger small">{errors.rut}</div>}
              </div>

              {/* Nombre */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  name="nombre"
                  value={nuevoUsuario.nombre}
                  onChange={handleChange}
                  placeholder="Juan Carlos"
                  maxLength="50"
                />
                {errors.nombre && <div className="text-danger small">{errors.nombre}</div>}
              </div>

              {/* Apellidos */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Apellidos <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                  name="apellidos"
                  value={nuevoUsuario.apellidos}
                  onChange={handleChange}
                  placeholder="González Muñoz"
                  maxLength="100"
                />
                {errors.apellidos && <div className="text-danger small">{errors.apellidos}</div>}
              </div>

              {/* Correo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Correo <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                  name="correo"
                  value={nuevoUsuario.correo}
                  onChange={handleChange}
                  placeholder="usuario@duoc.cl"
                  maxLength="100"
                />
                {errors.correo && <div className="text-danger small">{errors.correo}</div>}
              </div>

              {/* Contraseña */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.clave ? "is-invalid" : ""}`}
                  name="clave"
                  value={nuevoUsuario.clave}
                  onChange={handleChange}
                  placeholder="4-10 caracteres"
                  minLength="4"
                  maxLength="10"
                />
                {errors.clave && <div className="text-danger small">{errors.clave}</div>}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de Nacimiento (Opcional)</label>
                <input
                  type="date"
                  className={`form-control ${errors.fecha_nac ? "is-invalid" : ""}`}
                  name="fecha_nac"
                  value={nuevoUsuario.fecha_nac}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.fecha_nac && <div className="text-danger small">{errors.fecha_nac}</div>}
              </div>

              {/* Teléfono */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Teléfono (Opcional)</label>
                <div className="input-group">
                  <select
                    name="telefonoCodigo"
                    className="form-select"
                    value={nuevoUsuario.telefonoCodigo}
                    onChange={handleChange}
                    style={{ maxWidth: "120px" }}
                  >
                    <option value="+56">+56</option>
                  </select>
                  <input
                    type="text"
                    className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                    name="telefono"
                    value={nuevoUsuario.telefono}
                    onChange={handleChange}
                    placeholder="912345678"
                    maxLength="9"
                  />
                </div>
                {errors.telefono && <div className="text-danger small">{errors.telefono}</div>}
              </div>

              {/* Dirección */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Dirección <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                  name="direccion"
                  value={nuevoUsuario.direccion}
                  onChange={handleChange}
                  placeholder="Calle Los Prados 123"
                  maxLength="255"
                />
                {errors.direccion && <div className="text-danger small">{errors.direccion}</div>}
              </div>

              {/* Región */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Región <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.region_id ? "is-invalid" : ""}`}
                  name="region_id"
                  value={nuevoUsuario.region_id}
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
                {errors.region_id && <div className="text-danger small">{errors.region_id}</div>}
              </div>

              {/* Comuna */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Comuna <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.comuna_id ? "is-invalid" : ""}`}
                  name="comuna_id"
                  value={nuevoUsuario.comuna_id}
                  onChange={handleChange}
                  disabled={!nuevoUsuario.region_id}
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
                {errors.comuna_id && <div className="text-danger small">{errors.comuna_id}</div>}
              </div>

              {/* Tipo de Usuario */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Tipo de Usuario</label>
                <select
                  className="form-select"
                  name="tipousuario_id"
                  value={nuevoUsuario.tipousuario_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo de usuario</option>
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
                  <label className="form-check-label" htmlFor="activeSwitch">
                    Usuario activo:
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    name="active"
                    checked={nuevoUsuario.active}
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
                  Agregar Usuario
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}