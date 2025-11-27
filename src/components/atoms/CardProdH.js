import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";

export default function CardProdtH({ producto }) {
  if (!producto.active || producto.stock_actual === 0) return null;
  
  return (
    <motion.div
      className="col"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <a 
        href={`/DetalleProducto/${producto.id}`}
        className="text-decoration-none"
        style={{ textDecoration: 'none' }}
      >
        <Card 
          className="h-100 overflow-hidden border-0"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }}
        >
          {/* Card Header - Imagen con fondo gris ligero */}
          <Card.Header 
            className="border-0 position-relative p-3"
            style={{ 
              backgroundColor: '#f8f9fa',
              height: '160px'
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-center h-100"
            >
              <motion.img
                src={producto.image}
                alt={producto.name}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </Card.Header>
          
          {/* Card Body - Contenido con fondo blanco */}
          <Card.Body 
            className="d-flex flex-column bg-white p-3"
          >
            {/* Nombre del producto */}
            <Card.Title 
              className="fw-bold mb-2"
              style={{
                fontSize: '0.9rem',
                color: '#111827',
                lineHeight: '1.3',
                minHeight: '2.6rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {producto.name}
            </Card.Title>
            
            {/* Precio y stock en línea */}
            <div 
              className="d-flex align-items-center justify-content-between mt-auto"
            >
              <p 
                className="fw-bold mb-0"
                style={{
                  fontSize: '1.125rem',
                  color: '#111827'
                }}
              >
                ${producto.price.toLocaleString()}
              </p>
              
              <div className="d-flex align-items-center gap-2">
                <div 
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: producto.stock_actual > producto.stock_critico ? '#10b981' : '#ea0808'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {producto.stock_actual}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </a>
    </motion.div>
  );
}
