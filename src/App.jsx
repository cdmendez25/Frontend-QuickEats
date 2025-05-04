import { Routes, Route } from 'react-router-dom';
import LoginView from './pages/LoginView';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />

      <Route element={<PrivateRoute allowedRole="pos" />}>
        <Route path="/dashboard-pos" element={<div>POS Dashboard</div>} />
      </Route>

      <Route element={<PrivateRoute allowedRole="customer" />}>
        <Route path="/dashboard-customer" element={<div>Customer Dashboard</div>} />
      </Route>
    </Routes>
  );
}

export default App;