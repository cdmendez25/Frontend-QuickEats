import React, { useState, useEffect } from 'react';
import '../../styles/OrderHistoryPos.css';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

export default function OrderHistoryPos() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Implementamos la llamada real a la API para obtener las órdenes
        const response = await orderService.getAll();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setError(`Error al cargar las órdenes: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      // Implementamos la llamada real a la API para cancelar una orden
      await orderService.cancel(orderId);
      
      // Actualizamos el estado local después de cancelar la orden
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, estado: 'Cancelado'} : order
      ));
    } catch (err) {
      console.error('Error al cancelar la orden:', err);
      setError(`Error al cancelar la orden: ${err.message || 'Error desconocido'}`);
    }
  };

  return (
    <div className="history-pos-container">
      <h2>Historial de Pedidos</h2>

      {loading ? (
        <p className="loading-message">Cargando pedidos...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <p><strong>Cliente:</strong> {order.cliente}</p>
              <p><strong>Total:</strong> {order.total}</p>
              <p><strong>Estado:</strong> {order.estado}</p>
              {order.estado !== 'Cancelado' && (
                <button 
                  className="cancel-button"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancelar Pedido
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}