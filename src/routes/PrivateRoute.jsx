import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ allowedRole }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== allowedRole) {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/" />;
  }
}