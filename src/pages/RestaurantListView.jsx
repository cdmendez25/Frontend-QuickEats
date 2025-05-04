import React from 'react';
import './RestaurantListView.css';
import { useNavigate } from 'react-router-dom';

export default function RestaurantListView() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="restaurant-container">
      <header className="restaurant-header">
        <button className="btn-back">←</button>
        <h1>Restaurantes</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout ↪</button>
      </header>

      <div className="restaurant-search">
        <input type="text" placeholder="Buscar..." />
      </div>

      <div className="restaurant-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="restaurant-card">
            <div className="image-placeholder"></div>
            <div className="info">
              <strong>Nombre</strong>
              <p>Calificación</p>
              <p>Tipo de comida</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}