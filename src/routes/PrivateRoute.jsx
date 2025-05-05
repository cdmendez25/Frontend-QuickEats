import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token);
  console.log("Role:", role);
  console.log("Allowed Role:", allowedRole);

  if (!token) {
    // Si no hay token, redirige al login
    console.log("No hay token, redirigiendo al login");
    return <Navigate to="/" />;
  }

  if (role !== allowedRole) {
    // Si hay token pero el rol no es permitido, redirige al login también
    console.log("Rol no permitido, redirigiendo al login");
    return <Navigate to="/" />;
  }

  // Si todo está bien, renderiza la ruta protegida
  console.log("Autenticación exitosa, renderizando ruta protegida");
  return <Outlet />;
}