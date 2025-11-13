// src/components/molecules/RegisterForm.jsx
import React, { useState, useEffect } from "react";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import ButtonAction from "../atoms/ButtonAction";
import regionesYComunas from "../../data/RegCom";
import { formatearRut, validarRut, validarCorreo, validarTelefono, saveUsers, getUsers} from "../../utils/UserUtils";

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
    fechnac: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [comunas, setComunas] = useState([]);

  // Actualiza comunas cuando cambia la región
  useEffect(() => {
    const r = regionesYComunas.find((x) => x.nombre === form.region);
    setComunas(r ? r.comunas : []);
    setForm((prev) => ({ ...prev, comuna: "" }));
  }, [form.region]);

  // ---------------- Manejador general ----------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    let nuevoValor = value;
    if (id === "rut") { nuevoValor = formatearRut(value);}
    setForm((prev) => ({ ...prev, [id]: nuevoValor }));
  };

  // ---------------- Validaciones en tiempo real ----------------
  useEffect(() => {
    const err = {};
    // Validar RUT
    if (form.rut.length >= 12) {
      if (!validarRut(form.rut)) { err.rut = "RUT inválido."; }
    } else if (form.rut) { err.rut = "RUT incompleto."; }
    // Validar nombre y apellidos
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (form.nombre && (form.nombre.length < 2 || form.nombre.length > 50 || !nombreRegex.test(form.nombre))) {
      err.nombre = "Nombre inválido (solo letras, 2-50 caracteres).";
    }
    if (form.apellidos && (form.apellidos.length < 2 || form.apellidos.length > 50 || !nombreRegex.test(form.apellidos))) {
      err.apellidos = "Apellidos inválidos (solo letras, 2-50 caracteres).";
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
    // Validar fecha nacimiento maximo hoy
    if (form.fechnac && new Date(form.fechnac) > new Date()) {
      err.fechnac = "La fecha de nacimiento no puede ser futura.";
    }
    // Validar región y comuna
    if (!form.region) { err.region = "Debe seleccionar una región."; }
    if (!form.comuna) { err.comuna = "Debe seleccionar una comuna."; }
    // Validar dirección
    if (form.direccion && (form.direccion.length < 5 || form.direccion.length > 300)) {
      err.direccion = "La dirección debe tener entre 5 y 300 caracteres.";
    }
    setErrors(err);
  }, [form]); // se ejecuta cada vez que cambia un campo

  // ---------------- Validación final al enviar ----------------

  const handleSubmit = (e) => {
    // Previene el envío por defecto
    e.preventDefault();
    // Verificar campos obligatorios
    const camposVacios = Object.keys(form).filter(
      (k) =>
        !form[k] &&
        !["telefonoCodigo", "telefono", "fechaNac"].includes(k)
    );
    // Actualiza errores y detiene si hay errores
    const errCheck = { ...errors };
    if (camposVacios.length > 0) {
      camposVacios.forEach((c) => (errCheck[c] = "Campo obligatorio."));
    }

    setErrors(errCheck);
    if (Object.keys(errCheck).length > 0) {
      alert("Por favor, corrija los errores antes de continuar.");
      return;
    }
    // Verificar unicidad de RUT y correo
    const usuarios = getUsers();
    let rutExiste = false;
    let correoExiste = false;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].rut === form.rut) {
        rutExiste = true;
      }
      if (usuarios[i].correo === form.correo) {
        correoExiste = true;
      }
    }

    if (rutExiste) {
      return;
    }
    if (correoExiste) {
      return;
    }
    /* const usuarios = getUsers() || [];
    if (usuarios.some((u) => u.rut === form.rut)) {
      alert("El RUT ingresado ya está registrado.");
      return;
    }
    if (usuarios.some((u) => u.correo === form.correo)) {
      alert("El correo ingresado ya está registrado.");
      return;
    } */
    // Simulación de registro exitoso
    const nuevoUsuario = {
      rut: form.rut,
      nombre: form.nombre,
      apellidos: form.apellidos,
      correo: form.correo,
      clave: form.pass,
      fechnac: form.fechnac,
      telefono: form.telefono,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion,
      tipo_usuario: 3,
      activo: true,
    };
    // Guardar en localStorage
    saveUsers(nuevoUsuario);
    // Notificar al padre
    if (onRegistered) onRegistered(nuevoUsuario);

    alert("Registro exitoso (demo).");
    // Resetear formulario
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
      region: "",
      comuna: "",
      direccion: "",
    });
  };

  const handleAutocompletar = () => {
    setForm({
      rut: "11.111.111-1",
      nombre: "Juan",
      apellidos: "González",
      correo: "juan.gonzalez@duoc.cl",
      confirmarCorreo: "juan.gonzalez@duoc.cl",
      fechnac: "15-06-1998",
      pass: "1234",
      confirmarPass: "1234",
      telefonoCodigo: "+56",
      telefono: "912345678",
      region: "Región Metropolitana",
      comuna: "Santiago",
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
              <InputField id="rut" label="RUT" placeholder="Ej: 12.345.678-9" value={form.rut} 
              onChange={handleChange} maxLength="12" 
              className={`form-control ${errors.rut ? "is-invalid" : ""}`} required/>
              {errors.rut && <div className="text-danger small">{errors.rut}</div>}
            </div>
          </div>

          {/* Nombre y Apellidos */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField id="nombre" label="Nombre" placeholder="Ej: Juan Carlos" value={form.nombre} 
              onChange={handleChange} 
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`} required/>
              {errors.nombre && <div className="text-danger small">{errors.nombre}</div>}
            </div>
            <div className="col-md-5">
              <InputField id="apellidos" label="Apellidos" placeholder="Ej: González Muñoz" value={form.apellidos} 
              onChange={handleChange} 
              className={`form-control ${errors.apellidos ? "is-invalid" : ""}`} required/>
              {errors.apellidos && <div className="text-danger small">{errors.apellidos}</div>}
            </div>
          </div>

          {/* Correo y Confirmación */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField id="correo" label="Correo" placeholder="Ej: juan.gonzalez@duoc.com" type="email" value={form.correo} 
              onChange={handleChange} maxlength="100" 
              className={`form-control ${errors.correo ? "is-invalid" : ""}`} required/>
              {errors.correo && <div className="text-danger small">{errors.correo}</div>}
            </div>
            <div className="col-md-5">
              <InputField id="confirmarCorreo" label="Confirmar Correo" placeholder="*Repetir correo*" type="email" value={form.confirmarCorreo} 
              onChange={handleChange} maxlength="100" 
              className={`form-control ${errors.confirmarCorreo ? "is-invalid" : ""}`} required/>
              {errors.confirmarCorreo && <div className="text-danger small">{errors.confirmarCorreo}</div>}
            </div>
          </div>

          {/* Fecha de Nacimiento (OPCIONAL)*/}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField id="fechaNac" label="Fecha de Nacimiento (Opcional)" type="date" value={form.fechaNac} onChange={handleChange} 
              max={new Date().toISOString().split("T")[0]} className={`form-control ${errors.fechaNac ? "is-invalid" : ""}`}/>
            </div>
          </div>

          {/* Contraseña y Confirmación */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <InputField id="pass" label="Contraseña" type="password" value={form.pass} onChange={handleChange} minlength="4" maxlength="10" 
              placeholder="Ej: 68-WH@sXA." className={`form-control ${errors.pass ? "is-invalid" : ""}`} required/>
              {errors.pass && <div className="text-danger small">{errors.pass}</div>}
            </div>
            <div className="col-md-5">
              <InputField id="confirmarPass" label="Confirmar Contraseña" type="password" value={form.confirmarPass} 
              onChange={handleChange} minlength="4" maxlength="10" 
              placeholder="*Repetir contraseña*" className={`form-control ${errors.confirmarPass ? "is-invalid" : ""}`} required/>
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
                  type="number"
                  className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                  placeholder="Ej: 912345678"
                  value={form.telefonoNumero}
                  onChange={handleChange}
                  maxLength="9"
                />
              </div>
              {errors.telefono && <div className="text-danger small">{errors.telefono}</div>}
            </div>
          </div>
          {/* <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField id="telefono" label="Teléfono (Opcional)" value={form.telefono} onChange={handleChange} maxLength="12"
               placeholder="Ej: +56 9 1234 5678" className={`form-control ${errors.telefono ? "is-invalid" : ""}`} />
              {errors.telefono && <div className="text-danger small">{errors.telefono}</div>}
            </div>
          </div> */}

          {/* Región y Comuna */}
          <div className="row justify-content-center pt-2">
            <div className="col-md-5">
              <SelectField id="region" label="Región" value={form.region} onChange={handleChange} options={regionesYComunas.map(r => r.nombre)} />
              {errors.region && <div className="text-danger small">{errors.region}</div>}
            </div>
            <div className="col-md-5">
              <SelectField id="comuna" label="Comuna" value={form.comuna} onChange={handleChange} options={comunas} disabled={!form.region} />
              {errors.comuna && <div className="text-danger small">{errors.comuna}</div>}
            </div>
          </div>

          {/* Dirección */}
          <div className="row pt-2">
            <div className="col-md-10 offset-md-1">
              <InputField id="direccion" label="Dirección" placeholder="Ej: Calle Los Prados 123" value={form.direccion} onChange={handleChange} 
              maxlength="300" className={`form-control ${errors.direccion ? "is-invalid" : ""}`} required/>
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
