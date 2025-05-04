import React from 'react';
import './MenuCustomer.css';
import { useNavigate } from 'react-router-dom';

export default function MenuCustomer() {
  const navigate = useNavigate();

  return (
    <div className="menu-customer-container">
      <header className="menu-header">
        <h1>Nombre del restaurante</h1>
        <p>Calificación del restaurante</p>
      </header>

      <div className="menu-list">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="menu-card">
            <div className="menu-image"></div>
            <div className="menu-info">
              <strong>Nombre del producto</strong>
              <p>Breve Descripción</p>
              <p>Precio</p>
            </div>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>

      <footer className="menu-footer">
        <button className="back-button" onClick={() => navigate(-1)}>Back ↩</button>
        <button className="cart-button" onClick={() => navigate('/cart')}>Pay 🛒</button>
      </footer>
    </div>
  );
}