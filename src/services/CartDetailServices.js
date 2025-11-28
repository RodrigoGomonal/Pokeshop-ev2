import api from './AxiosConfig'; 

const CART_DETAIL_ENDPOINT = '/carritoDetalle';

export default class CartDetailServices {

    static getAllCartDetails() {
        return api.get(CART_DETAIL_ENDPOINT);
    }

    static getCartDetailById(id) {
        return api.get(`${CART_DETAIL_ENDPOINT}/${id}`);
    }

    static createCartDetail(detail) {
        return api.post(CART_DETAIL_ENDPOINT, detail);
    }

    static updateCartDetail(id, detail) {
        return api.put(`${CART_DETAIL_ENDPOINT}/${id}`, detail);
    }

    static deleteCartDetail(id) {
        return api.delete(`${CART_DETAIL_ENDPOINT}/${id}`);
    }
}
