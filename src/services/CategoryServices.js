// src/services/CategoryService.js
import axios from 'axios';
import { BASE_URL } from './Connection';

// Definimos el endpoint específico para este servicio
const CATEGORIES_ENDPOINT = `${BASE_URL}/categorias`;

export default class CategoryServices {

    static getAllCategories() {
        return axios.get(CATEGORIES_ENDPOINT); 
    }

    static getCategoriesById(id) {
    return axios.get(`${CATEGORIES_ENDPOINT}/${id}`);
    }

    static createCategory(product) {
    return axios.post(CATEGORIES_ENDPOINT, product);
    }

    static updateCategory(id, product) {
    return axios.put(`${CATEGORIES_ENDPOINT}/${id}`, product);
    }

    static deleteCategory(id) {
    return axios.delete(`${CATEGORIES_ENDPOINT}/${id}`);
    }
}