// src/components/molecules/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../utils/UserUtils.js";
import InputField from "../atoms/InputField";
import ButtonAction from "../atoms/ButtonAction";
import AuthService from "../../services/AuthService.js";

export default function LoginForm() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const validarLogin = async (e) => {
    e.preventDefault();
    setErrores({});
    setLoading(true);

    // Validar campos vacíos básicos antes de la llamada a la API
    if (!correo || !pass) {
      setErrores({
        correo: !correo ? "El correo es requerido." : "",
        pass: !pass ? "La contraseña es requerida." : "",
      });
      setLoading(false);
      return;
    }

    try {
      // 🔑 CAMBIO CLAVE: Llamada al servicio de autenticación.
      // 1. Envía el correo y la contraseña al backend.
      // 2. El backend verifica las credenciales y devuelve un objeto que contiene:
      //    a) token (JWT)
      //    b) usuario (datos como id, nombre, tipoUsuario_id, etc.)
      const response = await AuthService.login(correo, pass);

      // Verificamos si la respuesta contiene los datos esperados
      if (!response.token || !response.usuario) {
         throw new Error("Respuesta de API incompleta.");
      }
      
      const usuario = response.usuario;
      console.log("✅ Usuario autenticado:", usuario.nombre, "Tipo:", usuario.tipousuario_id);
      // Guardar el token (manejado dentro de AuthService.login o UserUtils)
      // y los datos del usuario en sessionStorage (o Context/Redux)
      setCurrentUser(usuario); 
      // NOTA: AuthService.login debería ser responsable de guardar el response.token en localStorage/sessionStorage.

      // --- LÓGICA DE REDIRECCIÓN ---
      
      // Verificar si hay redirección pendiente
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl, { replace: true });
        return;
      }

      // Redirigir según tipo de usuario
      switch (usuario.tipousuario_id ) {
        case 1: // Admin
          navigate("/admin/home", { replace: true });
          break;
        case 2: // Vendedor
          navigate("/vendedor/home", { replace: true });
          break;
        case 3: // Cliente
          navigate("/", { replace: true });
          break;
        default:
          console.error("❌ Tipo de usuario no reconocido:", usuario.tipousuario_id);
          AuthService.logout();
          setErrores({
            correo: "Tipo de usuario no reconocido. Contacte a soporte.",
          });
          return;
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);

      let errorMessage = "Error al iniciar sesión. Intenta nuevamente.";

      // Manejo de errores específicos
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Correo o contraseña incorrectos.";
            break;
          case 404:
            errorMessage = "Usuario no encontrado.";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrores({ correo: errorMessage });
    } finally {
      setLoading(false);
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
        <br />
        <ButtonAction
          type="submit"
          label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          onClick={validarLogin}
          variant="primary"
          disabled={loading}
        />
      </div>
    </form>
  );
}