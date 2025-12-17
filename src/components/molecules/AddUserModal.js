import { useState, useEffect } from "react";
import { formatearRut, validarRut, validarCorreo, validarTelefono } from "../../utils/UserUtils";
import UserServices from "../../services/UserServices";

export default function AddUserModal({ onAdd, regiones, comunas, tiposUsuario }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [nuevoUsuario, setNuevoUsuario] = useState({
    rut: "",
    nombre: "",
    apellidos: "",
    correo: "",
    confirmarCorreo: "",
    clave: "",
    confirmarClave: "",
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

  // Limpiar comuna cuando cambia la región
  useEffect(() => {
    if (nuevoUsuario.region_id) {
      setNuevoUsuario((prev) => ({ ...prev, comuna_id: "" }));
    }
  }, [nuevoUsuario.region_id]);

  // Validaciones en tiempo real (IGUAL QUE RegisterForm)
  useEffect(() => {
    const err = {};

    // Validar RUT
    if (nuevoUsuario.rut.length >= 12) {
      if (!validarRut(nuevoUsuario.rut)) {
        err.rut = "RUT inválido.";
      }
    } else if (nuevoUsuario.rut) {
      err.rut = "RUT incompleto.";
    }

    // Validar nombre y apellidos
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (nuevoUsuario.nombre && (nuevoUsuario.nombre.length < 2 || nuevoUsuario.nombre.length > 50 || !nombreRegex.test(nuevoUsuario.nombre))) {
      err.nombre = "Nombre inválido (solo letras, 2-50 caracteres).";
    }
    if (nuevoUsuario.apellidos && (nuevoUsuario.apellidos.length < 2 || nuevoUsuario.apellidos.length > 100 || !nombreRegex.test(nuevoUsuario.apellidos))) {
      err.apellidos = "Apellidos inválidos (solo letras, 2-100 caracteres).";
    }

    // Validar correo y confirmación
    if (nuevoUsuario.correo && !validarCorreo(nuevoUsuario.correo)) {
      err.correo = "Correo no válido (solo duoc.cl, profesor.duoc.cl o gmail.com).";
    }
    if (nuevoUsuario.confirmarCorreo && nuevoUsuario.confirmarCorreo !== nuevoUsuario.correo) {
      err.confirmarCorreo = "El correo de confirmación no coincide.";
    }

    // Validar contraseña y confirmación
    if (nuevoUsuario.clave && (nuevoUsuario.clave.length < 4 || nuevoUsuario.clave.length > 10)) {
      err.clave = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (nuevoUsuario.confirmarClave && nuevoUsuario.confirmarClave !== nuevoUsuario.clave) {
      err.confirmarClave = "Las contraseñas no coinciden.";
    }

    // Validar teléfono chileno (opcional)
    if (nuevoUsuario.telefono && !validarTelefono(nuevoUsuario.telefonoCodigo + nuevoUsuario.telefono)) {
      err.telefono = "Teléfono inválido. Formato esperado: +569XXXXXXXX";
    }

    // Validar fecha nacimiento
    if (nuevoUsuario.fecha_nac && new Date(nuevoUsuario.fecha_nac) > new Date()) {
      err.fecha_nac = "La fecha de nacimiento no puede ser futura.";
    }

    // Validar dirección
    if (nuevoUsuario.direccion && (nuevoUsuario.direccion.length < 5 || nuevoUsuario.direccion.length > 255)) {
      err.direccion = "La dirección debe tener entre 5 y 255 caracteres.";
    }

    setErrors(err);
  }, [nuevoUsuario]);

  const handleSave = async () => {
    // Validar campos obligatorios
    const camposObligatorios = ["rut", "nombre", "apellidos", "correo", "confirmarCorreo", "clave", "confirmarClave", "region_id", "comuna_id", "direccion"];
    const camposVacios = camposObligatorios.filter((k) => !nuevoUsuario[k]);

    const errCheck = { ...errors };
    if (camposVacios.length > 0) {
      camposVacios.forEach((c) => (errCheck[c] = "Campo obligatorio."));
    }
    if (!nuevoUsuario.region_id) {
      errCheck.region_id = "Debe seleccionar una región.";
    }
    if (!nuevoUsuario.comuna_id && nuevoUsuario.region_id) {
      errCheck.comuna_id = "Debe seleccionar una comuna.";
    }

    try {
      // 1. VALIDAR UNICIDAD — RUT
      try {
        await UserServices.getUserByRut(nuevoUsuario.rut);
        errCheck.rut = "El RUT ya está registrado.";
        alert("El RUT ya está registrado.");
        setLoading(false);
        return;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          //alert("Error verificando RUT en el servidor.");
        }
      }

      // 2. VALIDAR UNICIDAD — CORREO
      try {
        await UserServices.getUserByEmail(nuevoUsuario.correo);
        errCheck.correo = "El correo ya está registrado.";
        alert("El correo ya está registrado.");
        setLoading(false);
        return;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          //alert("Error verificando correo en el servidor.");
        }
      }

      setErrors(errCheck);

      if (Object.keys(errCheck).length > 0) {
        return;
      }

      setLoading(true);

      // 3. MAPEAR CAMPOS PARA EL BACKEND
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

      console.log('Creando usuario:', usuarioParaEnviar);

      // 4. CREAR USUARIO
      await onAdd(usuarioParaEnviar);

      // 5. LIMPIAR FORMULARIO
      setNuevoUsuario({
        rut: "",
        nombre: "",
        apellidos: "",
        correo: "",
        confirmarCorreo: "",
        clave: "",
        confirmarClave: "",
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
      if (err.response) {
        console.error("Detalles del error:", err.response.data);
        alert(`Error al agregar usuario: ${err.response.data.message || 'Error desconocido'}`);
      } else {
        alert("Ocurrió un error inesperado al agregar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar comunas por región seleccionada
  const comunasFiltradas = nuevoUsuario.region_id
    ? comunas.filter(c => c.region_id === Number(nuevoUsuario.region_id))
    : [];

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
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
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
              <div className="col-md-12">
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

              {/* Confirmar Correo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Confirmar Correo <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.confirmarCorreo ? "is-invalid" : ""}`}
                  name="confirmarCorreo"
                  value={nuevoUsuario.confirmarCorreo}
                  onChange={handleChange}
                  placeholder="*Repetir correo*"
                  maxLength="100"
                />
                {errors.confirmarCorreo && <div className="text-danger small">{errors.confirmarCorreo}</div>}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="col-md-12">
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

              {/* Confirmar Contraseña */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Confirmar Contraseña <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmarClave ? "is-invalid" : ""}`}
                  name="confirmarClave"
                  value={nuevoUsuario.confirmarClave}
                  onChange={handleChange}
                  placeholder="*Repetir contraseña*"
                  minLength="4"
                  maxLength="10"
                />
                {errors.confirmarClave && <div className="text-danger small">{errors.confirmarClave}</div>}
              </div>

              {/* Teléfono */}
              <div className="col-md-12">
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

              {/* Dirección */}
              <div className="col-md-12">
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

              {/* Tipo de Usuario */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Tipo de Usuario</label>
                <select
                  className="form-select"
                  name="tipousuario_id"
                  value={nuevoUsuario.tipousuario_id}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar tipo de usuario (por defecto: Cliente)</option>
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
                  <label className="form-check-label fw-semibold" htmlFor="activeSwitch">
                    Usuario activo:
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    name="active"
                    checked={nuevoUsuario.active}
                    onChange={handleChange}
                    style={{ width: '3rem', height: '1.5rem' }}
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