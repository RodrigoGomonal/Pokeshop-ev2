import axios from 'axios';
import { BASE_URL } from './Connection';

const INVOICE_DETAIL_ENDPOINT = `${BASE_URL}/boletaDetalle`;

export default class InvoiceDetailServices {

    static getAllInvoiceDetails() {
        return axios.get(INVOICE_DETAIL_ENDPOINT);
    }

    static getInvoiceDetailById(id) {
        return axios.get(`${INVOICE_DETAIL_ENDPOINT}/${id}`);
    }

    static createInvoiceDetail(detail) {
        return axios.post(INVOICE_DETAIL_ENDPOINT, detail);
    }

    static updateInvoiceDetail(id, detail) {
        return axios.put(`${INVOICE_DETAIL_ENDPOINT}/${id}`, detail);
    }

    static deleteInvoiceDetail(id) {
        return axios.delete(`${INVOICE_DETAIL_ENDPOINT}/${id}`);
    }
}
