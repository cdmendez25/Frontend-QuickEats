import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dishService, orderService, authService } from '../services/api';
import styles from '../../styles/DashboardPos.module.css';

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

  if (loading) return <div className={styles["dashboard-pos-container"]}>Cargando datos...</div>;
  if (error) return <div className={styles["dashboard-pos-container"]}>Error: {error}</div>;
  return (
      <div className={styles["dashboard-pos-container"]}>
      <header className={styles["dashboard-header"]}>
        <h1>Dashboard POS</h1>
        <button className={styles["logout-button"]} onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      <div className={styles["dashboard-sections"]}>
        <section className={styles["dishes-section"]}>
          <h2>Platos Disponibles</h2>
          <button className={styles["add-button"]} onClick={() => navigate('/dish-pos/new')}>Agregar Plato</button>

          <div className={styles["dishes-grid"]}>
            {dishes.length > 0 ? (
              dishes.map(dish => (
                <div 
                  key={dish.id} 
                  className={styles["dish-card"]}
                  onClick={() => navigate(`/dish-pos/${dish.id}`)}
                >
                  <div className={styles["dish-image-placeholder"]}></div>
                  <div className={styles["dish-info"]}>
                    <strong>{dish.name}</strong>
                    <p>${dish.price?.toLocaleString()}</p>
                    <p className={dish.available ? styles["available"] : styles["unavailable"]}>
                      {dish.available ? "Disponible" : "No disponible"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles["no-items"]}>No hay platos disponibles</p>
            )}
          </div>
        </section>

        <section className={styles["orders-section"]}>
          <h2>Órdenes Recientes</h2>
          <button className={styles["view-all-button"]} onClick={() => navigate('/order-history')}>Ver Historial</button>

          <div className={styles["orders-list"]}>
            {orders.length > 0 ? (
              orders.slice(0, 5).map(order => (
                <div key={order.id} className={styles["order-card"]}>
                  <p><strong>Cliente:</strong> {order.cliente}</p>
                  <p><strong>Total:</strong> ${order.total?.toLocaleString()}</p>
                  <p className={`${styles["status"]} ${styles[order.estado?.toLowerCase()]}`}>
                    <strong>Estado:</strong> {order.estado}
                  </p>
                </div>
              ))
            ) : (
              <p className={styles["no-items"]}>No hay órdenes recientes</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}