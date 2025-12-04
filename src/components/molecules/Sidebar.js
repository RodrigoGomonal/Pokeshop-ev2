import SidebarLink from "../atoms/SidebarLink";
import { useEffect, useState } from "react";
import Logo from "../atoms/Logo";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import '../../App.css';

export default function AdminSidebar() {
  const [usuario, setUsuario] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Función para alternar el estado del dropdown
  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // ✅ Usar AuthService en lugar de sessionStorage
    const usuarioActivo = AuthService.getCurrentUser();
    
    if (!usuarioActivo) {
      console.log("❌ No hay usuario en AdminSidebar");
      navigate("/login", { replace: true });
      return;
    }

    // Verificar que sea admin y esté activo
    if (usuarioActivo.tipousuario_id !== 1) {
      console.log("❌ Usuario no es admin en AdminSidebar");
      alert("Acceso denegado");
      AuthService.logout();
      navigate("/login", { replace: true });
      return;
    }

    if (!usuarioActivo.active) {
      console.log("❌ Usuario inactivo en AdminSidebar");
      alert("Cuenta desactivada");
      AuthService.logout();
      navigate("/login", { replace: true });
      return;
    }
    console.log("✅ Usuario cargado en AdminSidebar:", usuarioActivo.nombre);
    setUsuario(usuarioActivo);
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout(); // ✅ Usar AuthService
    navigate("/", { replace: true });
  };
  
  if (!usuario) {
    return null;
  }

  return (
    <aside className="sidebar bg-dark text-white">
      <div className="p-3 text-white">
        <Logo alt="Logo PokeShop" className="img-fluid mb-3 text-white"/>

        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <SidebarLink href="/admin/home" icon="bi-house-fill" label="Home" />
          <SidebarLink href="/admin/inventario" icon="bi-box2-fill" label="Inventario" />
          <SidebarLink href="/admin/userlist" icon="bi-person-fill-gear" label="Usuarios" />
        </ul>
        <hr />

        <div className={`dropdown ${isOpen ? 'show' : ''}`}>
          <a
            href="/"
            role="button"
            onClick={toggleDropdown}
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded={isOpen ? "true" : "false"}
          >
            <i className="bi bi-person-circle fs-5 me-2"></i>
            <strong>{usuario.nombre}</strong>
          </a>
          <ul className={`dropdown-menu dropdown-menu-dark text-small shadow ${isOpen ? 'show' : ''}`}>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}