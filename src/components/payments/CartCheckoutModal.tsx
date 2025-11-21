import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Input } from '@/components/ui';
import { orderService, paymentService } from '@/api';
import { useAuth, useCart } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { formatCurrencyInteger } from '@/utils/format';

interface CartCheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm: React.FC<{ onDone: () => void; onError: (err: any) => void }> = ({ onDone, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { items, getTotalPrice } = useCart();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ address: '', phone: '' });

  const validateFields = () => {
    const errors = { address: '', phone: '' };
    let isValid = true;

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      errors.address = 'La dirección es requerida';
      isValid = false;
    } else if (trimmedAddress.length < 10) {
      errors.address = 'La dirección debe tener al menos 10 caracteres';
      isValid = false;
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errors.phone = 'El teléfono es requerido';
      isValid = false;
    } else if (!/^\d{7,10}$/.test(trimmedPhone)) {
      errors.phone = 'El teléfono debe tener entre 7 y 10 dígitos';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handlePay = async () => {
    if (!stripe || !elements || items.length === 0) return;
    
    if (!validateFields()) return;

    setIsProcessing(true);
    try {
      // Crear orden con todos los items del carrito
      const payload = {
        items: items.map(item => ({ 
          productId: Number(item.id), 
          quantity: Number(item.quantity) 
        })),
        shippingAddress: address,
        shippingCity: '',
        shippingState: '',
        shippingZipCode: '',
        shippingPhone: phone,
        notes: `Compra desde Marketplace - ${items.length} producto(s)`,
      };

      const order = await orderService.createOrder(payload as any);
      
      if (!order || !order.orderNumber) {
        throw new Error('No se pudo crear la orden');
      }

      // Iniciar pago
      const payResp: any = await paymentService.initiatePayment({ 
        orderNumber: order.orderNumber, 
        paymentMethod: 'STRIPE' 
      });
      
      const clientSecret = payResp?.clientSecret || payResp?.paymentIntentClientSecret;
      if (!clientSecret) throw new Error('No se recibió clientSecret');

      // Confirmar pago con Stripe
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Elemento de tarjeta no disponible');

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.fullName || (user as any)?.username || 'Cliente',
            email: (user as any)?.email || undefined,
          },
        },
      });

      if (result.error) {
        throw result.error;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        try {
          await paymentService.confirmPayment(result.paymentIntent.id);
        } catch (e) {
          console.warn('confirmPayment backend failed', e);
        }
        onDone();
      } else {
        throw new Error('Pago no completado');
      }
    } catch (err) {
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección *</label>
        <Input 
          value={address} 
          onChange={(e:any)=>{
            setAddress(e.target.value);
            setFieldErrors(prev => ({ ...prev, address: '' }));
          }} 
          placeholder="Ej: Calle 10 #20-30, Barrio Centro" 
        />
        {fieldErrors.address && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
        <Input 
          type="tel"
          value={phone} 
          onChange={(e:any)=>{
            const value = e.target.value;
            if (value === '' || /^\d+$/.test(value)) {
              setPhone(value);
              setFieldErrors(prev => ({ ...prev, phone: '' }));
            }
          }} 
          placeholder="Teléfono (solo números)" 
          maxLength={10}
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tarjeta *</label>
        <div className="p-3 border rounded bg-white">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      
      {/* Resumen */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Resumen del pedido</h4>
        <div className="space-y-1 text-sm">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrencyInteger(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span className="text-primary-600">{formatCurrencyInteger(getTotalPrice())}</span>
          </div>
        </div>
      </div>

      <Button 
        variant="primary" 
        onClick={handlePay} 
        disabled={isProcessing || !stripe}
        fullWidth
      >
        {isProcessing ? 'Procesando...' : 'Pagar con Stripe'}
      </Button>
    </div>
  );
};

const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart, items } = useCart();

  const stripeKeyAvailable = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleDone = () => {
    setError(null);
    setShowSuccess(true);
    clearCart();
  };

  const handleError = (err: any) => {
    console.error(err);
    setError(String(err?.message || err));
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
    if (user?.role === 'FARMER') {
      navigate(ROUTES.FARMER.ORDERS);
    } else if (user?.role === 'BUYER') {
      navigate(ROUTES.BUYER.ORDERS);
    } else if (user?.role === 'STORE') {
      navigate(ROUTES.STORE.ORDERS);
    }
  };

  if (!open) return null;

  // Modal de éxito
  if (showSuccess) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
          <p className="text-gray-600 mb-6">
            Tu pago se ha procesado correctamente. Puedes revisar el estado de tu orden en "Mis Órdenes".
          </p>
          <Button variant="primary" onClick={handleCloseSuccess} fullWidth>
            Ver Mis Órdenes
          </Button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Finalizar Compra</h3>
        
        {!stripeKeyAvailable && (
          <div className="p-3 mb-4 bg-yellow-50 text-yellow-700 rounded">
            No se ha configurado Stripe. Configura VITE_STRIPE_PUBLISHABLE_KEY.
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Tu carrito está vacío</p>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm onDone={handleDone} onError={handleError} />
          </Elements>
        )}

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>, 
    document.body
  );
};

export default CartCheckoutModal;
