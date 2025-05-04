import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginView.css";

export default function LoginView() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/login", form);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "customer") navigate("/dashboard-customer");
      else if (role === "pos") navigate("/dashboard-pos");
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
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log in</button>
        {error && <p className="error-text">{error}</p>}
        <a href="#" className="forgot-password">Forgot your password?</a>
      </form>
    </div>
  );
}