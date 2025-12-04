/* // src/components/pages/Admin/Home.js
import React, { useEffect, useState } from "react";
import AdminLayout from "../../templates/AdminLayout";
import AdHomeSection from "../../organisms/AdHomeSection";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    
    if (usuarioActivo && usuarioActivo.tipo_usuario === 1) {
      setUsuario(usuarioActivo);
      setCargando(false);
    } else {
      // Redirigir inmediatamente sin renderizar
      window.location.href = "/Login";
    }
  }, []);

  // No renderizar nada mientras se verifica la autenticación
  if (cargando) {
    return null; // O un spinner de carga si prefieres
  }

  // Solo renderizar si hay usuario válido
  if (!usuario) {
    return null;
  }

  return (
    <AdminLayout>
      <AdHomeSection nombre={usuario?.nombre} />
    </AdminLayout>
  );
}
 */



// src/components/pages/Admin/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../templates/AdminLayout";
import AdHomeSection from "../../organisms/AdHomeSection";
import AuthService from "../../../services/AuthService";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAccesoAdmin = async () => {
      try {
        // 1. Verificar que existe token
        const token = AuthService.getToken();
        if (!token) {
          console.log("No hay token de autenticación");
          redirigirALogin("Debe iniciar sesión");
          return;
        }

        // 2. Obtener usuario desde localStorage (AuthService)
        const usuarioActual = AuthService.getCurrentUser();
        if (!usuarioActual) {
          console.log("No hay usuario en localStorage");
          redirigirALogin("Sesión inválida");
          return;
        }

        // 3. Verificar que sea administrador (tipousuario_id === 1)
        if (usuarioActual.tipousuario_id !== 1) {
          console.log("❌ Usuario no es administrador:", usuarioActual);
          alert("⚠️ Acceso denegado. Esta área es solo para administradores.");
          AuthService.logout();
          navigate("/Login", { replace: true });
          return;
        }

        // 4. Usuario válido y es admin
        console.log("✅ Acceso autorizado para admin:", usuarioActual.nombre);
        setUsuario(usuarioActual);
        setCargando(false);

      } catch (error) {
        console.error("Error al verificar acceso:", error);
        redirigirALogin("Error de autenticación");
      }
    };

    const redirigirALogin = (mensaje) => {
      console.log(mensaje);
      AuthService.logout(); // Limpia localStorage
      sessionStorage.clear(); // Limpia sessionStorage viejo
      navigate("/Login", { replace: true });
    };
    verificarAccesoAdmin();
  }, [navigate]);

  

  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verificando permisos de administrador...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <AdminLayout>
      <AdHomeSection nombre={usuario.nombre} />
    </AdminLayout>
  );
}