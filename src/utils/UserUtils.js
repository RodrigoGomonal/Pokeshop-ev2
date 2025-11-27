// src/utils/UserUtils.js
// ------------------------- VALIDACIONES -----------------------------

// Formatea un RUT chileno, e.g. "12345678K" => "12.345.678-K"
export function formatearRut(rut) {
  rut = rut.replace(/[^\dkK]/g, "");
  if (rut.length > 1) {
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return cuerpo + "-" + dv;
  }
  return rut;
}
// Valida un RUT chileno
export function validarRut(rutCompleto) {
  rutCompleto = rutCompleto.replace(/\./g, "").replace("-", "");
  if (rutCompleto.length < 2) return false;
  let cuerpo = rutCompleto.slice(0, -1);
  let dv = rutCompleto.slice(-1).toUpperCase();
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  let dvEsperado = 11 - (suma % 11);
  let dvFinal = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
  return dvFinal === dv;
}
// Valida correo institucional o Gmail
export function validarCorreo(correo) {
  const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(correo);
}
// Valida número telefónico chileno (+569XXXXXXXX)
export function validarTelefono(telefono) {
  const regex = /^\+569\d{8}$/;
  return regex.test(telefono);
}

// --------------------- Gestión de sesión activa ---------------------

const SESSION_KEY = "usuarioActivo";

/**
 * Guarda el usuario activo en sessionStorage
 * @param {Object} usuario - Datos del usuario logueado
 */
export function setCurrentUser(usuario) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
  window.dispatchEvent(new Event("usuario-login"));
}

/**
 * Obtiene el usuario activo desde sessionStorage
 * @returns {Object|null} Usuario actual o null
 */
export function getCurrentUser() {
  const user = sessionStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("usuario-logout"));
}

/**
 * Verifica si hay un usuario logueado
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}




// ------------------------- LOCALSTORAGE -----------------------------
//import usersList from "../data/Users";
const usersList = ""; // IGNORE
/**
 * Carga los productos desde localStorage y escucha cambios globales.
 * 
 * @param {Function} setItems - Setter del estado de productos.
 * @param {Function} setPagina - Setter del estado de página (opcional).
 * @returns {Function} cleanup - Remueve el event listener.
 */

const RESET_USERS = JSON.parse(JSON.stringify(usersList));
const KEY = "usuariosRegistrados";

// Carga los usuarios desde localStorage y escucha cambios globales
export function loadUsersData(setItems) {
  const usuario = getUsers();

  if (Array.isArray(usuario)) {
    // Si es lista completa
    setItems(usuario);
  } else {
    // Si es un solo usuario
    usuario.push(setItems);
    localStorage.setItem(KEY, JSON.stringify(usuario));
  }

  window.dispatchEvent(new Event("users-updated"));
}

// Obtiene todos los usuarios registrados
export function getUsers() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}
// Guarda un nuevo usuario
export function saveUsers(usuario) {
  localStorage.setItem(KEY, JSON.stringify(usuario));
  window.dispatchEvent(new Event("users-updated"));
}
// Busca usuario por correo y contraseña (para login futuro)
export function searchUsers(correo, clave) {
  const usuarios = getUsers();
  return usuarios.find(u => u.correo === correo && u.clave === clave);
}
// Resetea los usuarios al estado inicial
export function resetUsers() {
  localStorage.setItem(KEY, JSON.stringify(RESET_USERS));
  window.dispatchEvent(new Event("users-updated"));
}
