// src/components/molecules/LoginForm.js
import React, { useState } from "react";
import InputField from "../atoms/InputField";
import ButtonAction from "../atoms/ButtonAction";
import { usersList } from "../../data/Users.js";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [errores, setErrores] = useState({});

  const validarLogin = (e) => {
    e.preventDefault(); // ✅ Evita el refresh de la página

    const erroresTemp = {};
    const usuario = usersList.find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase()
    );
    // Validaciones
    if (!usuario) {
      erroresTemp.correo = "El correo no está registrado.";
    } else if (!usuario.activo) {
      erroresTemp.correo = "El usuario está deshabilitado.";
    } else if (usuario.clave !== pass) {
      erroresTemp.pass = "Contraseña incorrecta.";
    }
    setErrores(erroresTemp);

    
    if (Object.keys(erroresTemp).length === 0) {
      sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      window.dispatchEvent(new Event("usuario-login"));
      switch (usuario.tipo_usuario) {
        case 1: //Admin
          window.location.href = "/admin/home";
          break;
        case 2: //Vendedor
          alert("Login exitoso como Vendedor");
          //window.location.href = "/user/home";
          break;
        case 3: //Cliente
          window.location.href = "/";
          break;
        default:
          console.error("Tipo de usuario no reconocido");
      }
    }
  };

  return (
    <form noValidate className="needs-validation">
      <div className="card-body text-black">
        <section className="mt-2">
          <div className="row pt-2">
            <InputField
              id="txt_correo"
              label="Correo"
              type="email"
              placeholder="Ej: juan.gonzalez@duoc.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
              required
            />
          </div>

          <div className="row pt-2">
            <InputField
              id="txt_pass"
              label="Contraseña"
              type="password"
              placeholder="Ej: 1A#b"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              error={errores.pass}
              required
            />
          </div>
        </section>
        <br/>
        <ButtonAction type="submit" label="Iniciar Sesión" onClick={validarLogin} variant="primary" />
      </div>
    </form>
  );
}