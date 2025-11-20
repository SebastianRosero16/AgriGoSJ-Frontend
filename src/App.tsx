import React from 'react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import { ROUTES, USER_ROLES } from './utils/constants';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('./pages/public/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const FarmerDashboard = React.lazy(() => import('./pages/farmer/FarmerDashboard'));
const FarmerOverview = React.lazy(() => import('./pages/farmer/FarmerOverview'));
const FarmerCrops = React.lazy(() => import('./pages/farmer/FarmerCrops'));
const FarmerProducts = React.lazy(() => import('./pages/farmer/FarmerProducts'));
const FarmerAI = React.lazy(() => import('./pages/farmer/FarmerAI'));
const StoreDashboard = React.lazy(() => import('./pages/store/StoreDashboard'));
const StoreOverview = React.lazy(() => import('./pages/store/StoreOverview'));
const StoreInputs = React.lazy(() => import('./pages/store/StoreInputs'));
const BuyerDashboard = React.lazy(() => import('./pages/buyer/BuyerDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const MarketplacePage = React.lazy(() => import('./pages/public/MarketplacePage'));
const PriceComparatorPage = React.lazy(() => import('./pages/public/PriceComparatorPage'));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoute = getDashboardByRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
};

// Get dashboard route by role
function getDashboardByRole(role: string): string {
  switch (role) {
    case USER_ROLES.FARMER:
      return ROUTES.FARMER.DASHBOARD;
    case USER_ROLES.STORE:
      return ROUTES.STORE.DASHBOARD;
    case USER_ROLES.BUYER:
      return ROUTES.BUYER.DASHBOARD;
    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

// App Component
const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      {/* ThemeToggle removed from global layout (moved to headers if needed) */}
      <ErrorBoundary>
        <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            isAuthenticated ? (
              <Navigate to={user ? getDashboardByRole(user.role) : ROUTES.HOME} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            isAuthenticated ? (
              <Navigate to={user ? getDashboardByRole(user.role) : ROUTES.HOME} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route path={ROUTES.MARKETPLACE} element={<MarketplacePage />} />
        <Route path={ROUTES.PRICE_COMPARATOR} element={<PriceComparatorPage />} />

        {/* Farmer Routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.FARMER.DASHBOARD} replace />} />
          <Route path="dashboard" element={<FarmerOverview />} />
          <Route path="crops" element={<FarmerCrops />} />
          <Route path="products" element={<FarmerProducts />} />
          <Route path="ai" element={<FarmerAI />} />
        </Route>

        {/* Store Routes */}
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
              <StoreDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.STORE.DASHBOARD} replace />} />
          <Route path="dashboard" element={<StoreOverview />} />
          <Route path="inputs" element={<StoreInputs />} />
        </Route>

        {/* Buyer Routes */}
        <Route
          path={ROUTES.BUYER.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.BUYER]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN.DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Home Route */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated && user ? (
              <Navigate to={getDashboardByRole(user.role)} replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default App;
