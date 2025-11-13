import React from "react";

export default function Logo() {
  return (
    <div className="d-flex align-items-center gap-2">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1200px-Pok%C3%A9_Ball_icon.svg.png"
        alt="Logo PokeShop"
        width="50"
        height="50"
        className="rounded-circle"
      />
      <span className="fs-4 fw-bold text-dark">PokeShop</span>
    </div>
  );
}
