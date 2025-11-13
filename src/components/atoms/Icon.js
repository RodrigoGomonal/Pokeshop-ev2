import React from "react";

export default function Icon({ width, height}) {
  return (
    <div className="d-flex align-items-center gap-2">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1200px-Pok%C3%A9_Ball_icon.svg.png"
        alt="Logo PokeShop"
        width={width}
        height={height}
        className="rounded-circle"
      />
    </div>
  );
}
