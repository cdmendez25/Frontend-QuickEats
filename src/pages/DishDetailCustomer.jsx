import React from 'react';
import './DishDetailCustomer.css';
import { useNavigate } from 'react-router-dom';

export default function DishDetailCustomer() {
  const navigate = useNavigate();

  return (
    <div className="dish-detail-container">
      <div className="dish-image"></div>

      <div className="dish-info">
        <h2>Nombre del Plato</h2>
        <p>Descripción completa del plato con detalles del ingrediente.</p>
        <p><strong>Precio:</strong> $25.000</p>
        <p><strong>Restaurante:</strong> Nombre del Restaurante</p>

        <div className="dish-actions">
          <input type="number" min="1" defaultValue="1" />
          <button className="buy-button">Comprar</button>
        </div>

        <div className="dish-rating">
          <p>⭐⭐⭐⭐☆ (4.0)</p>
        </div>

        <div className="dish-comments">
          <h4>Comentarios</h4>
          <ul>
            <li>🍽️ “Muy rico y fresco”</li>
            <li>👍 “Buen sabor, repetiría”</li>
          </ul>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}