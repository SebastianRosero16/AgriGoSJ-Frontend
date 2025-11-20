/**
 * Price Comparator Public Page
 * Compare prices across different stores
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { CurrencyDollarIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth } from '@/hooks';

export const PriceComparatorPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to={ROUTES.HOME}>
              <h1 className="text-2xl font-bold text-primary-600">
                {APP_INFO.NAME}
              </h1>
            </Link>
            <div className="flex gap-4">
              <Link to={ROUTES.MARKETPLACE}>
                <Button variant="outline">Marketplace</Button>
              </Link>
              {isAuthenticated && user ? (
                <Link to={ROUTES.HOME}>
                  <Button variant="primary">Mi Panel</Button>
                </Link>
              ) : (
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary">Iniciar Sesión</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Comparador de Precios</h2>
          <p className="text-gray-600 mt-2">
            Encuentra los mejores precios para tus productos agrícolas
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar producto para comparar..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button variant="primary" className="md:w-auto">
              Comparar Precios
            </Button>
          </div>
        </Card>

        {/* Comparison Results */}
        <div className="space-y-6">
          {/* Empty State */}
          <Card>
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Busca un producto para comparar
              </h3>
              <p className="text-gray-600">
                Ingresa el nombre de un producto para ver las mejores ofertas
              </p>
            </div>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <div className="text-center">
              <div className="text-primary-600 mb-3">
                <ChartBarIcon className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Comparación Inteligente
              </h4>
              <p className="text-sm text-gray-600">
                Algoritmos avanzados encuentran los mejores precios
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-green-700 mb-3">
                <CurrencyDollarIcon className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Ahorra Dinero</h4>
              <p className="text-sm text-gray-600">
                Compara precios de múltiples vendedores
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-yellow-500 mb-3">
                <SparklesIcon className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Rápido y Fácil</h4>
              <p className="text-sm text-gray-600">
                Resultados instantáneos con un solo clic
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PriceComparatorPage;
