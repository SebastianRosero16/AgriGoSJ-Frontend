/**
 * Buyer Marketplace Page
 * Marketplace exclusivo para compradores con carrito de compras
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Loading } from '@/components/ui';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth, useCart } from '@/hooks';
import { marketplaceService } from '@/api';
import { formatCurrencyInteger } from '@/utils/format';
import CheckoutModal from '@/components/payments/CheckoutModal';
import CartCheckoutModal from '@/components/payments/CartCheckoutModal';
import { toast } from 'react-toastify';

export const BuyerMarketplace: React.FC = () => {
  const { user, logout } = useAuth();
  const { addItem, getTotalItems } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('products');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<any | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCheckoutOpen, setCartCheckoutOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const prods = await marketplaceService.getProducts();
      setItems(Array.isArray(prods) ? prods : []);
    } catch (err) {
      console.warn('Error loading products:', err);
      setItems([]);
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const prods = await marketplaceService.getProducts();
      let filtered = Array.isArray(prods) ? prods : [];
      
      // Filtrar por búsqueda
      if (query.trim()) {
        filtered = filtered.filter((item: any) => 
          (item.name || item.title || '').toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setItems(filtered);
    } catch (err) {
      console.warn('Error searching products:', err);
      setItems([]);
      toast.error('Error al buscar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to={ROUTES.BUYER.DASHBOARD}>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-primary-600">
                  {APP_INFO.NAME}
                </h1>
                <p className="text-sm text-gray-600">
                  Marketplace - {user?.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <Link to={ROUTES.BUYER.ORDERS}>
                <Button variant="outline">Mis Órdenes</Button>
              </Link>
              <Button variant="danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Marketplace de Productos Agrícolas</h2>
          <p className="text-gray-600 mt-2">
            Explora y compra productos frescos directamente de los agricultores
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              type="text"
              placeholder="Buscar productos..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="products">Productos Agrícolas</option>
              <option value="vegetables">Verduras</option>
              <option value="fruits">Frutas</option>
              <option value="grains">Granos</option>
            </select>
            <Button variant="primary" fullWidth onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full">
              <Loading />
            </div>
          ) : items.length === 0 ? (
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
          ) : (
            items.map((item: any) => (
              <Card key={item.id}>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {item.name || item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.vendorName || item.farmerName || 'Vendedor'}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrencyInteger(Number(item.price || item.unitPrice || 0))}
                      </div>
                      {item.unit && (
                        <p className="text-xs text-gray-500">por {item.unit}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          addItem(
                            {
                              id: item.id,
                              name: item.name || item.title,
                              price: Number(item.price || item.unitPrice || 0),
                              stock: item.stock || item.availableStock || 100,
                              unit: item.unit,
                              vendorName: item.vendorName || item.farmerName,
                            },
                            1
                          );
                          toast.success('Producto agregado al carrito');
                        }}
                      >
                        + Carrito
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCheckoutItem(item);
                          setCheckoutOpen(true);
                        }}
                      >
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Modals */}
        {checkoutItem && (
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            item={checkoutItem}
          />
        )}

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCartCheckoutOpen(true);
          }}
        />

        <CartCheckoutModal
          open={cartCheckoutOpen}
          onClose={() => setCartCheckoutOpen(false)}
        />
      </div>
    </div>
  );
};

export default BuyerMarketplace;
