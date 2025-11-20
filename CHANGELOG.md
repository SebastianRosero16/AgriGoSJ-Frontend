# Changelog

## [1.0.0] - 2025-11-17

### Release Inicial

#### Características Principales
- Sistema de autenticación JWT completo
- Dashboards diferenciados por rol (Farmer, Store, Buyer, Admin)
- Marketplace público con búsqueda y filtros
- Comparador de precios con algoritmo de grafos
- Recomendaciones de IA con rate limiting

#### Estructuras de Datos
- Queue: Gestión de peticiones HTTP
- Stack: Undo/Redo y navegación
- LinkedList: Renderizado eficiente
- Tree: Menús jerárquicos por rol
- Graph: Análisis de precios

#### Seguridad
- Bloqueo de navegación del navegador
- Validaciones estrictas de formularios
- Interceptores HTTP automáticos
- Refresh token automático
- Rutas protegidas por rol

#### UI/UX
- Diseño responsive mobile-first
- Tema verde personalizado
- Animaciones Tailwind
- Loading states
- Toast notifications

#### Dependencias Principales
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- Tailwind CSS 3.4.0
- React Router 6.21.0
- Axios 1.6.2
- React Hook Form 7.49.2
- Zod 3.22.4
