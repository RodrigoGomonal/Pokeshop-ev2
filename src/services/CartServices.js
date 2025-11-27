import axios from 'axios';
import { BASE_URL } from './Connection';


const CARRITO_ENDPOINT = `${BASE_URL}/carritos`;

export default class CartServices {

    static getAllCart() {
        return axios.get(CART_ENDPOINT);
    }

    static getCartById(id) {
        return axios.get(`${CART_ENDPOINT}/${id}`);
    }

    static createCart(cart) {
        return axios.post(CART_ENDPOINT, cart);
    }

    static updateCart(id, cart) {
        return axios.put(`${CART_ENDPOINT}/${id}`, cart);
    }

    static deleteCart(id) {
        return axios.delete(`${CART_ENDPOINT}/${id}`);
    }
}
