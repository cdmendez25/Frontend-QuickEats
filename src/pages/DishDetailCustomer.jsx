import React, { useState, useEffect } from 'react';
import '../../styles/DishDetailCustomer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { dishService, restaurantService } from '../services/api';

export default function DishDetailCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  // 🔔 Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const dishResponse = await dishService.getById(id);
        setDish(dishResponse.data);

        const restaurantsResponse = await restaurantService.getAll();
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
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
        } else {
          setError('No se pudo cargar la información del plato');
        }
        setLoading(false);
      }
    };

    fetchDishData();
  }, [id, navigate]);

  const handleAddToCart = () => {
    const msg = `${quantity} ${dish.name} agregado${quantity > 1 ? 's' : ''} al carrito`;
    setModalMessage(msg);
    setShowModal(true);
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
            max={dish.stock}
            value={quantity} 
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= dish.stock) {
                setQuantity(value);
                setQuantityError('');
              } else if (value > dish.stock) {
                setQuantity(dish.stock);
                setQuantityError(`Solo hay ${dish.stock} unidades disponibles`);
              } else {
                setQuantity(1);
                setQuantityError('');
              }
            }}
          />
          {quantityError && <p className="error-msg">{quantityError}</p>}

          <button 
            className="buy-button" 
            onClick={handleAddToCart}
            disabled={dish.stock === 0}
          >
            {dish.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
          <p><strong>Disponibles:</strong> {dish.stock}</p>
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}