import React from "react";

export default function NavLink({ label, href, active }) {
  return (
    <a
      href={href}
      className={`nav-link px-3 ${active ? "text-primary fw-bold" : "text-dark"} hover-link`}
    >
      {label}
    </a>
  );
}