//import NavLink from "../atoms/NavLink";
import { Link } from "react-router-dom";

export default function NavMenu() {
  const links = [
    { label: "Inicio", to: "/" },
    { label: "Productos", to: "/productos" },
    { label: "Nosotros", to: "/nosotros" },
    { label: "Blogs", to: "/blogs" },
    { label: "Contacto", to: "/contacto" },
  ];


  return (
    <ul className="navbar-nav mx-auto">
      {links.map((link, index) => (
        <li key={index} className="nav-item">
          <Link className="nav-link" to={link.to}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
