import RegisterForm from "../molecules/RegisterForm";

export default function RegisterSection() {
  const handleRegistered = (usuario) => {
    console.log("Usuario registrado exitosamente:", usuario);
  };

  return (
    <section className="container mt-4">
      <div className="col-12 col-xxl-8 offset-xxl-2">
        <div className="card mb-3 shadow rounded-4">
          <div id="header_card" className="card-header rounded-4 rounded-bottom-0 text-center bg-primary text-white">
            <h4 className="pt-3">Registro de Usuario</h4>
          </div>

          {/* Aquí la molecule que contiene el formulario */}
          <RegisterForm onRegistered={handleRegistered} />
        </div>
      </div>
    </section>
  );
}
