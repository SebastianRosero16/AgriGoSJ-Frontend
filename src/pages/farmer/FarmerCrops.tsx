/**
 * Farmer Crops Page
 * Manage crops with CRUD operations
 */

import React from 'react';
import { Card, Button } from '@/components/ui';

export const FarmerCrops: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Cultivos</h2>
          <p className="text-gray-600">Gestiona tus cultivos agrícolas</p>
        </div>
        <Button variant="primary">
          + Agregar Cultivo
        </Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes cultivos registrados
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza agregando tu primer cultivo para gestionar tu producción
          </p>
          <Button variant="primary">
            Crear Primer Cultivo
          </Button>
        </div>
      </Card>

      {/* Aquí irá la lista de cultivos cuando haya datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Los cultivos se cargarán desde la API */}
      </div>
    </div>
  );
};

export default FarmerCrops;
