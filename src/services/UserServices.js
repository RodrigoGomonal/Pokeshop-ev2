import api from './AxiosConfig'; 

const USERS_ENDPOINT = '/usuarios';

export default class UserServices {

    static getAllUsers() {
        return api.get(USERS_ENDPOINT); 
    }

    static getUsersById(id) {
        return api.get(`${USERS_ENDPOINT}/${id}`);
    }

    static createUser(user) {
        return api.post(USERS_ENDPOINT, user);
    }

    static updateUser(id, user) {
        return api.put(`${USERS_ENDPOINT}/${id}`, user);
    }

    static deleteUser(id) {
        return api.delete(`${USERS_ENDPOINT}/${id}`);
    }

    static getUserByEmail(email) {
        return api.get(`${USERS_ENDPOINT}/email/${email}`);
    }
}