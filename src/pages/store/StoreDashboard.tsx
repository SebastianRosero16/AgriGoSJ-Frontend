/**
 * Store Dashboard
 * Main dashboard for agricultural stores
 */

import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Card, ThemeToggle } from '@/components/ui';
import { ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const StoreDashboard: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1412] dark:text-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-[#0f1b17] dark:border-b dark:border-[#12221f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-600 dark:text-[#25D366]">
                {APP_INFO.NAME}
              </h1>
              <p className="text-sm text-gray-600">
                Panel de Agrotienda - Bienvenido, {user?.fullName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
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
                  to={ROUTES.STORE.DASHBOARD}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.STORE.DASHBOARD)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-primary-600" />
                    <span>Resumen</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.STORE.INPUTS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.STORE.INPUTS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-primary-600" />
                    <span>Mis Insumos</span>
                  </span>
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

export default StoreDashboard;
