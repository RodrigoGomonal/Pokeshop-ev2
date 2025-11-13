import { useEffect, useRef } from "react";
import { Dropdown } from "bootstrap";
import PropTypes from "prop-types";
import ButtonAction from "../atoms/ButtonAction.js";
import '../../App.css';

export default function UserChip({usuario, onLogout}) {
    // Referencia al botón del dropdown en el DOM
    const dropdownRef = useRef(null);
    // Almacena la instancia Bootstrap.Dropdown (para manipularla manualmente)
    const dropdownInstance = useRef(null);
    /**
     * Inicializa el dropdown de Bootstrap cuando el componente se monta.
     * Usa `useEffect` para asegurar que el DOM del botón ya exista.
     */
    useEffect(() => {
        if (dropdownRef.current) {
        dropdownInstance.current = new Dropdown(dropdownRef.current, {
            autoClose: true,
            boundary: "viewport", // evita que se corte el menú en pantallas pequeñas
        });
        }
        // Limpieza al desmontar: destruye la instancia para evitar fugas de memoria
        return () => {
            if (dropdownInstance.current) {
                dropdownInstance.current.dispose();
            }
        };
    }, []);
    /**
     * Maneja manualmente el toggle del menú.
     * Esto reemplaza el comportamiento automático del atributo `data-bs-toggle`
     * que no funciona de forma confiable con React.
     */
    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropdownInstance.current) {
        dropdownInstance.current.toggle();
        }
    };
return (
    <div className="dropdown">
        <button
            ref={dropdownRef}
            onClick={handleToggle}
            className="btn btn-light d-flex align-items-center dropdown-toggle"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >  
        <div
        style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#e9ecef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
            fontWeight: 700,
            color: "#333",
            fontSize: 14,
        }}
        aria-hidden
        >
        {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
        </div>
        <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
            {usuario.nombre}
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>
            {usuario.correo}
        </div>
        </div>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
            <li>
                <ButtonAction label="Cerrar sesión" onClick={onLogout} variant="dddanger" icon="arrow"/>
            </li>
        </ul>
    </div>
);
}

UserChip.propTypes = {
  usuario: PropTypes.shape({
    nombre: PropTypes.string,
    correo: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};