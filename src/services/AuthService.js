// src/services/AuthService.js
import axios from 'axios';
import { BASE_URL } from './Connection';

//const API_URL = 'http://TU-IP-PUBLICA-EC2:3000/auth'; 
const API_URL = `${BASE_URL}/auth`;// Endpoint de Auth

export default class AuthService {
    
    // Iniciar Sesión
    static login(correo, clave) {
        return axios.post(`${API_URL}/login`, { correo, clave })
            .then(response => {
                if (response.data.token) {
                    // Normalizar: backend devuelve 'usuario'
                    const usuario = response.data.usuario;
                    
                    if (!usuario) {
                        console.error('No se recibió usuario del backend');
                        throw new Error('Respuesta incompleta del servidor');
                    }
                    // Guardar token y usuario
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(usuario));
                    
                    console.log('Login exitoso:', usuario.nombre, 'Tipo:', usuario.tipoUsuario_id);
                    return {
                        token: response.data.token,
                        usuario: usuario
                    };
                }
                throw new Error('No se recibió token');
            })
            .catch(error => {
                console.error('Error en login:', error);
                throw error;
            });
    }

    // Cerrar Sesión
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        console.log('Sesión cerrada');
    }

    // Obtener usuario actual (completo)
    static getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            if (!user || user === 'undefined') {
                return null;
            }
            return JSON.parse(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            localStorage.removeItem('user'); // Limpiar dato corrupto
            return null;
        }
    }


    // Obtener token
    static getToken() {
        return localStorage.getItem('token');
    }


    // Verificar si está autenticado
    static isAuthenticated() {
        return this.getToken() !== null && this.getCurrentUser() !== null;
    }


    // Verificar tipo de usuario
    static isAdmin() {
        return this.getCurrentUser()?.tipoUsuario_id === 1;
    }

    static isVendedor() {
        return this.getCurrentUser()?.tipoUsuario_id === 2;
    }

    static isCliente() {
        return this.getCurrentUser()?.tipoUsuario_id === 3;
    }

}