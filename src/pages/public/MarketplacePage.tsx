/**
 * Marketplace Public Page
 * Browse products from farmers and stores
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth } from '@/hooks';

export const MarketplacePage: React.FC = () => {
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
              <Link to={ROUTES.PRICE_COMPARATOR}>
                <Button variant="outline">Comparar Precios</Button>
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
          <h2 className="text-3xl font-bold text-gray-900">Marketplace Agrícola</h2>
          <p className="text-gray-600 mt-2">
            Explora productos agrícolas e insumos para el campo
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Todas las categorías</option>
              <option value="crops">Cultivos</option>
              <option value="inputs">Insumos</option>
            </select>
            <Button variant="primary" fullWidth>
              Buscar
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Empty State */}
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <div className="text-primary-600 mb-4">
                  <ShoppingCartIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-600">
                  Los productos aparecerán aquí cuando estén disponibles
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
