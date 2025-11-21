# AgriGoSJ - Frontend

Plataforma Agrícola Inteligente de San José

**Backend API**: https://web-production-a81779.up.railway.app

## Descripción

AgriGoSJ es una plataforma web moderna para conectar agricultores, agrotiendas y compradores en un ecosistema digital agrícola. Desarrollada con React, TypeScript y estructuras de datos avanzadas.

## Tecnologías Principales

- **React 18.2** - Biblioteca UI
- **TypeScript 5.2** - Tipado estático
- **Vite 5.0** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router 6** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Validación de formularios
- **React Toastify** - Notificaciones
- **Stripe** - Pasarela de pagos
- **Zustand** - Gestión de estado global

## Estructuras de Datos Implementadas

### Queue (Cola)
- **Uso**: Gestión de peticiones HTTP y rate limiting de IA
- **Complejidad**: O(1) enqueue/dequeue

### Stack (Pila)
- **Uso**: Undo/Redo de operaciones y navegación
- **Complejidad**: O(1) push/pop

### Graph (Grafo)
- **Uso**: Comparador de precios con algoritmos BFS/DFS
## Arquitectura del Proyecto

├── api/              # Servicios HTTP
├── components/       # Componentes reutilizables
├── hooks/            # Custom hooks
├── pages/            # Páginas de la app
```

- ✅ Autenticación JWT con refresh tokens
- ✅ Interceptores HTTP automáticos
- ✅ Bloqueo del botón "atrás" del navegador después del login
- ✅ Rutas protegidas por rol (FARMER, STORE, BUYER, ADMIN)
- ✅ Validaciones estrictas anti-espacios múltiples

## 🛒 Sistema de Compras

### Características Principales
- ✅ **Compra sin restricciones**: Cualquier usuario autenticado puede comprar cualquier producto
- ✅ **Carrito de compras**: Sistema completo con persistencia en localStorage
- ✅ **Marketplace del Comprador**: Sección dedicada para usuarios BUYER
- ✅ **Dos formas de comprar**:
  - Compra rápida (un producto)
  - Compra múltiple (carrito con varios productos)
- ✅ **Pago con Stripe**: Integración completa y segura
- ✅ **Validaciones en tiempo real**: Dirección, teléfono, cantidad

### Marketplaces Disponibles
1. **Marketplace Público** (`/marketplace`) - Acceso para todos los usuarios
2. **Marketplace del Comprador** (`/buyer/marketplace`) - Exclusivo para BUYER con carrito integrado

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

## Roles del Sistema

### STORE (Agrotienda)
- Exploración de marketplace
- Comparación de precios
- Compra de productos
- Reportes del sistema
- Administración general
### Requisitos Previos
- Node.js 18+

1. **Clonar el repositorio**
```

2. **Instalar dependencias**
# o usar el script Windows
install.bat
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=AgriGoSJ
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

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
- **Endpoints principales**:
  - `/auth/login`
  - `/auth/register`
  - `/api/farmer/crops`
  - `/api/store/inputs`
  - `/api/marketplace/products`
  - `/api/ai/recommend`

- **Colores primarios**: Tonos verdes (agricultura)
- **Responsive**: Mobile-first design
- **Accesibilidad**: Navegación por teclado
- **Dark mode**: Preparado (próximamente)

## 🧪 Algoritmos Implementados

- **Binary Search**: Búsqueda eficiente O(log n)
- **Dijkstra**: Camino más corto (precios)


## 👥 Autor

## 📄 Licencia

## 🙏 Agradecimientos

- Universidad Cooperativa de Colombia
- Curso de Estructura de Datos
- IV Semestre - 2025

## Scripts Disponibles
