import axios from 'axios';
import { BASE_URL } from './Connection';

const INVOICE_ENDPOINT = `${BASE_URL}/boletas`;

export default class InvoiceServices {

    static getAllInvoices() {
        return axios.get(INVOICE_ENDPOINT);
    }

    static getInvoiceById(id) {
        return axios.get(`${INVOICE_ENDPOINT}/${id}`);
    }

    static createInvoice(invoice) {
        return axios.post(INVOICE_ENDPOINT, invoice);
    }

    static updateInvoice(id, invoice) {
        return axios.put(`${INVOICE_ENDPOINT}/${id}`, invoice);
    }

    static deleteInvoice(id) {
        return axios.delete(`${INVOICE_ENDPOINT}/${id}`);
    }
}
