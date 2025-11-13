import React from "react";

export default function CartCount({ count = 0 }) {
  return (
    <span
      id="cart-count"
      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
    >
      {count}
    </span>
  );
}