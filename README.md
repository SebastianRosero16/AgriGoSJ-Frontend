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

## Validaciones Implementadas

- Sin campos vacíos
- Sin espacios múltiples consecutivos
- Validación de email
- Contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números)
- Usernames alfanuméricos

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
