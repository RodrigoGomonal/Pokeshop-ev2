import SidebarLink from "../atoms/SidebarLink";
import { useEffect, useState } from "react";
import Logo from "../atoms/Logo";
import '../../App.css';

export default function AdminSidebar() {
  const [usuario, setUsuario] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // Función para alternar el estado del dropdown
  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if (!usuarioActivo || usuarioActivo.tipo_usuario !== 1 || !usuarioActivo.activo) {
      window.location.href = "/Login";
      return;
    }
    setUsuario(usuarioActivo);
  }, []);
  
  const handleLogout = () => {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "/";
  };

   return (
    <aside className="sidebar bg-dark text-white">
      <div className="p-3 text-white">
        <Logo alt="Logo PokeShop" className="img-fluid mb-3 text-white"/>

        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <SidebarLink href="/admin/home" icon="bi-house-fill" label="Home" />
          <SidebarLink href="/admin/inventario" icon="bi-box2-fill" label="Inventario" />
          <SidebarLink href="/admin/userlist" icon="bi-person-fill-gear" label="Usuarios" />
          {/* <SidebarLink href="/admin/nuevo" icon="bi-person-fill-add" label="Nuevo Usuario" /> */}
        </ul>
        <hr />

        {usuario && (
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
                <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}