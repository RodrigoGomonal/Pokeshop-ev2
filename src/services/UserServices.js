import axios from 'axios';

const IPv4 = '54.221.135.6';
const BASE_URL = `http://${IPv4}:3000/usuarios`;
class UserService {

    getAllUsers() {
        return axios.get(BASE_URL); 
    }

    getUsersById(id) {
    return axios.get(`${BASE_URL}/${id}`);
    }

    createUser(user) {
    return axios.post(BASE_URL, user);
    }

    updateUser(id, user) {
    return axios.put(`${BASE_URL}/${id}`, user);
    }

    deleteUser(id) {
    return axios.delete(`${BASE_URL}/${id}`);
    }
}