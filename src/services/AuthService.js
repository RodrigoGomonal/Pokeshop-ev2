// src/services/AuthService.js
import axios from 'axios';
import { BASE_URL } from './Connection';

//const API_URL = 'http://TU-IP-PUBLICA-EC2:3000/auth'; 
const API_URL = `${BASE_URL}/auth`;// Endpoint de Auth

export default class AuthService {
    
    // Iniciar Sesión
    static login(correo, clave) { // ✅ Cambiado: correo y clave
        return axios.post(`${API_URL}/login`, { correo, clave })
            .then(response => {
                if (response.data.token) {
                    // Guardar token y usuario
                    localStorage.setItem('token', response.data.token);
                    const usuario = response.data.user || response.data.usuario;
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    return {
                        token: response.data.token,
                        usuario: usuario // ✅ Siempre devolver como "usuario"
                    };
                }
                return response.data;
            });
    }

    // Cerrar Sesión
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Obtener usuario actual (completo)
    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Obtener solo el token
    static getToken() {
        return localStorage.getItem('token');
    }

    // Verificar si está autenticado
    static isAuthenticated() {
        return this.getToken() !== null;
    }
}