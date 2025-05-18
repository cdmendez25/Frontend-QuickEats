import React, { useState, useEffect } from 'react';
import styles from '../../styles/MenuCustomer.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantService } from '../services/api';

export default function MenuCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantResponse = await restaurantService.getById(id);
        setRestaurant(restaurantResponse.data);
        setDishes(restaurantResponse.data.dishes || []);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del restaurante:', err);
        setError('No se pudo cargar la información del restaurante');
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (loading) return <div className={styles["menu-customer-container"]}>Cargando menú...</div>;
  if (error) return <div className={styles["menu-customer-container"]}>Error: {error}</div>;
  if (!restaurant) return <div className={styles["menu-customer-container"]}>No se encontró el restaurante</div>;

  return (
     <div className={styles["menu-customer-container"]}>
      <header className={styles["menu-header"]}>
        <h1>{restaurant.name}</h1>
        <p>⭐ {restaurant.rating} - {restaurant.cuisine}</p>
      </header>

      <div className={styles["menu-list"]}>
        {dishes.map((dish) => (
          <div key={dish.id} className={styles["menu-card"]}>
            <div className={styles["menu-image"]}></div>
            <div className={styles["menu-info"]}>
              <strong>{dish.name}</strong>
              <p>{dish.description}</p>
              <p>${dish.price.toLocaleString()}</p>
            </div>
            <button 
              className={styles["add-button"]} 
              onClick={() => navigate(`/dish/${dish.id}`)}
            >
              Ver detalle
            </button>
          </div>
        ))}
      </div>

      <footer className={styles["menu-footer"]}>
        <button className={styles["back-button"]} onClick={() => navigate(-1)}>Volver ↩</button>
        <button className={styles["cart-button"]} onClick={() => navigate('/cart')}>Carrito 🛒</button>
      </footer>
    </div>
  );
}