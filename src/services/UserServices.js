import axios from 'axios';
import { BASE_URL } from './Connection';

// Definimos el endpoint específico para este servicio
const USERS_ENDPOINT = `${BASE_URL}/usuarios`;
class UserServices {

    getAllUsers() {
        return axios.get(USERS_ENDPOINT); 
    }

    getUsersById(id) {
    return axios.get(`${USERS_ENDPOINT}/${id}`);
    }

    createUser(user) {
    return axios.post(USERS_ENDPOINT, user);
    }

    updateUser(id, user) {
    return axios.put(`${USERS_ENDPOINT}/${id}`, user);
    }

    deleteUser(id) {
    return axios.delete(`${USERS_ENDPOINT}/${id}`);
    }
}