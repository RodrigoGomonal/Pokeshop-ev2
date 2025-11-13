import React from "react";

export default function SelectField({ label, id, value, options = [], onChange, disabled = false, required = false }) {
  return (
    <div className="form-group mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="form-control"
        disabled={disabled}
        required={required}
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
