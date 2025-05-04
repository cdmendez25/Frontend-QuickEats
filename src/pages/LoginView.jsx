import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginView() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === "pos") {
        navigate("/dashboard-pos");
      } else if (payload.role === "customer") {
        navigate("/dashboard-customer");
      } else {
        setError("Rol no reconocido.");
      }
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-box">
      <h1>Welcome!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Username"
          value={form.email}
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p><a href="#">Forgot your password?</a></p>
    </div>
  );
}