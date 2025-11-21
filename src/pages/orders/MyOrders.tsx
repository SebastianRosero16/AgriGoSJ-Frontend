import React, { useEffect, useState } from 'react';
import { Card, Loading, Button } from '@/components/ui';
import { orderService } from '@/api';
import type { Order } from '@/types';
import { formatCurrencyInteger } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


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

const translateStatus = (status: string) => {
  const translations: { [key: string]: string } = {
    'PENDING_PAYMENT': 'Pendiente de Pago',
    'PAID': 'Pagado',
    'PROCESSING': 'En Proceso',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado',
    'REFUNDED': 'Reembolsado',
  };
  return translations[status] || status;
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders();
      // Filtrar órdenes canceladas para que no aparezcan en la lista
      const activeOrders = Array.isArray(data) ? data.filter(order => order.status !== 'CANCELLED') : [];
      setOrders(activeOrders);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleDeleteOrder = (orderNumber: string) => {
    setOrderToDelete(orderNumber);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      await orderService.cancelOrder(orderToDelete);
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      // Recargar órdenes después de eliminar
      await loadOrders();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
      alert('No se pudo eliminar la orden');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.BUYER.DASHBOARD)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Volver al Panel</span>
        </button>
      </div>
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(o.status)}`}>{translateStatus(o.status)}</div>
                  <div className="text-xl font-bold text-primary-600 mt-2">{formatCurrencyInteger(o.total)}</div>
                  <div className="mt-3 flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => handleViewOrder(o)}>Ver</Button>
                    <Button variant="danger" onClick={() => handleDeleteOrder(o.orderNumber)}>Eliminar</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de detalles de la orden */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Detalles de la Orden</h3>
                <p className="text-gray-600">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusBadge(selectedOrder.status)}`}>
                    {translateStatus(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-primary-600">{formatCurrencyInteger(selectedOrder.total)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Fecha de creación</p>
                <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Productos</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => {
                      // Intentar obtener el precio de diferentes campos posibles
                      const itemPrice = item.price || item.unitPrice || item.pricePerUnit || 0;
                      const itemTotal = itemPrice * (item.quantity || 1);
                      
                      // Si no hay precio en los items pero hay total en la orden, calcular proporcionalmente
                      const calculatedTotal = itemTotal > 0 
                        ? itemTotal 
                        : (selectedOrder.items.length > 0 ? selectedOrder.total / selectedOrder.items.length : 0);
                      
                      return (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{item.productName || `Producto ID: ${item.productId}`}</p>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                            {itemPrice > 0 && (
                              <p className="text-xs text-gray-500">Precio unitario: {formatCurrencyInteger(itemPrice)}</p>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900">{formatCurrencyInteger(calculatedTotal)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-sm text-gray-500">Dirección de envío</p>
                  <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setShowDetails(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar orden?</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={cancelDelete}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
