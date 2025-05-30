import { useState } from "react";
import axios from "axios";
import styles from '../../styles/ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");  
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const EmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el correo de recuperación");
    }
  };

  const PasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { newPassword });
      setMessage("Contraseña actualizada exitosamente.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar contraseña");
    }
  };

  return (
    <div className={styles["forgot-container"]}>
      {step === 1 ? (
        <form onSubmit={EmailSubmit} className={styles["forgot-card"]}>
          <h2>Recover your password!</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
          {error && <p className={styles["error-text"]}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={PasswordSubmit} className={styles["forgot-card"]}>
          <h2>Establecer nueva contraseña</h2>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Actualizar</button>
          {error && <p className={styles["error-text"]}>{error}</p>}
          {message && <p className={styles["success-text"]}>{message}</p>}
        </form>
      )}
    </div>
  );
}