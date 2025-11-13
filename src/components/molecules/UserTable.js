import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { getUsers, saveUsers } from "../../utils/UserUtils";
import ButtonAction from "../atoms/ButtonAction";
import SearchInput from "../atoms/SearchInput";
import usersList from "../../data/Users.js";
import "../../App.css";

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const usuariosPorPagina = 10;

  // Cargar usuarios
  useEffect(() => {
    try {
      const stored = localStorage.getItem("usersList");
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        setUsers(usersList);
        localStorage.setItem("usuarios", JSON.stringify(usersList));
        
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers(usersList);
    }
  }, []);

  // Guardar en localStorage al cambiar
  useEffect(() => {
    if (users && users.length > 0) {
      saveUsers(users);
    }
  }, [users]);

  // Escuchar cambios globales
  useEffect(() => {
    const actualizar = () => {
      const nuevos = getUsers();
      setUsers(nuevos);
      setPagina(1);
    };
    window.addEventListener("users-updated", actualizar);
    return () => window.removeEventListener("users-updated", actualizar);
  }, []);

  // Filtro de búsqueda
  const filtrados = users.filter((u) => {
    const texto = search.toLowerCase();
    if (!u) return false;
    const nombre = (u.nombre || "").toLowerCase();
    const apellidos = (u.apellidos || "").toLowerCase();
    const rut = (u.rut || "").toLowerCase();
    const correo = (u.correo || "").toLowerCase();

    return (
      nombre.includes(texto) ||
      apellidos.includes(texto) ||
      rut.includes(texto) ||
      correo.includes(texto)
    );
  });

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / usuariosPorPagina);
  const usuariosPaginados = filtrados.slice(
    (pagina - 1) * usuariosPorPagina,
    pagina * usuariosPorPagina
  );

  const siguiente = () => { if (pagina < totalPaginas) setPagina(pagina + 1); };
  const anterior = () => { if (pagina > 1) setPagina(pagina - 1); };

  // ---- ELIMINAR ----
  const handleOpenDelete = (usuario) => {
    setUsuarioSeleccionado(usuario);
    const modal = new Modal(document.getElementById("ModalEliminarUsuario"));
    modal.show();
  };
  const handleDelete = (rut) => {
    const actualizados = users.filter((u) => u.rut !== rut);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setUsers(actualizados);
    const modal = Modal.getInstance(document.getElementById("ModalEliminarUsuario"));
    modal.hide();
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <ButtonAction
          icon="bi-person-plus-fill"
          label="Agregar Usuario"
          variant="success"
          onClick={() => alert("Abrir modal de agregar usuario (por implementar)")}
        />
        <SearchInput
          placeholder="Buscar por RUT, nombre o correo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>RUT</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Región</th>
              <th>Comuna</th>
              <th>Tipo Usuario</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((u) => (
              <tr>
                <td>{u.rut}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.telefono || "—"}</td>
                <td>{u.region}</td>
                <td>{u.comuna}</td>
                <td>
                  {u.tipo_usuario === 1 ? "Administrador" : u.tipo_usuario === 2 ? "Encargado" : "Usuario"}
                </td>
                <td>
                  <span className={`px-3 py-1 rounded ${
                      u.activo ? "bg-success text-white" : "bg-danger text-white"
                    }`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary"
                    //onClick={ }
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleOpenDelete(u)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {usuariosPaginados.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button className="btn btn-outline-primary" disabled={pagina === 1} onClick={anterior}>
              <i className="bi bi-arrow-left"></i> Anterior
            </button>
          </li>
          <li className="page-item ms-3">
            <button className="btn btn-primary" disabled={pagina === totalPaginas} onClick={siguiente}>
              Siguiente <i className="bi bi-arrow-right"></i>
            </button>
          </li>
        </ul>
        <p className="text-center text-muted">
          Página {pagina} de {totalPaginas || 1}
        </p>
      </nav>

      {/* Modales (placeholders por ahora) */}
      <div className="modal fade" id="ModalEliminarUsuario" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <h5>¿Eliminar usuario?</h5>
            <p>
              Se eliminará a <strong>{usuarioSeleccionado?.nombre}</strong>.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button className="btn btn-danger"
                onClick={() => handleDelete(usuarioSeleccionado?.rut)}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
