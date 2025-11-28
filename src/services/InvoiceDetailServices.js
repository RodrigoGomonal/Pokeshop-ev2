import api from './AxiosConfig'; 

const INVOICE_DETAIL_ENDPOINT = '/boletadetalle';

export default class InvoiceDetailServices {

    static getAllInvoiceDetails() {
        return api.get(INVOICE_DETAIL_ENDPOINT);
    }

    static getInvoiceDetailById(id) {
        return api.get(`${INVOICE_DETAIL_ENDPOINT}/${id}`);
    }

    static createInvoiceDetail(detail) {
        return api.post(INVOICE_DETAIL_ENDPOINT, detail);
    }

    static updateInvoiceDetail(id, detail) {
        return api.put(`${INVOICE_DETAIL_ENDPOINT}/${id}`, detail);
    }

    static deleteInvoiceDetail(id) {
        return api.delete(`${INVOICE_DETAIL_ENDPOINT}/${id}`);
    }
}
