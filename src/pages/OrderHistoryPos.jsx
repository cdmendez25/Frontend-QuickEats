import React from 'react';
import './OrderHistoryPos.css';
import { useNavigate } from 'react-router-dom';

export default function OrderHistoryPos() {
  const navigate = useNavigate();

  const orders = [
    { id: 1, cliente: 'Carlos Díaz', total: '$42.000', estado: 'Completado' },
    { id: 2, cliente: 'Laura Rojas', total: '$38.500', estado: 'Pendiente' },
    { id: 3, cliente: 'Isabella Pérez', total: '$27.000', estado: 'Cancelado' },
  ];

  return (
    <div className="history-pos-container">
      <h2>Historial de Pedidos</h2>

      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Cliente:</strong> {order.cliente}</p>
            <p><strong>Total:</strong> {order.total}</p>
            <p><strong>Estado:</strong> {order.estado}</p>
            <button className="cancel-button">Cancelar Pedido</button>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}