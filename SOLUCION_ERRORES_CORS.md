# Solución de Errores CORS y Bloqueadores

## 🔴 Errores Detectados

### 1. ERR_BLOCKED_BY_ADBLOCKER
```
POST https://r.stripe.com/b
net::ERR_BLOCKED_BY_ADBLOCKER
```

### 2. Failed to fetch
```
Uncaught (in promise) FetchError: Error fetching
https://r.stripe.com/b: Failed to fetch
```

## ✅ Soluciones

### Solución 1: Desactivar Bloqueador de Anuncios

El bloqueador de anuncios está interfiriendo con Stripe y las peticiones al backend.

**Pasos:**
1. Haz clic en el ícono del bloqueador de anuncios (AdBlock, uBlock, etc.)
2. Selecciona "Desactivar en este sitio" o "Pausar en este sitio"
3. Recarga la página (Ctrl+Shift+R)

### Solución 2: Configurar Stripe Correctamente

Tu archivo `.env` tiene una clave de ejemplo que no funciona.

**Pasos:**
1. Ve a https://dashboard.stripe.com/test/apikeys
2. Copia tu clave publishable (empieza con `pk_test_`)
3. Abre el archivo `.env` en la raíz del proyecto
4. Reemplaza:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QYourKeyHere
   ```
   Con tu clave real:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QY1234567890abcdefg...
   ```
5. Reinicia el servidor:
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

### Solución 3: Verificar CORS en el Backend

Si el problema persiste, el backend necesita configurar CORS correctamente.

**Backend debe permitir:**
```java
// En el backend Spring Boot
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "https://web-wnermbtbdsne.up-de-fra1-k8s-1.apps.run-on-seenode.com"
})
```

### Solución 4: Usar el Marketplace en Lugar del Asistente de IA

Mientras solucionas los problemas de configuración, puedes usar el marketplace normal:

**Opción A: Marketplace Público**
1. Ve a: `/marketplace`
2. Busca productos
3. Haz clic en "Comprar"

**Opción B: Marketplace del Comprador**
1. Inicia sesión como comprador
2. Ve a: `/buyer/marketplace`
3. Busca productos
4. Agrega al carrito o compra directamente

## 🧪 Verificar que Funciona

### Test 1: Verificar Stripe
```bash
# En la consola del navegador (F12)
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
# Debe mostrar: pk_test_51QY... (tu clave real)
```

### Test 2: Verificar Backend
```bash
# En la terminal
curl https://web-production-a81779.up.railway.app/api/marketplace/products
# Debe devolver JSON con productos
```

### Test 3: Verificar CORS
```bash
# En la consola del navegador (F12)
fetch('https://web-production-a81779.up.railway.app/api/marketplace/products')
  .then(r => r.json())
  .then(console.log)
# Debe mostrar productos sin errores CORS
```

## 📋 Checklist de Solución

- [ ] Desactivar bloqueador de anuncios
- [ ] Configurar clave de Stripe real
- [ ] Reiniciar servidor frontend
- [ ] Limpiar caché del navegador (Ctrl+Shift+R)
- [ ] Verificar que el backend esté corriendo
- [ ] Verificar CORS en el backend
- [ ] Probar en modo incógnito
- [ ] Probar en otro navegador

## 🔧 Solución Temporal

Si no puedes configurar Stripe ahora, puedes:

1. **Comentar temporalmente el código de Stripe**
2. **Usar el marketplace sin pagar** (solo para pruebas)
3. **Simular compras** sin procesar pagos reales

### Deshabilitar Stripe Temporalmente

En `src/components/payments/CheckoutModal.tsx` y `CartCheckoutModal.tsx`:

```typescript
// Comentar la validación de Stripe
// if (!stripeKeyAvailable) { ... }

// Comentar la confirmación de pago
// const result = await stripe.confirmCardPayment(...)

// Simular pago exitoso
onDone(); // Llamar directamente
```

## 🎯 Recomendación

**Para desarrollo local:**
1. Usa `http://localhost:8080` como backend
2. Configura CORS en el backend local
3. Usa Stripe en modo test

**Para producción:**
1. Configura CORS correctamente
2. Usa Stripe en modo live
3. Configura variables de entorno en el servidor

## 📞 Soporte Adicional

Si los problemas persisten:

1. **Revisa los logs del backend** para ver errores CORS
2. **Verifica la configuración de Stripe** en el dashboard
3. **Prueba en modo incógnito** para descartar extensiones
4. **Revisa la consola del navegador** (F12) para más detalles

## 🚀 Solución Rápida (Desarrollo)

Si solo quieres probar la funcionalidad sin Stripe:

```bash
# 1. Detén el servidor
Ctrl+C

# 2. Edita .env y comenta Stripe
# VITE_STRIPE_PUBLISHABLE_KEY=

# 3. Reinicia
npm run dev

# 4. Usa el marketplace sin pagar
# Las compras se crearán pero sin procesar pago
```

## ✅ Verificación Final

Una vez solucionado, deberías poder:
- ✅ Ver productos en el marketplace
- ✅ Agregar productos al carrito
- ✅ Abrir el modal de pago
- ✅ Ver el campo de tarjeta de Stripe
- ✅ Ingresar datos de tarjeta
- ✅ Procesar el pago exitosamente

**¡Buena suerte!** 🎉
