import api from './AxiosConfig'; 

const USERTYPES_ENDPOINT = '/tipousuarios';

export default class UserTypeServices {

    static getAllUserTypes() {
        return api.get(USERTYPES_ENDPOINT);  
    }

    static getUserTypesById(id) {
        return api.get(`${USERTYPES_ENDPOINT}/${id}`);
    }

    static createUserType(userType) {
        return api.post(USERTYPES_ENDPOINT, userType);
    }

    static updateUserType(id, userType) {
        return api.put(`${USERTYPES_ENDPOINT}/${id}`, userType);
    }

    static deleteUserType(id) {
        return api.delete(`${USERTYPES_ENDPOINT}/${id}`);
    }
}