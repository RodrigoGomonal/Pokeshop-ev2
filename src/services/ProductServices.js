// src/services/ProductServices.js
import api from './AxiosConfig'; 

const PRODUCTS_ENDPOINT = '/productos';

export default class ProductServices {

    static getAllProducts() {
        //return axios.get(PRODUCTS_ENDPOINT);
        return api.get(PRODUCTS_ENDPOINT);  
    }

    static getProductsById(id) {
        return api.get(`${PRODUCTS_ENDPOINT}/${id}`);
    }

    static getProductsByCategId(id) {
        return api.get(`${PRODUCTS_ENDPOINT}/relacionados/${id}`);
    }

    static createProduct(product) {
        return api.post(PRODUCTS_ENDPOINT, product);
    }

    static updateProduct(id, product) {
        return api.put(`${PRODUCTS_ENDPOINT}/${id}`, product);
    }

    static deleteProduct(id) {
        return api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
    }
}