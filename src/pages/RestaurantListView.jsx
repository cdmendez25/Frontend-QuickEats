import React, { useState, useEffect } from 'react';
import styles from '../../styles/RestaurantListView.module.css';
import { useNavigate } from 'react-router-dom';
import { restaurantService, authService } from '../services/api';

export default function RestaurantListView() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAll();
        console.log('Datos recibidos:', response.data); // Para depuración
        
        if (Array.isArray(response.data)) {
          setRestaurants(response.data);
        } else {
          console.error('Formato de datos inesperado:', response.data);
          setError('Formato de datos inesperado del servidor');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar restaurantes:', err);
        setError(`Error al cargar restaurantes: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles["restaurant-container"]}>
      <header className={styles["restaurant-header"]}>
        <button className={styles["btn-back"]} onClick={() => navigate(-1)}>←</button>
        <h1>Restaurantes</h1>
        <button className={styles["btn-logout"]} onClick={handleLogout}>Logout ↪</button>
      </header>

      <div className={styles["restaurant-search"]}>
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className={styles["loading-message"]}>Cargando restaurantes...</p>
      ) : error ? (
        <p className={styles["error-message"]}>{error}</p>
      ) : (
        <div className={styles["restaurant-grid"]}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className={styles["restaurant-card"]}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className={styles["image-placeholder"]}></div>
                <div className={styles["info"]}>
                  <strong>{restaurant.name || 'Restaurante sin nombre'}</strong>
                  <p>{restaurant.rating || 'Sin calificación'} ⭐</p>
                  <p>{restaurant.cuisine || 'Tipo de cocina no especificado'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles["no-results"]}>No se encontraron restaurantes</p>
          )}
        </div>
      )}
    </div>
  );
}