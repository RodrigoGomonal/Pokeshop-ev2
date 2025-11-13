import React from "react";

export default function ButtonAction({
  label,
  onClick,
  variant = "primary",
  type = "button",
  icon = null,
}) {
    // - variant: Estilo del botón.
  const variants = {
    primary: "btn btn-primary",
    success: "btn btn-success",
    outline: "btn btn-outline-primary",
    danger: "btn btn-danger",
    dddanger: "dropdown-item text-danger"
  };

  const icons = {
    arrow: "bi bi-box-arrow-right me-2",
  };
  return (
    <button type={type} className={`${variants[variant]} `} onClick={onClick}>
      {icon && <i className={icons[icon]}> </i>}
      <span className="ms-2">{label}</span>
    </button>
  );
}