/**
 * Farmer Dashboard
 * Main dashboard for farmers with crops management and AI recommendations
 */

import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useCart } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { CartDrawer } from '@/components/ui/CartDrawer';
import CartCheckoutModal from '@/components/payments/CartCheckoutModal';
import {
  ChartBarIcon,
  SparklesIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const FarmerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCheckoutOpen, setCartCheckoutOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-whatsapp-bg dark:text-gray-100">
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
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
                  to={ROUTES.FARMER.DASHBOARD}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.DASHBOARD)
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
                  to={ROUTES.FARMER.CROPS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.CROPS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-primary-600" />
                    <span>Mis Cultivos</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.FARMER.PRODUCTS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.PRODUCTS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
                    <span>Mis Productos</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.FARMER.AI_RECOMMENDATIONS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.AI_RECOMMENDATIONS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Cog6ToothIcon className="w-5 h-5 text-primary-600" />
                    <span>Recomendaciones IA</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.MARKETPLACE}
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5 text-primary-600" />
                    <span>Marketplace</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.FARMER.ORDERS}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(ROUTES.FARMER.ORDERS)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                    <span>Mis Órdenes</span>
                  </span>
                </Link>
                <Link
                  to={ROUTES.PRICE_COMPARATOR}
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-primary-600" />
                    <span>Comparar Precios</span>
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

      {/* Cart Drawer */}
      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCartCheckoutOpen(true);
        }}
      />
      
      {/* Cart Checkout Modal */}
      <CartCheckoutModal 
        open={cartCheckoutOpen}
        onClose={() => setCartCheckoutOpen(false)}
      />
    </div>
  );
};

export default FarmerDashboard;
