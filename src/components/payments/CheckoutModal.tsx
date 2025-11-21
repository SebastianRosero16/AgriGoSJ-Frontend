import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Input } from '@/components/ui';
import { orderService, paymentService } from '@/api';
import { useAuth } from '@/hooks';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  item: any; // product/item being purchased
  initialQty?: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm: React.FC<{ item: any; qty: number; onDone: () => void; onError: (err: any) => void }> = ({ item, qty, onDone, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!address || !phone) {
      onError(new Error('Dirección y teléfono son requeridos'));
      return;
    }

    setIsProcessing(true);
    try {
      // 1) Crear la orden en backend
      const payload = {
        items: [{ productId: Number(item.id), quantity: Number(qty) }],
        shippingAddress: address,
        shippingCity: '',
        shippingState: '',
        shippingZipCode: '',
        shippingPhone: phone,
        notes: `Compra desde Marketplace - ${item.name || item.title}`,
      };
      
      console.log('Enviando orden al backend:', payload);

      const order = await orderService.createOrder(payload as any);
      console.log('Orden creada:', order);
      
      // Validar que la orden tenga orderNumber
      if (!order || !order.orderNumber) {
        throw new Error('No se pudo crear la orden o falta el orderNumber');
      }

      // 2) Iniciar pago en backend (esperamos clientSecret)
      console.log('Iniciando pago con orderNumber:', order.orderNumber);
      const payResp: any = await paymentService.initiatePayment({ orderNumber: order.orderNumber, paymentMethod: 'STRIPE' });
      const clientSecret = payResp?.clientSecret || payResp?.paymentIntentClientSecret;
      if (!clientSecret) throw new Error('No se recibió clientSecret desde el servidor');

      // 3) Confirmar pago con Stripe
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
        // Opcional: confirmar en backend
        try {
          await paymentService.confirmPayment(result.paymentIntent.id);
        } catch (e) {
          // no bloqueante
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
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <Input value={address} onChange={(e:any)=>setAddress(e.target.value)} placeholder="Dirección de envío" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <Input value={phone} onChange={(e:any)=>setPhone(e.target.value)} placeholder="Teléfono" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tarjeta</label>
        <div className="p-3 border rounded bg-white"><CardElement options={{ style: { base: { fontSize: '16px' } } }} /></div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" onClick={handlePay} disabled={isProcessing || !stripe}>{isProcessing ? 'Procesando...' : 'Pagar con Stripe'}</Button>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose, item, initialQty = 1 }) => {
  const [qty, setQty] = useState(initialQty);
  const [error, setError] = useState<string | null>(null);

  const stripeKeyAvailable = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleDone = () => {
    setError(null);
    alert('Pago realizado con éxito. Revisa tus órdenes.');
    onClose();
  };

  const handleError = (err: any) => {
    console.error(err);
    setError(String(err?.message || err));
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Pagar {item?.name || item?.title}</h3>
        {!stripeKeyAvailable && (
          <div className="p-3 mb-4 bg-yellow-50 text-yellow-700">No se ha configurado `VITE_STRIPE_PUBLISHABLE_KEY`. Configura la clave publishable en el entorno.</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input type="number" min={1} value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value || 1)))} className="w-full px-3 py-2 border rounded" />
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm item={item} qty={qty} onDone={handleDone} onError={handleError} />
          </Elements>
        </div>
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>, document.body
  );
};

export default CheckoutModal;
