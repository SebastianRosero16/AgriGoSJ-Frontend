/**
 * Store Overview Page
 * Dashboard overview for store owners
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Button, Loading } from '@/components/ui';
import {
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  BanIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { storeService } from '@/api';
import { ROUTES } from '@/utils/constants';
import type { StoreInput } from '@/types';

export const StoreOverview: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<StoreInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInputs: 0,
    lowStock: 0,
    totalValue: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getInputs();
      setInputs(data);
      calculateStats(data);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (inputsList: StoreInput[]) => {
    const totalInputs = inputsList.length;
    const lowStock = inputsList.filter(input => input.stock > 0 && input.stock < 10).length;
    const outOfStock = inputsList.filter(input => input.stock === 0).length;
    const totalValue = inputsList.reduce((sum, input) => sum + (input.price * input.stock), 0);

    setStats({
      totalInputs,
      lowStock,
      totalValue,
      outOfStock,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="text-gray-600">Resumen de tu agrotienda</p>
        </div>
        <Button variant="primary" onClick={() => navigate(ROUTES.STORE.INPUTS)}>
          Ver Mis Insumos
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Insumos</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalInputs}</p>
            </div>
            <div className="text-blue-700">
              <ShoppingBagIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Stock Bajo</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.lowStock}</p>
            </div>
            <div className="text-yellow-700">
              <ExclamationTriangleIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Sin Stock</p>
              <p className="text-3xl font-bold text-red-700">{stats.outOfStock}</p>
            </div>
            <div className="text-red-700">
              <BanIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Valor Total</p>
              <p className="text-3xl font-bold text-green-700">
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="text-green-700">
              <CurrencyDollarIcon className="w-10 h-10" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.STORE.INPUTS)}
            className="h-20 text-lg"
            icon={<PlusIcon className="w-5 h-5" />}
          >
            Agregar Nuevo Insumo
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.STORE.INPUTS)}
            className="h-20 text-lg"
            icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
          >
            Gestionar Inventario
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Insumos Recientes</h3>
        {inputs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 text-gray-400">
              <BeakerIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes insumos registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primer insumo para empezar a vender
            </p>
            <Button variant="primary" onClick={() => navigate(ROUTES.STORE.INPUTS)}>
              Agregar Primer Insumo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Insumo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {inputs.slice(0, 5).map((input) => (
                  <tr key={input.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{input.name}</div>
                      <div className="text-sm text-gray-500">{input.description}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{input.type}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${input.price.toFixed(2)} / {input.unit}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        input.stock === 0 ? 'text-red-600' :
                        input.stock < 10 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {input.stock} {input.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        input.stock === 0 ? 'bg-red-100 text-red-800' :
                        input.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {input.stock === 0 ? 'Sin Stock' :
                         input.stock < 10 ? 'Stock Bajo' :
                         'Disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {inputs.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="secondary" onClick={() => navigate(ROUTES.STORE.INPUTS)}>
                  Ver Todos los Insumos ({inputs.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StoreOverview;
