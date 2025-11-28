import api from './AxiosConfig'; 


const CART_ENDPOINT = '/carritos';

export default class CartServices {

    static getAllCart() {
        return api.get(CART_ENDPOINT);
    }

    static getCartById(id) {
        return api.get(`${CART_ENDPOINT}/${id}`);
    }

    static createCart(cart) {
        return api.post(CART_ENDPOINT, cart);
    }

    static updateCart(id, cart) {
        return api.put(`${CART_ENDPOINT}/${id}`, cart);
    }

    static deleteCart(id) {
        return api.delete(`${CART_ENDPOINT}/${id}`);
    }
}
