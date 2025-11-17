/**
 * Farmer Dashboard
 * Main dashboard for farmers with crops management and AI recommendations
 */

import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const FarmerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">
                {APP_INFO.NAME}
              </h1>
              <p className="text-sm text-gray-600">
                Panel de Agricultor - Bienvenido, {user?.fullName}
              </p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card>
              <nav className="space-y-2">
                <Link
                  to={ROUTES.FARMER.DASHBOARD}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.DASHBOARD)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📊 Resumen
                </Link>
                <Link
                  to={ROUTES.FARMER.CROPS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.CROPS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🌾 Mis Cultivos
                </Link>
                <Link
                  to={ROUTES.FARMER.PRODUCTS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.PRODUCTS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 Mis Productos
                </Link>
                <Link
                  to={ROUTES.FARMER.AI_RECOMMENDATIONS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.AI_RECOMMENDATIONS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🤖 Recomendaciones IA
                </Link>
                <Link
                  to={ROUTES.MARKETPLACE}
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  🛒 Marketplace
                </Link>
                <Link
                  to={ROUTES.PRICE_COMPARATOR}
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  💰 Comparar Precios
                </Link>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
