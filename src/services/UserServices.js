import axios from 'axios';
import { BASE_URL } from './Connection';

const USERS_ENDPOINT = `${BASE_URL}/usuarios`;
export default class UserServices {

    static getAllUsers() {
        return axios.get(USERS_ENDPOINT); 
    }

    static getUsersById(id) {
        return axios.get(`${USERS_ENDPOINT}/${id}`);
    }

    static createUser(user) {
        return axios.post(USERS_ENDPOINT, user);
    }

    static updateUser(id, user) {
        return axios.put(`${USERS_ENDPOINT}/${id}`, user);
    }

    static deleteUser(id) {
        return axios.delete(`${USERS_ENDPOINT}/${id}`);
    }

    /**
     * Busca un usuario por email
     * @param {string} email 
     */
    static getUserByEmail(email) {
        return axios.get(`${USERS_ENDPOINT}/email/${email}`);
    }

    /**
     * Login - Valida credenciales
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            // Opción 1: Si tu backend tiene endpoint de login
            // return axios.post(`${BASE_URL}/auth/login`, { email, password });
            
            // Opción 2: Validar manualmente
            const response = await this.getUserByEmail(email);
            const user = response.data;
            
            if (user && user.password === password) {
                return { data: user };
            } else {
                throw new Error("Credenciales inválidas");
            }
        } catch (error) {
            throw new Error("Error en login: " + error.message);
        }
    }
}