import axios from 'axios';
import { BASE_URL } from './Connection';

//const API_URL = 'http://TU-IP-PUBLICA-EC2:3000/auth'; 
const API_URL = `${BASE_URL}/auth`;// Endpoint de Auth

class AuthService {
    
    // Iniciar Sesión
    login(usuario, password) {
        return axios.post(API_URL + '/login', { usuario, password })
            .then(response => {
                if (response.data.token) {
                    // 💾 GUARDAR EL TOKEN EN EL NAVEGADOR
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            });
    }

    // Cerrar Sesión
    logout() {
        // 🗑️ ELIMINAR EL TOKEN
        localStorage.removeItem('token');
    }

    // Verificar si hay sesión activa
    getCurrentUser() {
        return localStorage.getItem('token');
    }
}

export default new AuthService();