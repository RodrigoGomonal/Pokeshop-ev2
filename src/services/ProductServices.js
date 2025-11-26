import axios from 'axios';

const IPv4 = '54.221.135.6';
const BASE_URL = `http://${IPv4}:3000/productos`;
class ProductService {

    getAllProducts() {
        return axios.get(BASE_URL); 
    }

    getProductsById(id) {
    return axios.get(`${BASE_URL}/${id}`);
    }

    createProduct(product) {
    return axios.post(BASE_URL, product);
    }

    updateProduct(id, product) {
    return axios.put(`${BASE_URL}/${id}`, product);
    }

    deleteProduct(id) {
    return axios.delete(`${BASE_URL}/${id}`);
    }
}