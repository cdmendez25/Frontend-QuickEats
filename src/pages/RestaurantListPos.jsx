import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import styles from '../../styles/RestaurantListPos.module.css';

export default function RestaurantListPos() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAll();
        setRestaurants(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar restaurantes:', err);
        setError('No se pudieron cargar los restaurantes');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant-pos/${restaurantId}`);
  };

  if (loading) return <div className="restaurant-list-container">Cargando restaurantes...</div>;
  if (error) return <div className="restaurant-list-container">Error: {error}</div>;

  return (
     <div className={styles["restaurant-list-container"]}>
      <header className={styles["restaurant-list-header"]}>
        <h1>Restaurantes</h1>
        <div className={styles["header-actions"]}>
          <button 
            className={styles["order-history-button"]} 
            onClick={() => navigate('/order-history')}
          >
            Historial de Órdenes
          </button>
          <button 
            className={styles["logout-button"]} 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className={styles["restaurant-grid"]}>
        {restaurants.length > 0 ? (
          restaurants.map(restaurant => (
            <div 
              key={restaurant.id} 
              className={styles["restaurant-card"]}
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <div className={styles["restaurant-image"]}></div>
              <div className={styles["restaurant-info"]}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.cuisine}</p>
                <div className={styles["restaurant-rating"]}>
                  {Array(Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
                    <span key={i} className={styles["star"] + ' ' + styles["filled"]}>★</span>
                  ))}
                  {Array(5 - Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
                    <span key={i} className={styles["star"]}>☆</span>
                  ))}
                  <span className={styles["rating-value"]}>{restaurant.rating}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles["no-restaurants"]}>No hay restaurantes disponibles</p>
        )}
      </div>
    </div>
  );
}