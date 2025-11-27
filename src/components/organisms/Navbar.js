import { useEffect, useState  } from "react";
import { updateCartCount } from "../../utils/CartUtils";
import Logo from "../atoms/Logo";
import NavMenu from "../molecules/NavMenu";
import ButtonLink from "../atoms/ButtonLink";
import CartButton from "../molecules/CartButton";
import UserChip from "../molecules/UserChip";
import { getCurrentUser, logout } from "../../utils/UserUtils";
import { useNavigate } from "react-router-dom";
import '../../App.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    updateCartCount();

    // Cargar usuario actual
    setUsuarioActivo(getCurrentUser());

    // Escuchar eventos de login/logout
    const handleLogin = () => {
      setUsuarioActivo(getCurrentUser());
    };

    const handleLogout = () => {
      setUsuarioActivo(null);
    };

    window.addEventListener("usuario-login", handleLogin);
    window.addEventListener("usuario-logout", handleLogout);

    return () => {
      window.removeEventListener("usuario-login", handleLogin);
      window.removeEventListener("usuario-logout", handleLogout);
    };
  }, []);

  const closeSesion = () => {
    logout();
    navigate("/");
  };
  /* const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    updateCartCount();

    // Cargar usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("usuarioActivo");
    if (storedUser) { setUsuarioActivo(JSON.parse(storedUser)); }

    // Escuchar eventos de login/logout
    const handleLogin = () => {
      const user = sessionStorage.getItem("usuarioActivo");
      setUsuarioActivo(user ? JSON.parse(user) : null);
    };

    const handleLogout = () => { setUsuarioActivo(null); };

    window.addEventListener("usuario-login", handleLogin);
    window.addEventListener("usuario-logout", handleLogout);

    return () => {
      window.removeEventListener("usuario-login", handleLogin);
      window.removeEventListener("usuario-logout", handleLogout);
    };
  }, []);

  const closeSesion = () => {
    sessionStorage.removeItem("usuarioActivo");
    setUsuarioActivo(null);
    window.dispatchEvent(new Event("usuario-logout"));
    window.location.href = "/";
  }; */

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm pokeMartBackground">
        <div className="container px-5">
          <Logo />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <NavMenu />
            <div className="d-flex">
              <CartButton />
              {usuarioActivo ? (
                <UserChip usuario={usuarioActivo} onLogout={closeSesion} />
              ) : (
                <>
                  <ButtonLink label="Iniciar Sesión" href="/Login" variant="primary"/>
                  <ButtonLink label="Registrarse" href="/RegisterUsu" variant="outline"/>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div 
        style={{
          height: '3px',
          background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)',
          width: '100%'
        }}
      />
    </>
  );
}
