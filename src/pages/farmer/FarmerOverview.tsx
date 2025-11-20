/**
 * Farmer Overview Page
 * Dashboard main view with statistics
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { Link } from 'react-router-dom';
import { Card, Loading } from '@/components/ui';
import { formatCurrencyInteger, translateInputType, formatNumber } from '@/utils/format';
import { ROUTES } from '@/utils/constants';
import { marketplaceService, farmerService } from '@/api';
import {
  ShoppingBagIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

export const FarmerOverview: React.FC = () => {
  useAuth();
  const [stats, setStats] = useState({
    activeCrops: 0,
    publishedProducts: 0,
    aiRecommendations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [inputs, setInputs] = useState<any[]>([]);
  const [showRawInputs, setShowRawInputs] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Obtener productos publicados
      const products = await marketplaceService.getMyProducts();
      const productsCount = Array.isArray(products) ? products.length : 0;

      // Obtener cultivos para contar activos
      let activeCropsCount = 0;
      try {
        const crops = await farmerService.getCrops();
        if (Array.isArray(crops)) {
          // Consideramos "activo" cualquier cultivo que no esté en etapa HARVEST
          activeCropsCount = crops.filter(c => c.stage !== 'HARVEST').length;
        }
      } catch (err) {
        console.warn('No se pudieron obtener cultivos para estadísticas:', err);
      }

      // TODO: recommendations endpoint
      setStats({
        activeCrops: activeCropsCount,
        publishedProducts: productsCount,
        aiRecommendations: 0,
      });

      // Para evitar mostrar insumos editables en el panel del agricultor,
      // no cargamos directamente la lista de inputs aquí. El agricultor
      // debe comprar insumos desde el Marketplace. Dejamos inputs vacío.
      setInputs([]);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Si hay error, mantener en 0
      setStats({
        activeCrops: 0,
        publishedProducts: 0,
        aiRecommendations: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // (Se removió la utilidad de depuración para evitar llamadas directas desde el panel de agricultor)

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
        <p className="text-gray-600 mt-1">Resumen de tu actividad agrícola</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cultivos Activos</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.activeCrops}</p>
            </div>
            <div className="text-primary-600">
              <SparklesIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Publicados</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.publishedProducts}</p>
            </div>
            <div className="text-primary-600">
              <ShoppingBagIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recomendaciones IA</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.aiRecommendations}</p>
            </div>
            <div className="text-primary-600">
              <Cog6ToothIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={ROUTES.FARMER.CROPS}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
          >
            <span className="mr-4 text-primary-600">
              <SparklesIcon className="w-8 h-8" />
            </span>
            <div>
              <p className="font-medium text-gray-900">Agregar Cultivo</p>
              <p className="text-sm text-gray-600">Registra un nuevo cultivo</p>
            </div>
          </Link>

          <Link
            to={ROUTES.FARMER.PRODUCTS}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
          >
            <span className="mr-4 text-primary-600">
              <ShoppingBagIcon className="w-8 h-8" />
            </span>
            <div>
              <p className="font-medium text-gray-900">Publicar Producto</p>
              <p className="text-sm text-gray-600">Vende tus productos</p>
            </div>
          </Link>

          <Link
            to={ROUTES.FARMER.AI_RECOMMENDATIONS}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
          >
            <span className="mr-4 text-primary-600">
              <Cog6ToothIcon className="w-8 h-8" />
            </span>
            <div>
              <p className="font-medium text-gray-900">Pedir Recomendación</p>
              <p className="text-sm text-gray-600">Asistencia de IA</p>
            </div>
          </Link>

          <Link
            to={ROUTES.MARKETPLACE}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
          >
            <span className="mr-4 text-primary-600">
              <ShoppingCartIcon className="w-8 h-8" />
            </span>
            <div>
              <p className="font-medium text-gray-900">Ver Marketplace</p>
              <p className="text-sm text-gray-600">Comprar insumos</p>
            </div>
          </Link>
        </div>
      </Card>

      {/* Insumos Recientes */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">Insumos Recientes</h3>
          <button
            className="text-sm text-primary-600 underline"
            onClick={() => setShowRawInputs(s => !s)}
            title="Mostrar datos crudos de inputs para depuración"
          >
            {showRawInputs ? 'Ocultar datos' : 'Mostrar datos crudos'}
          </button>
          {/* botón de debug eliminado */}
        </div>
        <div className="mb-4 p-3 bg-green-50 dark:bg-gray-900 text-green-800 dark:text-green-200 rounded">
          <p>Para comprar insumos, usa el <a className="text-primary-600 underline" href={ROUTES.MARKETPLACE}>Marketplace</a>.</p>
        </div>
        {inputs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay insumos para mostrar. Ve al <Link to={ROUTES.MARKETPLACE} className="text-primary-600">marketplace</Link> para ver opciones.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-sm font-medium text-gray-700">Insumo</th>
                  <th className="py-2 px-3 text-sm font-medium text-gray-700">Tipo</th>
                  <th className="py-2 px-3 text-sm font-medium text-gray-700">Precio</th>
                  <th className="py-2 px-3 text-sm font-medium text-gray-700">Stock</th>
                </tr>
              </thead>
              <tbody>
                {inputs.map((inp) => (
                  <tr key={inp.id} className="border-t border-gray-100">
                    <td className="py-3 px-3 text-sm text-gray-800">{inp.name}</td>
                    <td className="py-3 px-3 text-sm text-gray-600">{translateInputType(inp.type)}</td>
                    <td className="py-3 px-3 text-sm text-gray-800">{formatCurrencyInteger(Number(inp.price || 0))}</td>
                    <td className="py-3 px-3 text-sm text-gray-800">{formatNumber(Number(inp.stock || 0), 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showRawInputs && (
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded">
            <pre className="text-xs text-gray-700 dark:text-gray-200 overflow-auto max-h-64">{JSON.stringify(inputs, null, 2)}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FarmerOverview;
