import axios from 'axios';
import { BASE_URL } from './Connection';

const PAYMENT_METHOD_ENDPOINT = `${BASE_URL}/metodosPago`;

export default class PaymentMethodServices {

    static getAllPaymentMethods() {
        return axios.get(PAYMENT_METHOD_ENDPOINT);
    }

    static getPaymentMethodById(id) {
        return axios.get(`${PAYMENT_METHOD_ENDPOINT}/${id}`);
    }

    static createPaymentMethod(method) {
        return axios.post(PAYMENT_METHOD_ENDPOINT, method);
    }

    static updatePaymentMethod(id, method) {
        return axios.put(`${PAYMENT_METHOD_ENDPOINT}/${id}`, method);
    }

    static deletePaymentMethod(id) {
        return axios.delete(`${PAYMENT_METHOD_ENDPOINT}/${id}`);
    }
}
