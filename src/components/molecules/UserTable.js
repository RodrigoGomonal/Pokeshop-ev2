import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import DeleteModal from "./DeleteModal";
import UpdateUserModal from "./UpdateUserModal";
import AddUserModal from "./AddUserModal";
import ButtonAction from "../atoms/ButtonAction";
import SearchInput from "../atoms/SearchInput";
import UserServices from "../../services/UserServices";
import RegionServices from "../../services/RegionServices";
import CommuneServices from "../../services/CommuneServices";
import UserTypeServices from "../../services/UserTypeServices";
import "../../App.css";

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usuariosPorPagina = 10;

  // Cargar datos desde la BD
  useEffect(() => {
    fetchUsers();
    fetchRegiones();
    fetchComunas();
    fetchTiposUsuario();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserServices.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error al cargar los usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegiones = async () => {
    try {
      const response = await RegionServices.getAllRegions();
      setRegiones(response.data || []);
    } catch (err) {
      console.error("Error cargando regiones:", err);
    }
  };

  const fetchComunas = async () => {
    try {
      const response = await CommuneServices.getAllCommunes();
      setComunas(response.data || []);
    } catch (err) {
      console.error("Error cargando comunas:", err);
    }
  };

  const fetchTiposUsuario = async () => {
    try {
      const response = await UserTypeServices.getAllUserTypes();
      setTiposUsuario(response.data || []);
    } catch (err) {
      console.error("Error cargando tipos de usuario:", err);
    }
  };

  // Obtener nombres por ID
  const getRegionName = (regionId) => {
    const region = regiones.find(r => r.id === regionId);
    return region?.name || `ID: ${regionId}`;
  };

  const getComunaName = (comunaId) => {
    const comuna = comunas.find(c => c.id === comunaId);
    return comuna?.name || `ID: ${comunaId}`;
  };

  const getTipoUsuarioName = (tipoId) => {
    const tipo = tiposUsuario.find(t => t.id === tipoId);
    return tipo?.name || "Usuario";
  };

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

  // Función para cerrar modal correctamente
  const closeModal = (modalId) => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.removeAttribute('aria-modal');
      }, 150);
    }
  };

  // ---- AGREGAR ----
  const handleOpenAdd = () => {
    const modal = new Modal(document.getElementById("ModalAgregarUsuario"));
    modal.show();
  };

  const handleAdd = async (nuevoUsuario) => {
    try {
      await UserServices.createUser(nuevoUsuario);
      console.log("Usuario agregado:", nuevoUsuario);
      closeModal("ModalAgregarUsuario");
      await fetchUsers();
      setPagina(1);
    } catch (err) {
      console.error("Error al agregar usuario:", err);
      alert("Error al agregar el usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // ---- ELIMINAR ----
  const handleOpenDelete = (usuario) => {
    setUsuarioSeleccionado(usuario);
    const modal = new Modal(document.getElementById("ModalEliminar"));
    modal.show();
  };

  const handleDelete = async (id) => {
    try {
      await UserServices.deleteUserById(id);
      closeModal("ModalEliminar");
      await fetchUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar el usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // ---- ACTUALIZAR ----
  const handleOpenUpdate = (usuario) => {
    setUsuarioSeleccionado(usuario);
    const modal = new Modal(document.getElementById("ModalActualizarUsuario"));
    modal.show();
  };

  const handleUpdate = async (usuarioActualizado) => {
    try {
      await UserServices.updateUser(usuarioActualizado.rut, usuarioActualizado);
      closeModal("ModalActualizarUsuario");
      await fetchUsers();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("Error al actualizar el usuario: " + (err.response?.data?.message || err.message));
    }
  };

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / usuariosPorPagina);
  const usuariosPaginados = filtrados.slice(
    (pagina - 1) * usuariosPorPagina,
    pagina * usuariosPorPagina
  );

  const siguiente = () => { if (pagina < totalPaginas) setPagina(pagina + 1); };
  const anterior = () => { if (pagina > 1) setPagina(pagina - 1); };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <ButtonAction
          icon="bi-person-plus-fill"
          label="Agregar Usuario"
          variant="success"
          onClick={handleOpenAdd}
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
              <tr key={u.rut}>
                <td>{u.rut}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.telefono || "—"}</td>
                <td>
                  <span className="badge bg-info text-dark">
                    {getRegionName(u.region_id)}
                  </span>
                </td>
                <td>
                  <span className="badge bg-info text-dark">
                    {getComunaName(u.comuna_id)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    u.tipousuario_id === 1 ? 'bg-primary' : 
                    u.tipousuario_id === 2 ? 'bg-warning text-dark' : 
                    'bg-secondary'
                  }`}>
                    {getTipoUsuarioName(u.tipousuario_id)}
                  </span>
                </td>
                <td>
                  <span className={`px-3 py-1 rounded ${
                    u.active ? "bg-success text-white" : "bg-danger text-white"
                  }`}>
                    {u.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleOpenUpdate(u)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleOpenDelete(u)}
                  >
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
            <button 
              className="btn btn-outline-primary" 
              disabled={pagina === 1} 
              onClick={anterior}
            >
              <i className="bi bi-arrow-left"></i> Anterior
            </button>
          </li>
          <li className="page-item ms-3">
            <button 
              className="btn btn-primary" 
              disabled={pagina === totalPaginas} 
              onClick={siguiente}
            >
              Siguiente <i className="bi bi-arrow-right"></i>
            </button>
          </li>
        </ul>
        <p className="text-center text-muted">
          Página {pagina} de {totalPaginas || 1}
        </p>
      </nav>
      {/* Modales de Agregar, Editar y Eliminar */}
      <DeleteModal 
        titulo="Eliminar usuario"
        nombre={usuarioSeleccionado?.nombre}
        onDelete={() => handleDelete(usuarioSeleccionado?.id)}
      />
      <UpdateUserModal 
        usuario={usuarioSeleccionado}
        regiones={regiones}
        comunas={comunas}
        tiposUsuario={tiposUsuario}
        onUpdate={handleUpdate}
      />
      <AddUserModal 
        regiones={regiones}
        comunas={comunas}
        tiposUsuario={tiposUsuario}
        onAdd={handleAdd} 
      />
    </>
  );
}