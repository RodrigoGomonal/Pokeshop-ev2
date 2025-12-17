import React from "react";

export default function InvoiceDetailModal({
  invoice,
  details,
  loading,
  products,
  onClose,
  getUserName,
  getPaymentMethodName,
  formatDate,
  getEstadoBadge
}) {

    // Obtener información del producto por ID
    const getProductInfo = (productId) => {
        const product = products.find(p => p.id === productId);
        return {
        name: product?.name || `Producto #${productId}`,
        image: product?.image || 'https://placehold.co/50x50/ccc/000?text=N/A'
        };
    };

    if (!invoice) return null;

    return (
    <div 
      className="modal fade" 
      id="ModalDetallesBoleta" 
      tabIndex="-1" 
      aria-labelledby="ModalDetallesBoletaLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="ModalDetallesBoletaLabel">
              <i className="bi bi-receipt me-2"></i>
              Detalle de Boleta {invoice.numero_boleta}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Información General de la Boleta */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h6 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Información General
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <p className="mb-2">
                      <strong>Nº Boleta:</strong>  {invoice.numero_boleta}
                    </p>
                    <p className="mb-2">
                      <strong>ID Boleta:</strong> {invoice.id}
                    </p>
                    <p className="mb-2">
                      <strong>Usuario:</strong> {getUserName(invoice.usuario_id)}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <strong>Fecha:</strong> {formatDate(invoice.fecha)}
                    </p>
                    <p className="mb-2">
                      <strong>Método de Pago:</strong>  {getPaymentMethodName(invoice.metodopago_id)}
                    </p>
                    <p className="mb-2">
                      <strong>Estado:</strong> 
                      <span className={`badge ${getEstadoBadge(invoice.estado)} ms-2`}>
                        {invoice.estado}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <strong>
                        <i className="bi bi-geo-alt me-1"></i>
                        Dirección de Envío:
                      </strong>
                    </p>
                    <p className="text-muted small bg-light p-2 rounded">
                      {invoice.direccion_envio || 'No especificada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Productos */}
            <h6 className="mb-3">
              <i className="bi bi-cart-check me-2"></i>
              Productos Comprados
            </h6>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Cargando detalles...</span>
                </div>
                <p className="text-muted mt-2">Cargando detalles...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '80px' }}>Imagen</th>
                      <th>Producto</th>
                      <th className="text-center" style={{ width: '100px' }}>Cantidad</th>
                      <th className="text-end" style={{ width: '120px' }}>Precio Unit.</th>
                      <th className="text-end" style={{ width: '120px' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.length > 0 ? (
                      details.map((detail, index) => {
                        const productInfo = getProductInfo(detail.producto_id);
                        const precioUnitario = Number(detail.precio_unitario) || 0;
                        const cantidad = Number(detail.cantidad) || 0;
                        const subtotal = Number(detail.subtotal) || (precioUnitario * cantidad);
                        
                        return (
                          <tr key={index}>
                            <td className="text-center">
                              <img 
                                src={productInfo.image} 
                                alt={productInfo.name}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = "https://placehold.co/50x50/ccc/000?text=N/A"; 
                                }}
                              />
                            </td>
                            <td>
                              <strong className="d-block">{productInfo.name}</strong>
                              <small className="text-muted">ID: {detail.producto_id}</small>
                            </td>
                            <td className="text-center">
                              {cantidad}
                            </td>
                            <td className="text-end">${precioUnitario.toLocaleString('es-CL')}</td>
                            <td className="text-end fw-bold text-primary">
                              ${subtotal.toLocaleString('es-CL')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-5">
                          <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary"></i>
                          <p className="mb-0">No hay detalles disponibles para esta boleta</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Resumen de Totales */}
            <div className="card bg-light mt-4 border-0 shadow-sm">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 offset-md-6">
                    <h6 className="mb-3 text-center">
                      Resumen de Compra
                    </h6>
                    
                    <div className="d-flex justify-content-between mb-2 pb-2">
                      <span className="text-muted">Subtotal:</span>
                      <span className="fw-bold">
                        ${Number(invoice.subtotal || 0).toLocaleString('es-CL')}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2 pb-2">
                      <span className="text-muted">IVA (19%):</span>
                      <span className="fw-bold">
                        ${Number(invoice.iva || 0).toLocaleString('es-CL')}
                      </span>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded">
                      <span className="fs-5 fw-bold">Total:</span>
                      <span className="fs-4 fw-bold text-danger">
                        ${Number(invoice.total || 0).toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer bg-light">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cerrar
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i>
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}