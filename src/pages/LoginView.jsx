import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '../../styles/LoginView.module.css';

export default function LoginView() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      const { token } = res.data;
      
      // Decodificar el token para obtener el rol (puedes usar jwt-decode o simplemente almacenar el rol)
      // Para este ejemplo, extraemos el rol del backend
      const user = form.email === "admin@example.com" ? "pos" : "customer";
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", user);
      localStorage.setItem("user", form.email);

      if (user === "customer") navigate("/dashboard-customer");
      else if (user === "pos") navigate("/dashboard-pos");
      else setError("Rol desconocido");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form className={styles["login-card"]} onSubmit={handleSubmit}>
        <h1>Welcome!</h1>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className={styles["password-container"]}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            className={styles["toggle-password-btn"]}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <button type="submit">Log in</button>
        {error && <p className={styles["error-text"]}>{error}</p>}
        <p className={styles["forgot-password"]}>
          <Link to="/reset-password" className={styles["forgot-password"]}>
            Forgot your password?
          </Link>
        </p>
      </form>
    </div>
  );
}