import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { DriverManagement } from './pages/drivers/DriverManagement';
import { OrderManagement } from './pages/orders/OrderManagement';
import { CustomerManagement } from './pages/customers/CustomerManagement';
import { PaymentManagement } from './pages/payments/PaymentManagement';
import { WalletManagement } from './pages/wallets/WalletManagement';
import { ZoneManagement } from './pages/zones/ZoneManagement';
import { SettingsManagement } from './pages/settings/SettingsManagement';
import { useAuthStore } from './store/useAuthStore';
import { ThemeProvider } from './contexts/ThemeContext';

import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Placeholder components for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="glass-panel p-8 min-h-[400px]">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <p className="text-text-secondary">This module is currently under construction. It will interface with the Smart Dispatch backend.</p>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-bg-primary text-text-primary">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="wallets" element={<WalletManagement />} />
            <Route path="zones" element={<ZoneManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
