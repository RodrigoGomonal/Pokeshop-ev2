import React from "react";

export default function SelectField({ 
  id, 
  label, 
  value, 
  onChange, 
  options = [], 
  disabled = false,
  required = false,
  className = ""
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={id}
        className={`form-select ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => {
          // Si es un objeto, usar sus propiedades
          if (typeof option === 'object' && option !== null) {
            return (
              <option 
                key={option.id} 
                value={option.id}
              >
                {option.name || option.nombre || 'Sin nombre'}
              </option>
            );
          }
          // Si es string, usarlo directamente
          return (
            <option 
              key={option} 
              value={option}
            >
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
