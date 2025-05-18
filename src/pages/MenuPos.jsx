import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantService, dishService } from '../services/api';
import styles from '../../styles/MenuPos.module.css';

export default function MenuPos() {
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

        // 1. Obtener el restaurante
        const restaurantResponse = await restaurantService.getById(id);
        const restaurantData = restaurantResponse.data;
        setRestaurant(restaurantData);

        // 2. Obtener platos por sus IDs
        const dishIds = restaurantData.dishIds || [];
        const dishPromises = dishIds.map(dishId => dishService.getById(dishId));
        const dishResponses = await Promise.all(dishPromises);
        const allDishes = dishResponses.map(res => res.data);
        setDishes(allDishes);

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del restaurante o platos:', err);
        setError('No se pudo cargar la información del restaurante');
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleDishClick = (dishId) => {
    navigate(`/dish-pos/${dishId}`);
  };

  const handleAddDish = () => {
    navigate(`/dish-pos/new?restaurantId=${id}`);
  };

  if (loading) return <div className={styles["menu-container"]}>Cargando menú...</div>;
  if (error) return <div className={styles["menu-container"]}>Error: {error}</div>;
  if (!restaurant) return <div className={styles["menu-container"]}>No se encontró el restaurante</div>;

  return (
    <div className={styles["menu-container"]}>
      <header className={styles["menu-header"]}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisine}</p>
        <div className={styles["restaurant-rating"]}>
          {Array(Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
            <span key={i} className={`${styles["star"]} ${styles["filled"]}`}>★</span>
          ))}
          {Array(5 - Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
            <span key={i} className={styles["star"]}>☆</span>
          ))}
          <span className={styles["rating-value"]}>{restaurant.rating}</span>
        </div>
      </header>

      <div className={styles["menu-actions"]}>
        <button className={styles["add-dish-button"]} onClick={handleAddDish}>
          Agregar Plato
        </button>
      </div>

      <div className={styles["dishes-grid"]}>
        {dishes.length > 0 ? (
          dishes.map(dish => (
            <div 
              key={dish.id} 
              className={styles["dish-card"]}
              onClick={() => handleDishClick(dish.id)}
            >
              <div className={styles["dish-image"]}></div>
              <div className={styles["dish-info"]}>
                <h3>{dish.name}</h3>
                <p className={styles["dish-price"]}>${dish.price?.toLocaleString()}</p>
                <p className={dish.available ? styles["available"] : styles["unavailable"]}>
                  {dish.available ? "Disponible" : "No disponible"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles["no-dishes"]}>No hay platos disponibles</p>
        )}
      </div>

      <button className={styles["back-button"]} onClick={() => navigate('/dashboard-pos')}>
        ← Volver
      </button>
    </div>
  );
}