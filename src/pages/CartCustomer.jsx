import React from 'react';
import styles from '../../styles/CartCustomer.module.css';
import { useNavigate } from 'react-router-dom';

export default function CartCustomer() {
  const navigate = useNavigate();

  const cartItems = [
    { id: 1, nombre: 'Pizza Margarita', precio: 20000, cantidad: 2 },
    { id: 2, nombre: 'Ensalada César', precio: 15000, cantidad: 1 },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
   <div className={styles["cart-container"]}>
      <h2>Carrito de Compras</h2>

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

      <button className={styles["back-button"]} onClick={() => navigate(-1)}>← Volver</button>
    </div>
  );
}