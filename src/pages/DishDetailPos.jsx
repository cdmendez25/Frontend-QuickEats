import React from 'react';
import './DishDetailPos.css';
import { useNavigate } from 'react-router-dom';

export default function DishDetailPos() {
  const navigate = useNavigate();

  return (
    <div className="dish-pos-container">
      <div className="dish-image-pos"></div>

      <div className="dish-form-pos">
        <h2>Editar Plato</h2>

        <label>Nombre del Plato</label>
        <input type="text" defaultValue="Hamburguesa Clásica" />

        <label>Descripción</label>
        <textarea rows="3" defaultValue="Carne 100% res, queso cheddar y pan artesanal." />

        <label>Precio</label>
        <input type="number" defaultValue="25000" />

        <label>Disponible</label>
        <select>
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>

        <div className="form-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <button className="save-btn">Guardar</button>
        </div>
      </div>
    </div>
  );
}