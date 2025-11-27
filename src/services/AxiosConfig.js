import axios from 'axios';
import { BASE_URL } from './Connection';

// 1. Crear una instancia de Axios
const api = axios.create({
    //baseURL: 'http://TU-IP-PUBLICA-EC2:3000'
    baseURL: BASE_URL 
});

// 2. Configurar el Interceptor
api.interceptors.request.use(
    (config) => {
        // Buscar el token en el almacenamiento local
        const token = localStorage.getItem('token');
        
        // Si existe, agregarlo al encabezado Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;