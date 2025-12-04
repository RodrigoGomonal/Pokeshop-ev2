import api from './AxiosConfig'; 

const COMMUNES_ENDPOINT = '/comunas';

export default class CommuneServices {

    static getAllCommunes() {
        return api.get(COMMUNES_ENDPOINT);  
    }

    static getCommunesById(id) {
        return api.get(`${COMMUNES_ENDPOINT}/${id}`);
    }

    static createCommune(commune) {
        return api.post(COMMUNES_ENDPOINT, commune);
    }

    static updateCommune(id, commune) {
        return api.put(`${COMMUNES_ENDPOINT}/${id}`, commune);
    }

    static deleteCommune(id) {
        return api.delete(`${COMMUNES_ENDPOINT}/${id}`);
    }
}