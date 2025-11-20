/**
 * Farmer Overview Page
 * Dashboard main view with statistics
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Loading } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { marketplaceService } from '@/api';
import {
  ShoppingBagIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

export const FarmerOverview: React.FC = () => {
  const [stats, setStats] = useState({
    activeCrops: 0,
    publishedProducts: 0,
    aiRecommendations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Obtener productos publicados
      const products = await marketplaceService.getMyProducts();
      const productsCount = Array.isArray(products) ? products.length : 0;

      // TODO: Cuando el backend tenga endpoints para cultivos y recomendaciones IA, agregar aquí
      // const crops = await cropsService.getMyCrops();
      // const recommendations = await aiService.getMyRecommendations();

      setStats({
        activeCrops: 0, // TODO: Actualizar cuando exista el endpoint
        publishedProducts: productsCount,
        aiRecommendations: 0, // TODO: Actualizar cuando exista el endpoint
      });
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
    </div>
  );
};

export default FarmerOverview;
