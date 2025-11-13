import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LoginForm from "../src/components/molecules/LoginForm";

describe("Componente LoginForm", () => {
  it("debería renderizar correctamente el formulario de login", () => {
    render(<LoginForm onLogin={() => {}} />);
    expect(screen.getByLabelText("Correo")).toBeTruthy();
    expect(screen.getByLabelText("Contraseña")).toBeTruthy();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeTruthy();
  });

});