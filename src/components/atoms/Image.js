import React from "react";

export default function BlogImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="img-fluid bg-white rounded p-4"
    />
  );
}