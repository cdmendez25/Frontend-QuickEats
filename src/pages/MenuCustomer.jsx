import React, { useState, useEffect } from 'react';
import '../../styles/MenuCustomer.css';
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

  if (loading) return <div className="menu-customer-container">Cargando menú...</div>;
  if (error) return <div className="menu-customer-container">Error: {error}</div>;
  if (!restaurant) return <div className="menu-customer-container">No se encontró el restaurante</div>;

  return (
    <div className="menu-customer-container">
      <header className="menu-header">
        <h1>{restaurant.name}</h1>
        <p>⭐ {restaurant.rating} - {restaurant.cuisine}</p>
      </header>

      <div className="menu-list">
        {dishes.map((dish) => (
          <div key={dish.id} className="menu-card">
            <div className="menu-image"></div>
            <div className="menu-info">
              <strong>{dish.name}</strong>
              <p>{dish.description}</p>
              <p>${dish.price.toLocaleString()}</p>
            </div>
            <button 
              className="add-button" 
              onClick={() => navigate(`/dish/${dish.id}`)}
            >
              Ver detalle
            </button>
          </div>
        ))}
      </div>

      <footer className="menu-footer">
        <button className="back-button" onClick={() => navigate(-1)}>Volver ↩</button>
        <button className="cart-button" onClick={() => navigate('/cart')}>Carrito 🛒</button>
      </footer>
    </div>
  );
}