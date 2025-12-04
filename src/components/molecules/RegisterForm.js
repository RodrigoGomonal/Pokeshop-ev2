import React, { useState, useEffect } from "react";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import ButtonAction from "../atoms/ButtonAction";
import { formatearRut, validarRut, validarCorreo, validarTelefono } from "../../utils/UserUtils";
import UserServices from "../../services/UserServices";
import RegionServices from "../../services/RegionServices";
import CommuneServices from "../../services/CommuneServices";
import { setCurrentUser } from "../../utils/UserUtils";

export default function RegisterForm({ onRegistered }) {

  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellidos: "",
    correo: "",
    confirmarCorreo: "",
    pass: "",
    confirmarPass: "",
    telefonoCodigo: "+56",
    telefono: "",
    fechaNac: "",
    region_id: "",
    comuna_id: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [todasLasComunas, setTodasLasComunas] = useState([]);

  // Cargar regiones y comunas al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [regionesResponse, comunasResponse] = await Promise.all([
          RegionServices.getAllRegions(),
          CommuneServices.getAllCommunes()
        ]);
        setRegiones(regionesResponse.data);
        setTodasLasComunas(comunasResponse.data);
      } catch (error) {
        console.error("Error cargando regiones y comunas:", error);
        alert("Error al cargar las regiones y comunas. Por favor, recargue la página.");
      }
    };
    cargarDatos();
  }, []);

  // Filtrar comunas cuando cambia la región
  useEffect(() => {
    if (form.region_id) {
      const comunasFiltradas = todasLasComunas.filter(
        (comuna) => comuna.region_id === parseInt(form.region_id)
      );
      setComunas(comunasFiltradas);
    } else {
      setComunas([]);
    }
    // Limpiar comuna seleccionada cuando cambia la región
    setForm((prev) => ({ ...prev, comuna_id: "" }));
  }, [form.region_id, todasLasComunas]);

  // ---------------- Manejador general ----------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    let nuevoValor = value;
    if (id === "rut") {
      nuevoValor = formatearRut(value);
    }
    setForm((prev) => ({ ...prev, [id]: nuevoValor }));
  };
  
  // ---------------- Validaciones en tiempo real ----------------
  useEffect(() => {
    const err = {};
    
    // Validar RUT
    if (form.rut.length >= 12) {
      if (!validarRut(form.rut)) {
        err.rut = "RUT inválido.";
      }
    } else if (form.rut) {
      err.rut = "RUT incompleto.";
    }

    // Validar nombre y apellidos
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (form.nombre && (form.nombre.length < 2 || form.nombre.length > 50 || !nombreRegex.test(form.nombre))) {
      err.nombre = "Nombre inválido (solo letras, 2-50 caracteres).";
    }
    if (form.apellidos && (form.apellidos.length < 2 || form.apellidos.length > 100 || !nombreRegex.test(form.apellidos))) {
      err.apellidos = "Apellidos inválidos (solo letras, 2-100 caracteres).";
    }

    // Validar correo y confirmación
    if (form.correo && !validarCorreo(form.correo)) {
      err.correo = "Correo no válido (solo duoc.cl, profesor.duoc.cl o gmail.com).";
    }
    if (form.confirmarCorreo && form.confirmarCorreo !== form.correo) {
      err.confirmarCorreo = "El correo de confirmación no coincide.";
    }

    // Validar contraseña y confirmación
    if (form.pass && (form.pass.length < 4 || form.pass.length > 10)) {
      err.pass = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (form.confirmarPass && form.confirmarPass !== form.pass) {
      err.confirmarPass = "Las contraseñas no coinciden.";
    }

    // Validar teléfono chileno (+569XXXXXXXX)
    if (form.telefono && !validarTelefono(form.telefonoCodigo + form.telefono)) {
      err.telefono = "Teléfono inválido. Formato esperado: +569XXXXXXXX";
    }

    // Validar fecha nacimiento máximo hoy
    if (form.fechaNac && new Date(form.fechaNac) > new Date()) {
      err.fechaNac = "La fecha de nacimiento no puede ser futura.";
    }

    // Validar dirección
    if (form.direccion && (form.direccion.length < 5 || form.direccion.length > 255)) {
      err.direccion = "La dirección debe tener entre 5 y 255 caracteres.";
    }

    setErrors(err);
  }, [form]);

  // ---------------- Validación final al enviar ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar campos obligatorios
    const camposObligatorios = ["rut", "nombre", "apellidos", "correo", "confirmarCorreo", "pass", "confirmarPass", "region_id", "comuna_id", "direccion"];
    const camposVacios = camposObligatorios.filter((k) => !form[k]);

    // Actualiza errores y detiene si hay errores
    const errCheck = { ...errors };
    if (camposVacios.length > 0) {
      camposVacios.forEach((c) => (errCheck[c] = "Campo obligatorio."));
    }
    if (!form.region_id) {
      errCheck.region_id = "Debe seleccionar una región.";
    }
    if (!form.comuna_id && form.region_id) {
      errCheck.comuna_id = "Debe seleccionar una comuna.";
    }
    setErrors(errCheck);
    if (Object.keys(errCheck).length > 0) {
      alert("Por favor, corrija los errores antes de continuar.");
      return;
    }

    try {
      // 1. VALIDAR UNICIDAD — RUT
      try {
        await UserServices.getUserByRut(form.rut);
        alert("El RUT ya está registrado.");
        return;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          alert("Error verificando RUT en el servidor.");
          return;
        }
      }

      // 2. VALIDAR UNICIDAD — CORREO
      try {
        await UserServices.getUserByEmail(form.correo);
        alert("El correo ya está registrado.");
        return;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          alert("Error verificando correo en el servidor.");
          return;
        }
      }

      // 3. MAPEAR CAMPOS PARA EL BACKEND
      const nuevoUsuario = {
        rut: form.rut,
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
        clave: form.pass,
        fecha_nac: form.fechaNac || null,
        telefono: form.telefono ? `${form.telefonoCodigo}${form.telefono}` : null,
        direccion: form.direccion,
        region_id: parseInt(form.region_id),
        comuna_id: parseInt(form.comuna_id),
        tipoUsuario_id: 3, // cliente
        active: true
      };

      console.log('Datos a enviar:', nuevoUsuario);

      // 4. REGISTRAR EN LA BD EXTERNA (EC2)
      const response = await UserServices.createUser(nuevoUsuario);
      console.log('Usuario registrado:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario || response.data.user));
        setCurrentUser(response.data.usuario || response.data.user);
      } else {
        // Si no hay token, solo guardar usuario (menos seguro)
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
      }

      //if (onRegistered) onRegistered(response.data);

      alert("Registro exitoso 🎉");
      window.location.href = '/';

      // 6. LIMPIAR FORMULARIO
      setForm({
        rut: "",
        nombre: "",
        apellidos: "",
        correo: "",
        confirmarCorreo: "",
        pass: "",
        confirmarPass: "",
        telefonoCodigo: "+56",
        telefono: "",
        fechaNac: "",
        region_id: "",
        comuna_id: "",
        direccion: "",
      });
      setErrors({});

    } catch (error) {
      console.error("Error registrando:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        alert(`Error al registrar: ${error.response.data.message || 'Error desconocido'}`);
      } else {
        alert("Ocurrió un error inesperado al registrar.");
      }
    }
  };

  const handleAutocompletar = () => {
    // Autocompletar con la primera región y primera comuna disponible
    const primeraRegion = regiones[0];
    const comunasDeRegion = todasLasComunas.filter(c => c.region_id === primeraRegion?.id);
    
    setForm({
      rut: "11.111.111-1",
      nombre: "Juan",
      apellidos: "González",
      correo: "juan.gonzalez@duoc.cl",
      confirmarCorreo: "juan.gonzalez@duoc.cl",
      fechaNac: "1998-06-15",
      pass: "1234",
      confirmarPass: "1234",
      telefonoCodigo: "+56",
      telefono: "912345678",
      region_id: primeraRegion?.id.toString() || "",
      comuna_id: comunasDeRegion[0]?.id.toString() || "",
      direccion: "Calle Los Prados 123",
    });
  };

  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      <div className="card-body text-black">
        <section className="mt-2">
          {/* RUT */}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField
                id="rut"
                label="RUT"
                placeholder="Ej: 12.345.678-9"
                value={form.rut}
                onChange={handleChange}
                maxLength="12"
                className={`form-control ${errors.rut ? "is-invalid" : ""}`}
                required
              />
              {errors.rut && <div className="text-danger small">{errors.rut}</div>}
            </div>
          </div>

          {/* Nombre y Apellidos */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField
                id="nombre"
                label="Nombre"
                placeholder="Ej: Juan Carlos"
                value={form.nombre}
                onChange={handleChange}
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                required
              />
              {errors.nombre && <div className="text-danger small">{errors.nombre}</div>}
            </div>
            <div className="col-md-5">
              <InputField
                id="apellidos"
                label="Apellidos"
                placeholder="Ej: González Muñoz"
                value={form.apellidos}
                onChange={handleChange}
                className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                required
              />
              {errors.apellidos && <div className="text-danger small">{errors.apellidos}</div>}
            </div>
          </div>

          {/* Correo y Confirmación */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField
                id="correo"
                label="Correo"
                placeholder="Ej: juan.gonzalez@duoc.cl"
                type="email"
                value={form.correo}
                onChange={handleChange}
                maxLength="100"
                className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                required
              />
              {errors.correo && <div className="text-danger small">{errors.correo}</div>}
            </div>
            <div className="col-md-5">
              <InputField
                id="confirmarCorreo"
                label="Confirmar Correo"
                placeholder="*Repetir correo*"
                type="email"
                value={form.confirmarCorreo}
                onChange={handleChange}
                maxLength="100"
                className={`form-control ${errors.confirmarCorreo ? "is-invalid" : ""}`}
                required
              />
              {errors.confirmarCorreo && <div className="text-danger small">{errors.confirmarCorreo}</div>}
            </div>
          </div>

          {/* Fecha de Nacimiento (OPCIONAL)*/}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField
                id="fechaNac"
                label="Fecha de Nacimiento (Opcional)"
                type="date"
                value={form.fechaNac}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`form-control ${errors.fechaNac ? "is-invalid" : ""}`}
              />
              {errors.fechaNac && <div className="text-danger small">{errors.fechaNac}</div>}
            </div>
          </div>

          {/* Contraseña y Confirmación */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField
                id="pass"
                label="Contraseña"
                type="password"
                value={form.pass}
                onChange={handleChange}
                minLength="4"
                maxLength="10"
                placeholder="Ej: 68-WH@sXA."
                className={`form-control ${errors.pass ? "is-invalid" : ""}`}
                required
              />
              {errors.pass && <div className="text-danger small">{errors.pass}</div>}
            </div>
            <div className="col-md-5">
              <InputField
                id="confirmarPass"
                label="Confirmar Contraseña"
                type="password"
                value={form.confirmarPass}
                onChange={handleChange}
                minLength="4"
                maxLength="10"
                placeholder="*Repetir contraseña*"
                className={`form-control ${errors.confirmarPass ? "is-invalid" : ""}`}
                required
              />
              {errors.confirmarPass && <div className="text-danger small">{errors.confirmarPass}</div>}
            </div>
          </div>

          {/* Teléfono (OPCIONAL)*/}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <label className="form-label fw-semibold">Teléfono (Opcional)</label>
              <div className="input-group">
                <select
                  id="telefonoCodigo"
                  className="form-select"
                  value={form.telefonoCodigo}
                  onChange={handleChange}
                  style={{ maxWidth: "120px" }}
                >
                  <option value="+56">+56</option>
                </select>
                <input
                  id="telefono"
                  type="text"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  placeholder="Ej: 912345678"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength="9"
                />
              </div>
              {errors.telefono && <div className="text-danger small">{errors.telefono}</div>}
            </div>
          </div>

          {/* Región y Comuna */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <SelectField
                id="region_id"
                label="Región"
                value={form.region_id}
                onChange={handleChange}
                options={regiones}
                required
                className={errors.region_id ? "is-invalid" : ""}
              />
              {errors.region_id && <div className="text-danger small">{errors.region_id}</div>}
            </div>
            <div className="col-md-5">
              <SelectField
                id="comuna_id"
                label="Comuna"
                value={form.comuna_id}
                onChange={handleChange}
                options={comunas}
                disabled={!form.region_id}
                required
                className={errors.comuna_id ? "is-invalid" : ""}
              />
              {errors.comuna_id && <div className="text-danger small">{errors.comuna_id}</div>}
            </div>
          </div>

          {/* Dirección */}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField
                id="direccion"
                label="Dirección"
                placeholder="Ej: Calle Los Prados 123"
                value={form.direccion}
                onChange={handleChange}
                maxLength="255"
                className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                required
              />
              {errors.direccion && <div className="text-danger small">{errors.direccion}</div>}
            </div>
          </div>
        </section>

        {/* Botones */}
        <div className="row justify-content-center pt-5">
          <div className="col-md-5">
            <ButtonAction label="Registrar" type="submit" variant="primary" />
          </div>
          <div className="col-md-5">
            <ButtonAction label="Auto completar" onClick={handleAutocompletar} variant="outline" />
          </div>
        </div>
      </div>
    </form>
  );
}