import React, { useEffect, useState } from 'react';
import styles from '../../styles/CartCustomer.module.css';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/api';

export default function CartCustomer() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getItems();
        setCartItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener carrito:', err);
        setError('Error al cargar el carrito');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className={styles["cart-container"]}>
      <h2>Carrito de Compras</h2>

      {loading ? (
        <p>Cargando carrito...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className={styles["cart-list"]}>
            {cartItems.map(item => (
              <div key={item.id} className={styles["cart-item"]}>
                <p><strong>{item.nombre}</strong></p>
                <p>Precio: ${item.precio.toLocaleString()}</p>
                <p>Cantidad: {item.cantidad}</p>
              </div>
            ))}
          </div>

          <div className={styles["cart-total"]}>
            <p><strong>Total:</strong> ${total.toLocaleString()}</p>
            <button className={styles["confirm-button"]}>Confirmar Pedido</button>
          </div>
        </>
      )}

      <button className={styles["back-button"]} onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}