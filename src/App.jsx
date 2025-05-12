import { Routes, Route } from "react-router-dom";
import LoginView from "./pages/LoginView";
import RestaurantListView from "./pages/RestaurantListView";
import MenuCustomer from "./pages/MenuCustomer";
import DishDetailCustomer from "./pages/DishDetailCustomer";
import CartCustomer from "./pages/CartCustomer";
import DishDetailPos from "./pages/DishDetailPos";
import OrderHistoryPos from "./pages/OrderHistoryPos";
import MenuPos from "./pages/MenuPos";
import PrivateRoute from "./routes/PrivateRoute";
import RestaurantListPos from "./pages/RestaurantListPos";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<PrivateRoute allowedRole="pos" />}>
        {/* Usa el componente que hayas decidido */}
        <Route path="/dashboard-pos" element={<RestaurantListPos />} />
        <Route path="/restaurant-pos/:id" element={<MenuPos />} />
        <Route path="/dish-pos/:id" element={<DishDetailPos />} />
        <Route path="/order-history" element={<OrderHistoryPos />} />
      </Route>

      <Route element={<PrivateRoute allowedRole="customer" />}>
        <Route path="/dashboard-customer" element={<RestaurantListView />} />
        <Route path="/restaurant/:id" element={<MenuCustomer />} />
        <Route path="/dish/:id" element={<DishDetailCustomer />} />
        <Route path="/cart" element={<CartCustomer />} />
      </Route>
    </Routes>
  );
}

export default App;