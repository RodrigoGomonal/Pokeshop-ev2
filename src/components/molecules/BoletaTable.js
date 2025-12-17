import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import SearchInput from "../atoms/SearchInput";
import DetBoletaModal from "./DetBoletaModal";
import InvoiceServices from "../../services/InvoiceServices";
import InvoiceDetailServices from "../../services/InvoiceDetailServices";
import ProductServices from "../../services/ProductServices";
import UserServices from "../../services/UserServices";
import PaymentMethodServices from "../../services/PayMethServices";
import '../../App.css';

export default function InvoiceTable() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  
  const invoicesPerPag = 10;

  // Cargar datos al iniciar
  useEffect(() => {
    fetchInvoices();
    fetchProducts();
    fetchUsers();
    fetchPaymentMethods();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await InvoiceServices.getAllInvoices();
      setInvoices(response.data);
      setError(null);
    } catch (err) {
      console.error("Error cargando boletas:", err);
      setError("Error al cargar las boletas");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await ProductServices.getAllProducts();
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserServices.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await PaymentMethodServices.getAllPaymentMethods();
      setPaymentMethods(response.data || []);
    } catch (err) {
      console.error("Error cargando métodos de pago:", err);
    }
  };

  // Obtener nombre del usuario por ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.nombre || `Usuario #${userId}`;
  };

  // Obtener nombre del método de pago por ID
  const getPaymentMethodName = (paymentId) => {
    const method = paymentMethods.find(m => m.id === paymentId);
    return method?.name || `Método #${paymentId}`;
  };

  // Obtener detalles de una boleta específica
  const fetchInvoiceDetails = async (boletaId) => {
    try {
      setLoadingDetails(true);
      
      // Usar el endpoint específico que retorna todos los detalles de una boleta
      const response = await InvoiceDetailServices.getInvoiceById(boletaId);
      
      // La respuesta ya debería ser un array con todos los productos
      const details = Array.isArray(response.data) ? response.data : [response.data];
      
      console.log('Detalles obtenidos para boleta', boletaId, ':', details);
      setInvoiceDetails(details);
    } catch (err) {
      console.error("Error cargando detalles:", err);
      setInvoiceDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Abrir modal de detalles
  const handleOpenDetails = async (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetails([]);
    await fetchInvoiceDetails(invoice.id);
    const modal = new Modal(document.getElementById("ModalDetallesBoleta"));
    modal.show();
  };

  // Cerrar modal
  const closeModal = () => {
    const modalEl = document.getElementById("ModalDetallesBoleta");
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.removeAttribute('aria-modal');
      }, 150);
    }
  };

  // Filtro de búsqueda
  const filtradas = invoices.filter(invoice => {
    const searchLower = search.toLowerCase();
    const coincideId = String(invoice.id).includes(search);
    const coincideNumeroBoleta = invoice.numero_boleta && invoice.numero_boleta.toLowerCase().includes(searchLower);
    const coincideUsuario = getUserName(invoice.usuario_id).toLowerCase().includes(searchLower);
    const coincideFecha = invoice.fecha && invoice.fecha.includes(search);
    const coincideEstado = invoice.estado && invoice.estado.toLowerCase().includes(searchLower);
    return coincideId || coincideNumeroBoleta || coincideUsuario || coincideFecha || coincideEstado;
  });

  // Paginación
  const totalPaginas = Math.ceil(filtradas.length / invoicesPerPag);
  const boletasPaginadas = filtradas.slice((pagina - 1) * invoicesPerPag, pagina * invoicesPerPag);
  
  const siguiente = () => { if (pagina < totalPaginas) setPagina(pagina + 1); };
  const anterior = () => { if (pagina > 1) setPagina(pagina - 1); };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener clase de badge según estado
  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
      case 'pagada':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'cancelada':
      case 'anulada':
        return 'bg-danger';
      case 'en proceso':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="adminTitle">Gestión de Boletas</h2>
        <SearchInput 
          placeholder="Buscar por Nº Boleta, Usuario o Estado" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Nº Boleta</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Método de Pago</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {boletasPaginadas.map((invoice) => {
              const subtotal = Number(invoice.subtotal) || 0;
              const iva = Number(invoice.iva) || 0;
              const total = Number(invoice.total) || 0;
              
              return (
                <tr key={invoice.id}>
                  <td className="fw-bold">{invoice.id}</td>
                  <td>
                      {invoice.numero_boleta}
                  </td>
                  <td>
                      {getUserName(invoice.usuario_id)}
                  </td>
                  <td>{formatDate(invoice.fecha)}</td>
                  <td>
                      {getPaymentMethodName(invoice.metodopago_id)}
                  </td>
                  <td className="text-end">
                    ${subtotal.toLocaleString('es-CL')}
                  </td>
                  <td className="text-end">
                    ${iva.toLocaleString('es-CL')}
                  </td>
                  <td className="text-end text-danger fw-bold">
                    ${total.toLocaleString('es-CL')}
                  </td>
                  <td>
                    <span className={`badge ${getEstadoBadge(invoice.estado)}`}>
                      {invoice.estado || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleOpenDetails(invoice)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              );
            })}
            {boletasPaginadas.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No se encontraron boletas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button 
              className="btn btn-outline-primary" 
              disabled={pagina === 1} 
              onClick={anterior}
            >
              <i className="bi bi-arrow-left"></i> Anterior
            </button>
          </li>
          <li className="page-item ms-3">
            <button 
              className="btn btn-primary" 
              disabled={pagina === totalPaginas} 
              onClick={siguiente}
            >
              Siguiente <i className="bi bi-arrow-right"></i>
            </button>
          </li>
        </ul>
        <p className="text-center text-muted">
          Página {pagina} de {totalPaginas || 1}
        </p>
      </nav>

      {/* Modal de Detalles - Componente Separado */}
      <DetBoletaModal
        invoice={selectedInvoice}
        details={invoiceDetails}
        loading={loadingDetails}
        products={products}
        users={users}
        paymentMethods={paymentMethods}
        onClose={closeModal}
        getUserName={getUserName}
        getPaymentMethodName={getPaymentMethodName}
        formatDate={formatDate}
        getEstadoBadge={getEstadoBadge}
      />
    </>
  );
}