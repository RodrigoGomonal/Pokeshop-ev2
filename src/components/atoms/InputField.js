import React from "react";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
  minLength,
  error,
  required = true
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}