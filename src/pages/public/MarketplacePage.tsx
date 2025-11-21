/**
 * Marketplace Public Page
 * Browse products from farmers and stores
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Loading } from '@/components/ui';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth, useCart } from '@/hooks';
import { useEffect, useState } from 'react';
import { marketplaceService, storeService } from '@/api';
import { formatCurrencyInteger } from '@/utils/format';
import CheckoutModal from '@/components/payments/CheckoutModal';
import CartCheckoutModal from '@/components/payments/CartCheckoutModal';
import { toast } from 'react-toastify';

export const MarketplacePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { addItem, getTotalItems } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<any | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCheckoutOpen, setCartCheckoutOpen] = useState(false);

  useEffect(() => {
    // If user is farmer, default to 'inputs' and load public inputs
    const load = async () => {
      setIsLoading(true);
      try {
        if (user?.role === 'FARMER') {
          setCategory('inputs');
          const ins = await storeService.getInputsPublic();
          setItems(Array.isArray(ins) ? ins : []);
        } else {
          // Default to marketplace products
          setCategory('products');
          const prods = await marketplaceService.getProducts();
          setItems(Array.isArray(prods) ? prods : []);
        }
      } catch (err) {
        console.warn('Error loading marketplace items:', err);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
              {isAuthenticated && (
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
              )}
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Buscar productos..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {user?.role === 'FARMER' ? (
              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium">
                Insumos
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Todas las categorías</option>
                <option value="crops">Cultivos</option>
                <option value="inputs">Insumos</option>
              </select>
            )}
            <Button variant="primary" fullWidth onClick={async () => {
              setIsLoading(true);
              try {
                if (category === 'inputs') {
                  const ins = await storeService.getInputsPublic();
                  setItems(Array.isArray(ins) ? ins : []);
                } else {
                  const prods = await marketplaceService.getProducts();
                  setItems(Array.isArray(prods) ? prods : []);
                }
              } catch (err) {
                console.warn('Error fetching items:', err);
                setItems([]);
              } finally {
                setIsLoading(false);
              }
            }}>
              Buscar
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full"><Loading /></div>
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
            items.map((it: any) => (
              <Card key={it.id}>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">{it.name || it.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{it.storeName || it.vendorName || ''}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">{formatCurrencyInteger(Number(it.price || it.unitPrice || 0))}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        if (!isAuthenticated) {
                          toast.warning('Debes iniciar sesión para agregar productos');
                          return;
                        }
                        addItem({
                          id: it.id,
                          name: it.name || it.title,
                          price: Number(it.price || it.unitPrice || 0),
                          stock: it.stock || it.availableStock || 100,
                          unit: it.unit,
                          storeName: it.storeName,
                          vendorName: it.vendorName,
                        }, 1);
                        toast.success('Producto agregado al carrito');
                      }}>
                        + Carrito
                      </Button>
                      <Button size="sm" onClick={() => {
                        if (!isAuthenticated) {
                          toast.warning('Debes iniciar sesión para comprar productos');
                          return;
                        }
                        setCheckoutItem(it);
                        setCheckoutOpen(true);
                      }}>
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        {checkoutItem && (
          <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} item={checkoutItem} />
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

export default MarketplacePage;
