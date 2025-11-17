# AgriGoSJ - Frontend

Plataforma Agrícola Inteligente de San José

## 🌾 Descripción

AgriGoSJ es una plataforma web moderna para conectar agricultores, agrotiendas y compradores en un ecosistema digital agrícola. Desarrollada con React, TypeScript y estructuras de datos avanzadas.

## 🚀 Tecnologías Principales

- **React 18.2** - Biblioteca UI
- **TypeScript 5.2** - Tipado estático
- **Vite 5.0** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router 6** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Validación de formularios
- **React Toastify** - Notificaciones

## 📦 Estructuras de Datos Implementadas

### Queue (Cola)
- **Uso**: Gestión de peticiones HTTP y rate limiting de IA
- **Complejidad**: O(1) enqueue/dequeue

### Stack (Pila)
- **Uso**: Undo/Redo de operaciones y navegación
- **Complejidad**: O(1) push/pop

### LinkedList (Lista Enlazada)
- **Uso**: Renderizado eficiente de productos en marketplace
- **Variantes**: Simple, Doble, Circular

### Tree (Árbol)
- **Uso**: Menús de navegación por rol
- **Implementación**: BST para categorías

### Graph (Grafo)
- **Uso**: Comparador de precios con algoritmos BFS/DFS
- **Funcionalidad**: Encontrar mejores precios

## 🏗️ Arquitectura del Proyecto

```
src/
├── api/              # Servicios HTTP
├── components/       # Componentes reutilizables
├── context/          # Contextos React
├── data-structures/  # Estructuras de datos
├── hooks/            # Custom hooks
├── pages/            # Páginas de la app
├── types/            # Definiciones TypeScript
└── utils/            # Utilidades y helpers
```

## 🔐 Características de Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Interceptores HTTP automáticos
- ✅ Bloqueo del botón "atrás" del navegador después del login
- ✅ Rutas protegidas por rol (FARMER, STORE, BUYER, ADMIN)
- ✅ Validaciones estrictas anti-espacios múltiples

## 🎯 Validaciones Implementadas

- Sin campos vacíos
- Sin espacios múltiples consecutivos
- Validación de email
- Contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números)
- Usernames alfanuméricos

## 📱 Roles del Sistema

### 🌾 FARMER (Agricultor)
- Gestión de cultivos
- Publicación de productos
- Recomendaciones de IA

### 🏪 STORE (Agrotienda)
- Gestión de insumos agrícolas
- Control de inventario
- Gestión de precios

### 🛒 BUYER (Comprador)
- Exploración de marketplace
- Comparación de precios
- Compra de productos

### 👨‍💼 ADMIN (Administrador)
- Gestión de usuarios
- Reportes del sistema
- Administración general

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/SebastianRosero16/AgriGoSJ-Frontend.git
cd AgriGoSJ-Frontend
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

## 📜 Scripts Disponibles

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
  - `/api/price-comparator/compare`

## 🎨 Diseño UI

- **Colores primarios**: Tonos verdes (agricultura)
- **Responsive**: Mobile-first design
- **Accesibilidad**: Navegación por teclado
- **Dark mode**: Preparado (próximamente)

## 🧪 Algoritmos Implementados

- **Binary Search**: Búsqueda eficiente O(log n)
- **Quick Sort**: Ordenamiento O(n log n)
- **Merge Sort**: Ordenamiento estable
- **BFS/DFS**: Grafos para comparador de precios
- **Fuzzy Search**: Búsqueda aproximada
- **Dijkstra**: Camino más corto (precios)

## 📝 Convenciones de Código

- **Idioma**: Código en inglés, UI en español
- **Naming**: camelCase para variables, PascalCase para componentes
- **Imports**: Usar path aliases (@/...)
- **Validaciones**: Siempre validar inputs del usuario

## 👥 Autor

**Sebastian Rosero**
- GitHub: [@SebastianRosero16](https://github.com/SebastianRosero16)
- Email: sebastian.manchabajo@campusucc.edu.co

## 📄 Licencia

Este proyecto es parte de un trabajo académico de la Universidad Cooperativa de Colombia.

## 🙏 Agradecimientos

- Universidad Cooperativa de Colombia
- Curso de Estructura de Datos
- IV Semestre - 2025
