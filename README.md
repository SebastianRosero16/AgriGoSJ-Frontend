# 🌾 AgriGoSJ - Frontend

## 📋 Descripción

AgriGoSJ es una plataforma web moderna que conecta agricultores, agrotiendas y compradores en un ecosistema digital agrícola completo. Desarrollada con React, TypeScript y estructuras de datos avanzadas, ofrece funcionalidades de marketplace, comparación de precios, asistente de compras con IA, y sistema de pagos integrado.

## 🚀 Tecnologías Principales

- **React 18.2** - Biblioteca UI moderna
- **TypeScript 5.2** - Tipado estático robusto
- **Vite 5.0** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router 6** - Enrutamiento SPA
- **Axios** - Cliente HTTP con interceptores
- **React Hook Form + Zod** - Validación de formularios
- **React Toastify** - Sistema de notificaciones
- **Stripe** - Pasarela de pagos segura
- **Zustand** - Gestión de estado global ligera

## 🏗️ Estructuras de Datos Implementadas

### Queue (Cola)
- **Ubicación**: `src/data-structures/Queue.ts`
- **Uso**: Gestión de peticiones HTTP y rate limiting de IA
- **Complejidad**: O(1) enqueue/dequeue
- **Aplicación**: Control de flujo de solicitudes al servicio de IA

### Stack (Pila)
- **Ubicación**: `src/data-structures/Stack.ts`
- **Uso**: Undo/Redo de operaciones y navegación
- **Complejidad**: O(1) push/pop
- **Aplicación**: Historial de navegación y operaciones reversibles

### LinkedList (Lista Enlazada)
- **Ubicación**: `src/data-structures/LinkedList.ts`
- **Uso**: Gestión dinámica de elementos del carrito
- **Complejidad**: O(1) inserción/eliminación
- **Aplicación**: Carrito de compras con operaciones eficientes

### Tree (Árbol)
- **Ubicación**: `src/data-structures/Tree.ts`
- **Uso**: Categorización jerárquica de productos
- **Complejidad**: O(log n) búsqueda en árbol balanceado
- **Aplicación**: Sistema de categorías y filtros

### Graph (Grafo)
- **Ubicación**: `src/data-structures/Graph.ts`
- **Uso**: Comparador de precios con algoritmos BFS/DFS
- **Complejidad**: O(V + E) para recorridos
- **Aplicación**: Análisis de precios entre diferentes tiendas

## 📁 Arquitectura del Proyecto

```
src/
├── api/                    # Servicios HTTP y comunicación con backend
│   ├── aiService.ts       # Servicio de IA para recomendaciones
│   ├── authService.ts     # Autenticación y autorización
│   ├── farmerService.ts   # Gestión de agricultores
│   ├── httpClient.ts      # Cliente HTTP configurado
│   ├── marketplaceService.ts  # Marketplace y productos
│   ├── orderService.ts    # Gestión de pedidos
│   ├── paymentService.ts  # Integración con Stripe
│   ├── priceComparatorService.ts  # Comparación de precios
│   └── storeService.ts    # Gestión de agrotiendas
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── payments/         # Componentes de pago (CheckoutModal)
│   └── ui/               # Componentes UI genéricos
├── context/              # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación global
├── data-structures/      # Estructuras de datos personalizadas
│   ├── Graph.ts
│   ├── LinkedList.ts
│   ├── Queue.ts
│   ├── Stack.ts
│   └── Tree.ts
├── hooks/                # Custom hooks
├── pages/                # Páginas de la aplicación
│   ├── buyer/           # Dashboard del comprador
│   ├── orders/          # Gestión de pedidos
│   └── public/          # Páginas públicas (marketplace, comparador, asistente)
├── types/                # Definiciones de tipos TypeScript
├── utils/                # Utilidades y helpers
└── App.tsx               # Componente principal
```

### Características de Seguridad
- ✅ Autenticación JWT con refresh tokens automáticos
- ✅ Interceptores HTTP para manejo de tokens
- ✅ Bloqueo del botón "atrás" del navegador después del login
- ✅ Rutas protegidas por rol (FARMER, STORE, BUYER, ADMIN)
- ✅ Validaciones estrictas anti-espacios múltiples
- ✅ Sanitización de inputs en formularios
- ✅ Protección CSRF mediante tokens

## 🛒 Sistema de Compras

### Características Principales
- ✅ **Compra sin restricciones**: Cualquier usuario autenticado puede comprar productos
- ✅ **Carrito de compras**: Sistema completo con persistencia en localStorage
- ✅ **Marketplace del Comprador**: Sección dedicada para usuarios BUYER
- ✅ **Dos modalidades de compra**:
  - Compra rápida (producto individual)
  - Compra múltiple (carrito con varios productos)
- ✅ **Pago con Stripe**: Integración completa y segura con checkout modal
- ✅ **Validaciones en tiempo real**: Dirección, teléfono, cantidad, stock
- ✅ **Gestión de pedidos**: Historial completo con estados y seguimiento
- ✅ **Cálculo automático**: Subtotales, impuestos y totales

### Marketplaces Disponibles
1. **Marketplace Público** (`/marketplace`) - Acceso para todos los usuarios autenticados
2. **Marketplace del Comprador** (`/buyer/marketplace`) - Exclusivo para rol BUYER con carrito integrado
3. **Comparador de Precios** (`/price-comparator`) - Análisis de precios entre tiendas
4. **Asistente de Compras IA** (`/shopping-assistant`) - Recomendaciones personalizadas

### Documentación del Sistema de Compras
- 📖 [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) - Guía de inicio en 5 minutos
- 📖 [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) - Visión general del sistema
- 📖 [COMPRAS_README.md](./COMPRAS_README.md) - Documentación técnica completa
- 📖 [BUYER_MARKETPLACE_README.md](./BUYER_MARKETPLACE_README.md) - Marketplace del comprador
- 📖 [RESUMEN_IMPLEMENTACION_COMPRADOR.md](./RESUMEN_IMPLEMENTACION_COMPRADOR.md) - Resumen de implementación
- 📖 [MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md) - Detalle de cambios
- 📖 [GUIA_PRUEBAS.md](./GUIA_PRUEBAS.md) - Checklist de pruebas

### Configuración de Stripe
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
```

### Tarjetas de Prueba
```
Éxito: 4242 4242 4242 4242
Falla: 4000 0000 0000 0002
```

## Validaciones Implementadas

- Sin campos vacíos
- Sin espacios múltiples consecutivos
- Validación de email
- Contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números)
- Usernames alfanuméricos
- Validación de dirección de envío (mínimo 10 caracteres)
- Validación de teléfono (7-10 dígitos)
- Validación de cantidad de productos (1-100 unidades)

## 👥 Roles del Sistema

### FARMER (Agricultor)
- Gestión de cultivos y cosechas
- Publicación de productos en marketplace
- Seguimiento de ventas
- Actualización de inventario
- Gestión de perfil

### STORE (Agrotienda)
- Exploración de marketplace
- Comparación de precios entre proveedores
- Compra de productos agrícolas
- Gestión de inventario de insumos
- Reportes y estadísticas
- Administración de tienda

### BUYER (Comprador)
- Acceso a marketplace exclusivo
- Carrito de compras persistente
- Compra de productos
- Historial de pedidos
- Asistente de compras con IA
- Comparador de precios
- Gestión de direcciones de envío

### ADMIN (Administrador)
- Gestión completa de usuarios
- Moderación de contenido
- Reportes del sistema
- Configuración de plataforma
- Análisis de métricas
## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ (recomendado 20+)
- npm 9+ o yarn 1.22+
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/agrigosj-frontend.git
cd agrigosj-frontend
```

2. **Instalar dependencias**
```bash
npm install
# o usar el script Windows
install.bat
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=AgriGoSJ
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter ESLint
```

## 🔗 API Backend

El frontend se conecta a un backend Spring Boot:
- **URL por defecto**: `http://localhost:8080`
- **Autenticación**: JWT Bearer Token
- **Documentación**: Swagger UI disponible en `/swagger-ui.html`

### Endpoints Principales
```
POST   /auth/login              # Iniciar sesión
POST   /auth/register           # Registrar usuario
POST   /auth/refresh            # Refrescar token
GET    /api/farmer/crops        # Listar cultivos
POST   /api/farmer/crops        # Crear cultivo
GET    /api/store/inputs        # Listar insumos
GET    /api/marketplace/products # Listar productos
POST   /api/orders              # Crear pedido
GET    /api/orders/my-orders    # Mis pedidos
POST   /api/payments/create-checkout # Crear sesión de pago
POST   /api/ai/recommend        # Obtener recomendaciones IA
GET    /api/price-comparator    # Comparar precios
```

## 🎨 Diseño y UX

- **Colores primarios**: Tonos verdes (#10b981, #059669) representando agricultura
- **Tipografía**: Inter (sistema) para legibilidad óptima
- **Responsive**: Mobile-first design con breakpoints Tailwind
- **Accesibilidad**: Navegación por teclado, ARIA labels, contraste WCAG AA
- **Animaciones**: Transiciones suaves con Tailwind transitions
- **Dark mode**: Preparado para implementación futura

## 🧪 Algoritmos y Optimizaciones

### Algoritmos Implementados
- **Binary Search**: Búsqueda eficiente O(log n) en listas ordenadas
- **BFS/DFS**: Recorrido de grafos para comparación de precios
- **Dijkstra**: Camino más corto para optimización de precios
- **Debouncing**: Optimización de búsquedas en tiempo real
- **Memoization**: Cache de resultados costosos

### Optimizaciones de Rendimiento
- Code splitting con React.lazy()
- Lazy loading de imágenes
- Virtualización de listas largas
- Compresión de assets en build
- Tree shaking automático con Vite


## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📦 Build y Deployment

### Build de Producción
```bash
npm run build
```

Los archivos optimizados se generan en `/dist`

### Preview del Build
```bash
npm run preview
```

### Deployment en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🐛 Solución de Problemas

### Error CORS
Ver documentación detallada en [SOLUCION_ERRORES_CORS.md](./SOLUCION_ERRORES_CORS.md)

### Error de autenticación
- Verificar que el backend esté corriendo
- Revisar que `VITE_API_BASE_URL` esté configurado correctamente
- Limpiar localStorage: `localStorage.clear()`

### Error de Stripe
- Verificar `VITE_STRIPE_PUBLISHABLE_KEY` en `.env`
- Usar tarjetas de prueba válidas
- Revisar consola del navegador para errores específicos

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto es parte de un trabajo académico de la Universidad Cooperativa de Colombia.

## 👥 Autores

Desarrollado por estudiantes de IV Semestre - Ingeniería de Sistemas
Universidad Cooperativa de Colombia - 2025

## 🙏 Agradecimientos

- Universidad Cooperativa de Colombia
- Curso de Estructura de Datos
- Profesores y tutores del programa
- Comunidad open source de React y TypeScript

## 📞 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en GitHub.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
