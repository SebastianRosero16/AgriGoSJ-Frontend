/**
 * Farmer Products Page
 * Manage products for marketplace
 */

import React from 'react';
import { Card, Button } from '@/components/ui';

export const FarmerProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
          <p className="text-gray-600">Gestiona los productos que vendes en el marketplace</p>
        </div>
        <Button variant="primary">
          + Publicar Producto
        </Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes productos publicados
          </h3>
          <p className="text-gray-500 mb-4">
            Publica tus productos para que los compradores puedan encontrarlos
          </p>
          <Button variant="primary">
            Publicar Primer Producto
          </Button>
        </div>
      </Card>

      {/* Aquí irá la lista de productos cuando haya datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Los productos se cargarán desde la API */}
      </div>
    </div>
  );
};

export default FarmerProducts;
