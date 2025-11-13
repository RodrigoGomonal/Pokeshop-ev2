import React from "react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="form-control w-25"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
