// src/services/PayMethServices.js
import api from './AxiosConfig'; 

const PAYMENT_METHOD_ENDPOINT = '/metodospago';

export default class PaymentMethodServices {

    static getAllPaymentMethods() {
        return api.get(PAYMENT_METHOD_ENDPOINT);
    }

    static getPaymentMethodById(id) {
        return api.get(`${PAYMENT_METHOD_ENDPOINT}/${id}`);
    }

    static createPaymentMethod(method) {
        return api.post(PAYMENT_METHOD_ENDPOINT, method);
    }

    static updatePaymentMethod(id, method) {
        return api.put(`${PAYMENT_METHOD_ENDPOINT}/${id}`, method);
    }

    static deletePaymentMethod(id) {
        return api.delete(`${PAYMENT_METHOD_ENDPOINT}/${id}`);
    }
}
