import React, { useState, useEffect } from 'react';
import '../../styles/DishDetailCustomer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { dishService, restaurantService } from '../services/api';

export default function DishDetailCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay token antes de hacer la solicitud
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token de autenticación');
          navigate('/');
          return;
        }
        
        // Usamos dishService en lugar de axios directamente
        const dishResponse = await dishService.getById(id);
        setDish(dishResponse.data);
        
        // Usamos restaurantService en lugar de axios directamente
        const restaurantsResponse = await restaurantService.getAll();
        
        // Buscamos en cada restaurante si contiene este plato
        let foundRestaurant = null;
        for (const rest of restaurantsResponse.data) {
          const fullRestaurantData = await restaurantService.getById(rest.id);
          const dishExists = fullRestaurantData.data.dishes.some(d => d.id === parseInt(id));
          if (dishExists) {
            foundRestaurant = fullRestaurantData.data;
            break;
          }
        }
        
        setRestaurant(foundRestaurant);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del plato:', err);
        
        // Verificar si el error es de autenticación (401)
        if (err.response && err.response.status === 401) {
          console.error('Error de autenticación, redirigiendo al login');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
          return;
        }
        
        setError('No se pudo cargar la información del plato');
        setLoading(false);
      }
    };

    fetchDishData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    // Aquí implementarías la lógica para agregar al carrito
    // Por ahora solo mostraremos un mensaje en consola
    console.log(`Agregando ${quantity} ${dish.name} al carrito`);
    alert(`Se agregaron ${quantity} ${dish.name} al carrito`);
  };

  if (loading) return <div className="dish-detail-container">Cargando detalles del plato...</div>;
  if (error) return <div className="dish-detail-container">Error: {error}</div>;
  if (!dish) return <div className="dish-detail-container">No se encontró el plato</div>;

  return (
    <div className="dish-detail-container">
      <div className="dish-image"></div>

      <div className="dish-info">
        <h2>{dish.name}</h2>
        <p>{dish.description}</p>
        <p><strong>Precio:</strong> ${dish.price.toLocaleString()}</p>
        <p><strong>Restaurante:</strong> {restaurant ? restaurant.name : 'Cargando...'}</p>

        <div className="dish-actions">
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))} 
          />
          <button className="buy-button" onClick={handleAddToCart}>Agregar al carrito</button>
        </div>

        <div className="dish-rating">
          <p>⭐⭐⭐⭐☆ (4.0)</p>
        </div>

        <div className="dish-comments">
          <h4>Comentarios</h4>
          <ul>
            <li>🍽️ "Muy rico y fresco"</li>
            <li>👍 "Buen sabor, repetiría"</li>
          </ul>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}