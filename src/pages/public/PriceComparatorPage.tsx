/**
 * Price Comparator Public Page
 * Compare prices across different stores
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Loading } from '@/components/ui';
import { CurrencyDollarIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth } from '@/hooks';
import { storeService } from '@/api';
import { formatCurrencyInteger } from '@/utils/format';

export const PriceComparatorPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [allInputs, setAllInputs] = useState<any[]>([]);
  const [filteredInputs, setFilteredInputs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadInputs();
  }, []);

  const loadInputs = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getInputsPublic();
      setAllInputs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar insumos:', err);
      setAllInputs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setFilteredInputs(allInputs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allInputs.filter(input => 
      input.name?.toLowerCase().includes(query) ||
      input.type?.toLowerCase().includes(query) ||
      input.description?.toLowerCase().includes(query)
    );
    setFilteredInputs(results);
  };

  const groupByProduct = (inputs: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    inputs.forEach(input => {
      const productName = input.name || 'Sin nombre';
      if (!grouped[productName]) {
        grouped[productName] = [];
      }
      grouped[productName].push(input);
    });
    return grouped;
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar insumo para comparar (ej: fertilizante, semilla)..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button variant="primary" className="md:w-auto" onClick={handleSearch}>
              Comparar Precios
            </Button>
          </div>
        </Card>

        {/* Comparison Results */}
        {isLoading ? (
          <Loading />
        ) : hasSearched ? (
          filteredInputs.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupByProduct(filteredInputs)).map(([productName, items]) => (
                <Card key={productName}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{productName}</h3>
                  <div className="space-y-3">
                    {items.sort((a, b) => a.price - b.price).map((item, index) => (
                      <div key={item.id} className={`flex justify-between items-center p-4 rounded-lg ${index === 0 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{item.storeName || 'Tienda'}</p>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Mejor Precio</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.type || 'Insumo'}</p>
                          {item.stock > 0 && (
                            <p className="text-xs text-gray-500">Stock: {item.stock} {item.unit || 'unidades'}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">{formatCurrencyInteger(item.price)}</p>
                          <p className="text-sm text-gray-500">por {item.unit || 'unidad'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {items.length > 1 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 Ahorro máximo: <span className="font-bold">{formatCurrencyInteger(items[items.length - 1].price - items[0].price)}</span> comprando en {items[0].storeName || 'la tienda más económica'}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card>
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Busca un insumo para comparar
              </h3>
              <p className="text-gray-600">
                Ingresa el nombre de un insumo agrícola para ver las mejores ofertas
              </p>
            </div>
          </Card>
        )}

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
