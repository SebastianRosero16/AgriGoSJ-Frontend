/**
 * Buyer Dashboard
 * Main dashboard for buyers
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { ShoppingCartIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const BuyerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

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
                Panel de Comprador - Bienvenido, {user?.fullName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
            <p className="text-gray-600 mt-1">Bienvenido a tu panel de compras</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link to={ROUTES.MARKETPLACE}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center py-8">
                  <div className="text-primary-600 mb-4">
                    <ShoppingCartIcon className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Explorar Marketplace
                  </h3>
                  <p className="text-gray-600">
                    Descubre productos agrícolas y agrotiendas
                  </p>
                </div>
              </Card>
            </Link>

            <Link to={ROUTES.PRICE_COMPARATOR}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center py-8">
                  <div className="text-green-700 mb-4">
                    <CurrencyDollarIcon className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Comparar Precios
                  </h3>
                  <p className="text-gray-600">
                    Encuentra los mejores precios del mercado
                  </p>
                </div>
              </Card>
            </Link>

            <Link to={ROUTES.SHOPPING_ASSISTANT}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center py-8">
                  <div className="text-purple-600 mb-4">
                    <SparklesIcon className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Asistente de Compras IA
                  </h3>
                  <p className="text-gray-600">
                    Busca productos con lenguaje natural
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
