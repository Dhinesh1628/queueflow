import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import QueuesPage from './pages/QueuesPage';
import QueueDetailPage from './pages/QueueDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TokenHistoryPage from './pages/TokenHistoryPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import CookieBanner from './components/common/CookieBanner';
import BackToTop from './components/common/BackToTop';

// Dynamic Page Title & Meta Management
const PageTitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Operations Overview | QueueFlow',
      '/queues': 'Counter Queues | QueueFlow',
      '/analytics': 'Performance Analytics | QueueFlow',
      '/history': 'Token Audit History | QueueFlow',
      '/settings': 'System Settings | QueueFlow',
      '/login': 'Sign In | QueueFlow',
      '/register': 'Register Manager | QueueFlow',
      '/privacy': 'Privacy Policy | QueueFlow',
      '/terms': 'Terms of Service | QueueFlow',
      '/cookies': 'Cookie Policy | QueueFlow',
    };

    let title = titles[location.pathname];
    if (location.pathname.startsWith('/queues/')) {
      title = 'Queue Operations Console | QueueFlow';
    }
    document.title = title || 'QueueFlow | Enterprise Queue Platform';
  }, [location]);

  return null;
};

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Guard (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <PageTitleManager />
          <AuthProvider>
            <ToastProvider>
              <Routes>
                {/* Public Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />

                {/* Public Legal Compliance Routes */}
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiePolicyPage />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<OverviewPage />} />
                  <Route path="queues" element={<QueuesPage />} />
                  <Route path="queues/:id" element={<QueueDetailPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="history" element={<TokenHistoryPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback Custom 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              {/* GDPR Cookie Banner and Back to Top floating utilities */}
              <CookieBanner />
              <BackToTop />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
