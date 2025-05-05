import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/LoginView.css';

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
      const res = await axios.post("http://localhost:3001/auth/login", form);
      const { token } = res.data;
      
      // Decodificar el token para obtener el rol (puedes usar jwt-decode o simplemente almacenar el rol)
      // Para este ejemplo, extraemos el rol del backend
      const user = form.email === "admin@example.com" ? "pos" : "customer";
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", user);

      if (user === "customer") navigate("/dashboard-customer");
      else if (user === "pos") navigate("/dashboard-pos");
      else setError("Rol desconocido");
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Welcome!</h1>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className="password-container">
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
            className="toggle-password-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <button type="submit">Log in</button>
        {error && <p className="error-text">{error}</p>}
        <a href="#" className="forgot-password">Forgot your password?</a>
      </form>
    </div>
  );
}