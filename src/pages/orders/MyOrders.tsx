import React, { useEffect, useState } from 'react';
import { Card, Loading, Button } from '@/components/ui';
import { orderService } from '@/api';
import type { Order } from '@/types';
import { formatCurrencyInteger } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

const statusBadge = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'bg-yellow-100 text-yellow-800';
    case 'PAID':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis Órdenes</h2>
        <p className="text-gray-600 mt-1">Historial y estado de tus pedidos</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-lg font-medium text-gray-700">No tienes órdenes todavía</p>
            <p className="text-gray-500 mt-2">Realiza una compra en el marketplace para crear tu primera orden.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <Card key={o.orderNumber}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Orden</div>
                  <div className="text-lg font-semibold text-gray-900">{o.orderNumber}</div>
                  <div className="text-sm text-gray-500">Creada: {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(o.status)}`}>{o.status.replace('_',' ')}</div>
                  <div className="text-xl font-bold text-primary-600 mt-2">{formatCurrencyInteger(o.total)}</div>
                  <div className="mt-3 flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => navigate(`/orders/${o.orderNumber}`)}>Ver</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
