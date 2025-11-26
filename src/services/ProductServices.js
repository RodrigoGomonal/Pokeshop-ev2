// src/services/ProductServices.js
import axios from 'axios';
import { BASE_URL } from './Connection';

// Definimos el endpoint específico para este servicio
const PRODUCTS_ENDPOINT = `${BASE_URL}/productos`;
export default class ProductServices {

    static getAllProducts() {
        return axios.get(PRODUCTS_ENDPOINT); 
    }

    static getProductsById(id) {
    return axios.get(`${PRODUCTS_ENDPOINT}/${id}`);
    }

    static createProduct(product) {
    return axios.post(PRODUCTS_ENDPOINT, product);
    }

    static updateProduct(id, product) {
    return axios.put(`${PRODUCTS_ENDPOINT}/${id}`, product);
    }

    static deleteProduct(id) {
    return axios.delete(`${PRODUCTS_ENDPOINT}/${id}`);
    }
}