import React from "react";
import LoginForm from "../molecules/LoginForm";

export default function LoginSection() {
  return (
    <div className="container text-center mt-4 mb-5">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1200px-Pok%C3%A9_Ball_icon.svg.png"
        alt="logo empresa"
        width="150"
        height="150"
      />
      <h1 className="my-3">PokeStore</h1>

      <div className="container mt-4 col-xxl-4 offset-xxl-4">
        <LoginForm />
      </div>
    </div>
  );
}