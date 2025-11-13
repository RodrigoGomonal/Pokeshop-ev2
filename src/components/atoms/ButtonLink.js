import React from "react";

export default function ButtonLink({ label, href, variant = "primary" ,icon = null}) {
  // - variant: Estilo del botón.
  const variants = {
    primary: "btn btn-primary",
    success: "btn btn-success",
    outline: "btn btn-outline-primary",
    danger: "btn btn-danger",
  };
  const icons = {
    cart: "bi bi-cart3",
  };

  return (
    <a href={href} className={`${variants[variant]} mx-1`}>
      {icon && <i className={icons[icon]}> </i>}      
      {label}
    </a>
  );
}
