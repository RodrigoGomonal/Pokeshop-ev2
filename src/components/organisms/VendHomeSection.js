import AdminTitle from "../atoms/AdminTitle";
import Icon from "../atoms/Icon";
import '../../App.css';

export default function VendHomeSection({ nombre }) {
  return (
    <div className=""
      style={{ 
        minHeight: "100vh", 
        // Fondo principal: gradiente de azul vibrante
        background: "linear-gradient(135deg, #428CFF, #8CBFFF, #D0E6FF)",
        // Múltiples fondos: el gradiente de arriba + el patrón
        backgroundImage: `
          linear-gradient(135deg, #428CFF, #8CBFFF, #428CFF),
          repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 20px, transparent 20px, transparent 40px),
          repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 20px, transparent 20px, transparent 40px)
        `,
        backgroundSize: "cover, 40px 40px, 40px 40px", // El tamaño del patrón para los dos repeating-linear-gradient
        backgroundPosition: "center", // Centra ambos patrones
        backgroundBlendMode: "overlay", // Esto mezcla el gradiente con los patrones de forma sutil
    }}
    >
      <div className="container d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "90vh" }}>
        <AdminTitle nombre={nombre} /> 
        <Icon width='250' height='250' />
      </div>
    </div>
  );
}
