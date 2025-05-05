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
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        // Reemplazamos los datos simulados con una llamada real a la API
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
    setDish({
      ...dish,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Implementamos la llamada real a la API para actualizar el plato
      await dishService.update(id, dish);
      
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

          <label>Disponible</label>
          <select 
            name="available"
            value={dish.available ? "yes" : "no"} 
            onChange={(e) => setDish({...dish, available: e.target.value === "yes"})}
          >
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>

          {saveSuccess && <p className="success-message">¡Cambios guardados con éxito!</p>}

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