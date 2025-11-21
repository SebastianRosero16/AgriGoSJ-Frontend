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
  const [fieldErrors, setFieldErrors] = useState({ address: '', phone: '' });

  const validateFields = () => {
    const errors = { address: '', phone: '' };
    let isValid = true;

    // Validar dirección
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      errors.address = 'La dirección es requerida';
      isValid = false;
    } else if (trimmedAddress.length < 10) {
      errors.address = 'La dirección debe tener al menos 10 caracteres';
      isValid = false;
    } else if (!/[a-zA-Z]/.test(trimmedAddress)) {
      errors.address = 'La dirección debe contener letras';
      isValid = false;
    } else if (!/\d/.test(trimmedAddress)) {
      errors.address = 'La dirección debe contener números (ej: Calle 10 #20-30)';
      isValid = false;
    } else if (/^[\s\d\-#]+$/.test(trimmedAddress)) {
      errors.address = 'La dirección debe incluir el nombre de la calle o carrera';
      isValid = false;
    }

    // Validar teléfono
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
    if (!stripe || !elements) return;
    
    // Validar cantidad
    if (!qty || qty < 1) {
      onError(new Error('Debes ingresar una cantidad válida'));
      return;
    }
    
    // Validar campos
    if (!validateFields()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Log del item completo para debugging
      console.log('Item recibido en CheckoutModal:', item);
      console.log('ID del producto:', item.id);
      
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
            // Solo permitir números
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
        <div className="p-3 border rounded bg-white"><CardElement options={{ style: { base: { fontSize: '16px' } } }} /></div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" onClick={handlePay} disabled={isProcessing || !stripe}>{isProcessing ? 'Procesando...' : 'Pagar con Stripe'}</Button>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose, item }) => {
  const [qty, setQty] = useState<number | string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [qtyError, setQtyError] = useState<string>('');

  const stripeKeyAvailable = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
  // Límite máximo de cantidad (basado en stock disponible o límite razonable)
  const maxQty = Math.min(item?.stock || 100, 100);

  const handleQtyChange = (value: string) => {
    // Permitir campo vacío temporalmente mientras el usuario escribe
    if (value === '') {
      setQty('');
      setQtyError('');
      return;
    }
    
    const numValue = parseInt(value);
    
    // Si no es un número válido, no hacer nada
    if (isNaN(numValue)) {
      return;
    }
    
    if (numValue < 1) {
      setQty(1);
      setQtyError('');
    } else if (numValue > maxQty) {
      setQty(maxQty);
      setQtyError(`La cantidad máxima disponible es ${maxQty}`);
      setTimeout(() => setQtyError(''), 3000);
    } else {
      setQty(numValue);
      setQtyError('');
    }
  };

  const handleQtyBlur = () => {
    // Cuando el usuario sale del campo, validar que hay un valor
    if (qty === '' || Number(qty) < 1 || isNaN(Number(qty))) {
      setQtyError('Debes ingresar una cantidad válida (1-100)');
    } else {
      setQtyError('');
    }
  };

  const handleDone = () => {
    setError(null);
    setShowSuccess(true);
  };

  const handleError = (err: any) => {
    console.error(err);
    setError(String(err?.message || err));
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!open) return null;

  // Modal de éxito
  if (showSuccess) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Pago Exitoso!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Tu pago se ha procesado correctamente. Puedes revisar el estado de tu orden en la sección "Mis Órdenes".
          </p>
          <Button variant="primary" onClick={handleCloseSuccess} fullWidth>
            Entendido
          </Button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Pagar {item?.name || item?.title}</h3>
        {!stripeKeyAvailable && (
          <div className="p-3 mb-4 bg-yellow-50 text-yellow-700">No se ha configurado `VITE_STRIPE_PUBLISHABLE_KEY`. Configura la clave publishable en el entorno.</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
            <input 
              type="number" 
              min={1} 
              max={maxQty}
              value={qty} 
              onChange={(e)=>handleQtyChange(e.target.value)}
              onBlur={handleQtyBlur}
              placeholder="Ingresa la cantidad (1-100)"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500" 
            />
            {qtyError ? (
              <p className="mt-1 text-sm text-red-600">{qtyError}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Máximo: {maxQty} unidades</p>
            )}
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm item={item} qty={Number(qty) || 1} onDone={handleDone} onError={handleError} />
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
