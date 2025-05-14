import React, { useState, useEffect } from 'react';
import '../../styles/DishDetailPos.css';
import { useNavigate, useParams } from 'react-router-dom';
import { dishService } from '../services/api';

export default function DishDetailPos() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dish, setDish] = useState({
    name: '',
    description: '',
    price: 0,
    available: true,
    stock: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const response = await dishService.getById(id);
        setDish(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el plato:', err);
        setError(`Error al cargar los datos del plato: ${err.message || 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'price' || name === 'stock') {
      newValue = parseInt(newValue) || 0;
    }

    setDish({
      ...dish,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // ⚠️ Solo enviar los campos válidos esperados por el backend
      const payload = {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        stock: dish.stock,
        available: dish.available
      };

      console.log("Payload limpio enviado al backend:", payload);
      await dishService.update(id, payload);

      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar el plato:', err);
      setError(`Error al guardar los cambios: ${err.message || 'Error desconocido'}`);
      setSaving(false);
    }
  };

  if (loading) return <p className="loading-message">Cargando datos del plato...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dish-pos-container">
      <div className="dish-image-pos"></div>

      <div className="dish-form-pos">
        <h2>Editar Plato</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre del Plato</label>
          <input 
            type="text" 
            name="name"
            value={dish.name} 
            onChange={handleChange}
            required
          />

          <label>Descripción</label>
          <textarea 
            rows="3" 
            name="description"
            value={dish.description} 
            onChange={handleChange}
            required
          />

          <label>Precio</label>
          <input 
            type="number" 
            name="price"
            value={dish.price} 
            onChange={handleChange}
            required
          />

          <label>Cantidad disponible</label>
          <input 
            type="number" 
            name="stock"
            value={dish.stock} 
            onChange={handleChange}
            min="0"
            required
          />

          <label>Disponible</label>
          <select 
            name="available"
            value={dish.available ? "true" : "false"} 
            onChange={(e) => setDish({ ...dish, available: e.target.value === "true" })}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>

          {saveSuccess && <p className="success-message">¡Cambios guardados con éxito!</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}