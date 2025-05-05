import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dishService, orderService, authService } from '../services/api';
import '../../styles/DashboardPos.css';

export default function DashboardPos() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener platos
        const dishesResponse = await dishService.getAll();
        setDishes(dishesResponse.data || []);
        
        // Obtener órdenes
        const ordersResponse = await orderService.getAll();
        setOrders(ordersResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(`Error al cargar datos: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <div className="dashboard-pos-container">Cargando datos...</div>;
  if (error) return <div className="dashboard-pos-container">Error: {error}</div>;

  return (
    <div className="dashboard-pos-container">
      <header className="dashboard-header">
        <h1>Dashboard POS</h1>
        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div className="dashboard-sections">
        <section className="dishes-section">
          <h2>Platos Disponibles</h2>
          <button className="add-button" onClick={() => navigate('/dish-pos/new')}>Agregar Plato</button>
          
          <div className="dishes-grid">
            {dishes.length > 0 ? (
              dishes.map(dish => (
                <div 
                  key={dish.id} 
                  className="dish-card"
                  onClick={() => navigate(`/dish-pos/${dish.id}`)}
                >
                  <div className="dish-image-placeholder"></div>
                  <div className="dish-info">
                    <strong>{dish.name}</strong>
                    <p>${dish.price?.toLocaleString()}</p>
                    <p className={dish.available ? "available" : "unavailable"}>
                      {dish.available ? "Disponible" : "No disponible"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No hay platos disponibles</p>
            )}
          </div>
        </section>

        <section className="orders-section">
          <h2>Órdenes Recientes</h2>
          <button className="view-all-button" onClick={() => navigate('/order-history')}>Ver Historial</button>
          
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.slice(0, 5).map(order => (
                <div key={order.id} className="order-card">
                  <p><strong>Cliente:</strong> {order.cliente}</p>
                  <p><strong>Total:</strong> ${order.total?.toLocaleString()}</p>
                  <p className={`status ${order.estado?.toLowerCase()}`}>
                    <strong>Estado:</strong> {order.estado}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-items">No hay órdenes recientes</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}