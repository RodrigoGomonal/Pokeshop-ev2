import { NavLink } from "react-router-dom";

export default function SidebarLink({ href, icon, label, active }) {
  return (
    <li className="nav-item my-2">
      <NavLink
        to={href}
        className={({ isActive }) =>
          `nav-link text-white d-flex align-items-center ${isActive ? "active bg-primary text-white" : ""}`
        }
      >
        <i className={`bi ${icon} me-2`}></i>
        {label}
      </NavLink>
    </li>
  );
}