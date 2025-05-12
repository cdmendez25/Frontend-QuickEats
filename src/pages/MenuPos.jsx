import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantService, dishService } from '../services/api';
import '../../styles/MenuPos.css';

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

  if (loading) return <div className="menu-container">Cargando menú...</div>;
  if (error) return <div className="menu-container">Error: {error}</div>;
  if (!restaurant) return <div className="menu-container">No se encontró el restaurante</div>;

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisine}</p>
        <div className="restaurant-rating">
          {Array(Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
            <span key={i} className="star filled">★</span>
          ))}
          {Array(5 - Math.floor(restaurant.rating || 0)).fill().map((_, i) => (
            <span key={i} className="star">☆</span>
          ))}
          <span className="rating-value">{restaurant.rating}</span>
        </div>
      </header>

      <div className="menu-actions">
        <button className="add-dish-button" onClick={handleAddDish}>
          Agregar Plato
        </button>
      </div>

      <div className="dishes-grid">
        {dishes.length > 0 ? (
          dishes.map(dish => (
            <div 
              key={dish.id} 
              className="dish-card"
              onClick={() => handleDishClick(dish.id)}
            >
              <div className="dish-image"></div>
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p className="dish-price">${dish.price?.toLocaleString()}</p>
                <p className={dish.available ? "available" : "unavailable"}>
                  {dish.available ? "Disponible" : "No disponible"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-dishes">No hay platos disponibles</p>
        )}
      </div>

      <button className="back-button" onClick={() => navigate('/dashboard-pos')}>
        ← Volver
      </button>
    </div>
  );
}