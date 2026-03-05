import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContentStudioPage from './pages/ContentStudioPage';
import CampaignsPage from './pages/CampaignsPage';
import SchedulerPage from './pages/SchedulerPage';
import EmailPage from './pages/EmailPage';
import ABTestPage from './pages/ABTestPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="content-studio" element={<ContentStudioPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="scheduler" element={<SchedulerPage />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="ab-testing" element={<ABTestPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
