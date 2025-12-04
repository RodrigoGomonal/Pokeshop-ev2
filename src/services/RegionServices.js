import api from './AxiosConfig'; 

const REGIONS_ENDPOINT = '/regiones';

export default class Regionservices {

    static getAllRegions() {
        return api.get(REGIONS_ENDPOINT);  
    }

    static getRegionsById(id) {
        return api.get(`${REGIONS_ENDPOINT}/${id}`);
    }

    static createRegion(region) {
        return api.post(REGIONS_ENDPOINT, region);
    }

    static updateRegion(id, region) {
        return api.put(`${REGIONS_ENDPOINT}/${id}`, region);
    }

    static deleteRegion(id) {
        return api.delete(`${REGIONS_ENDPOINT}/${id}`);
    }
}