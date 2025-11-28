import api from './AxiosConfig'; 

const INVOICE_ENDPOINT = '/boletas';

export default class InvoiceServices {

    static getAllInvoices() {
        return api.get(INVOICE_ENDPOINT);
    }

    static getInvoiceById(id) {
        return api.get(`${INVOICE_ENDPOINT}/${id}`);
    }

    static createInvoice(invoice) {
        return api.post(INVOICE_ENDPOINT, invoice);
    }

    static updateInvoice(id, invoice) {
        return api.put(`${INVOICE_ENDPOINT}/${id}`, invoice);
    }

    static deleteInvoice(id) {
        return api.delete(`${INVOICE_ENDPOINT}/${id}`);
    }
}
