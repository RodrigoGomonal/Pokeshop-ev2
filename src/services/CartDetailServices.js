import axios from 'axios';
import { BASE_URL } from './Connection';

const CARRITO_DETALLE_ENDPOINT = `${BASE_URL}/carritoDetalle`;

export default class CartDetailServices {

    static getAllCartDetails() {
        return axios.get(CART_DETAIL_ENDPOINT);
    }

    static getCartDetailById(id) {
        return axios.get(`${CART_DETAIL_ENDPOINT}/${id}`);
    }

    static createCartDetail(detail) {
        return axios.post(CART_DETAIL_ENDPOINT, detail);
    }

    static updateCartDetail(id, detail) {
        return axios.put(`${CART_DETAIL_ENDPOINT}/${id}`, detail);
    }

    static deleteCartDetail(id) {
        return axios.delete(`${CART_DETAIL_ENDPOINT}/${id}`);
    }
}
