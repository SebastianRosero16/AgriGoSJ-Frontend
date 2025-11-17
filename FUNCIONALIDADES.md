# Funcionalidades por Rol - AgriGoSJ

## 🌾 FARMER (Agricultor)

### Dashboard Principal (`/farmer/dashboard`)

**Resumen de Información:**
- Total de cultivos activos
- Recomendaciones pendientes de IA
- Productos publicados en marketplace
- Gráficos de producción

### Gestión de Cultivos (`/farmer/crops`)

**Funcionalidades:**
- ✅ **Crear nuevo cultivo**: Formulario con validaciones
  - Nombre del cultivo (obligatorio)
  - Tipo de cultivo (selección)
  - Fecha de siembra (date picker)
  - Área cultivada (hectáreas)
  - Ubicación (texto)
  - Estado (En crecimiento, Listo para cosecha, etc.)
  - Notas adicionales (opcional)

- ✅ **Listar cultivos**: Table con búsqueda y filtros
  - Búsqueda por nombre
  - Filtro por tipo
  - Filtro por estado
  - Ordenamiento por fecha, área, etc.

- ✅ **Editar cultivo**: Actualización de información
  - Todos los campos editables
  - Validaciones en tiempo real

- ✅ **Eliminar cultivo**: Confirmación antes de eliminar
  - Modal de confirmación
  - Toast de éxito/error

**Estructura de Datos Aplicada:**
- **LinkedList**: Historial de cambios en cada cultivo
- **Stack**: Pila de últimas acciones para deshacer

### Recomendaciones IA (`/farmer/ai`)

**Funcionalidades:**
- ✅ **Solicitar recomendación**: Formulario inteligente
  - Seleccionar cultivo
  - Tipo de recomendación:
    - Fertilización
    - Control de plagas
    - Riego
    - Cosecha
    - Prevención de enfermedades
  - Contexto adicional (opcional)

- ✅ **Ver historial**: Lista de recomendaciones pasadas
  - Filtro por cultivo
  - Filtro por tipo
  - Ordenamiento por fecha
  - Detalles completos de cada recomendación

- ✅ **Anti-spam**: Sistema de cola para prevenir múltiples requests
  - Cooldown de 5 segundos entre solicitudes
  - Indicador visual de tiempo restante
  - Toast de advertencia si intenta spamear

**Estructura de Datos Aplicada:**
- **Queue**: Cola de solicitudes pendientes al servicio IA
- **Stack**: Historial de recomendaciones recientes

### Productos en Marketplace (`/farmer/products`)

**Funcionalidades:**
- ✅ **Publicar producto**: Formulario de creación
  - Nombre del producto
  - Descripción detallada
  - Precio por unidad
  - Cantidad disponible
  - Unidad de medida (kg, unidades, etc.)
  - Categoría
  - URL de imagen (opcional)
  - Disponibilidad (toggle)

- ✅ **Gestionar productos**: CRUD completo
  - Listar todos los productos
  - Editar precio, stock, disponibilidad
  - Marcar como no disponible
  - Eliminar producto

- ✅ **Estadísticas de ventas**:
  - Total de productos publicados
  - Productos más vendidos
  - Ingresos totales

**Estructura de Datos Aplicada:**
- **Tree**: Categorización jerárquica de productos
- **LinkedList**: Lista de productos ordenada por popularidad

---

## 🏪 STORE (Agrotienda)

### Dashboard Principal (`/store/dashboard`)

**Resumen de Información:**
- Total de insumos en catálogo
- Stock bajo (alertas)
- Pedidos pendientes
- Ventas del mes

### Gestión de Insumos (`/store/inputs`)

**Funcionalidades:**
- ✅ **Agregar insumo**: Formulario de registro
  - Nombre del insumo
  - Tipo (fertilizante, pesticida, herramienta, etc.)
  - Descripción
  - Precio
  - Stock actual
  - Unidad de medida
  - Stock mínimo (para alertas)

- ✅ **Control de inventario**: Tabla dinámica
  - Búsqueda por nombre
  - Filtro por tipo
  - Filtro por stock (bajo, normal, alto)
  - Alertas visuales de stock bajo
  - Actualización rápida de precios
  - Actualización rápida de stock

- ✅ **Historial de movimientos**:
  - Registro de entradas
  - Registro de salidas
  - Ajustes de inventario

**Estructura de Datos Aplicada:**
- **LinkedList**: Historial de movimientos de inventario
- **Stack**: Pila de últimas actualizaciones

### Gestión de Pedidos (`/store/orders`)

**Funcionalidades:**
- ✅ **Ver pedidos**: Lista de pedidos recibidos
  - Estado: Pendiente, Procesando, Completado, Cancelado
  - Detalles del comprador
  - Productos solicitados
  - Total del pedido

- ✅ **Procesar pedidos**:
  - Cambiar estado
  - Agregar notas
  - Notificar al comprador

- ✅ **Estadísticas**:
  - Pedidos por día/semana/mes
  - Productos más solicitados
  - Clientes frecuentes

**Estructura de Datos Aplicada:**
- **Queue**: Cola de pedidos pendientes (FIFO)
- **Tree**: Árbol de estados de pedidos

### Comparador de Precios (Visible para todos)

**Funcionalidades:**
- ✅ **Ver precios de competencia**:
  - Comparación de precios del mismo insumo
  - Estadísticas: Min, Max, Promedio
  - Posicionamiento de mi precio

**Estructura de Datos Aplicada:**
- **Graph**: Grafo de tiendas y productos con algoritmos BFS/DFS

---

## 🛒 BUYER (Comprador)

### Dashboard Principal (`/buyer/dashboard`)

**Resumen de Información:**
- Pedidos recientes
- Productos favoritos
- Historial de compras
- Recomendaciones personalizadas

### Marketplace (`/buyer/marketplace`)

**Funcionalidades:**
- ✅ **Explorar productos**: Catálogo completo
  - Búsqueda por nombre
  - Filtro por categoría
  - Filtro por rango de precios
  - Filtro por disponibilidad
  - Ordenamiento por precio, popularidad, fecha

- ✅ **Detalles de producto**:
  - Información completa
  - Imágenes
  - Vendedor (agricultor)
  - Reviews y calificaciones

- ✅ **Agregar al carrito**:
  - Selección de cantidad
  - Cálculo automático de total
  - Validación de stock disponible

**Estructura de Datos Aplicada:**
- **LinkedList**: Lista de productos en el marketplace
- **Tree**: Categorías de productos jerárquicas
- **Stack**: Historial de productos vistos

### Carrito de Compras (`/buyer/cart`)

**Funcionalidades:**
- ✅ **Gestionar carrito**:
  - Ver items agregados
  - Modificar cantidades
  - Eliminar productos
  - Ver subtotales

- ✅ **Checkout**:
  - Resumen de compra
  - Selección de método de pago
  - Dirección de entrega
  - Confirmación de pedido

**Estructura de Datos Aplicada:**
- **LinkedList**: Lista de items en carrito
- **Stack**: Historial de acciones para deshacer

### Historial de Pedidos

**Funcionalidades:**
- ✅ **Ver pedidos pasados**:
  - Estado de cada pedido
  - Detalles completos
  - Opción de repetir pedido
  - Calificar productos y vendedores

**Estructura de Datos Aplicada:**
- **LinkedList**: Historial cronológico de pedidos

---

## ⚙️ ADMIN (Administrador)

### Dashboard Principal (`/admin/dashboard`)

**Resumen de Información:**
- Total de usuarios por rol
- Actividad del sistema
- Reportes generales
- Métricas clave

### Gestión de Usuarios (`/admin/users`)

**Funcionalidades:**
- ✅ **Listar usuarios**: Tabla completa
  - Filtro por rol
  - Búsqueda por username/email
  - Estado activo/inactivo

- ✅ **Editar usuario**:
  - Cambiar rol
  - Activar/desactivar cuenta
  - Resetear contraseña

- ✅ **Eliminar usuario**:
  - Confirmación de seguridad
  - Registro de auditoría

**Estructura de Datos Aplicada:**
- **Tree**: Estructura jerárquica de roles y permisos
- **Graph**: Relaciones entre usuarios y acciones

### Reportes y Estadísticas (`/admin/reports`)

**Funcionalidades:**
- ✅ **Reportes generales**:
  - Usuarios registrados por periodo
  - Transacciones totales
  - Productos más vendidos
  - Insumos más comprados
  - Recomendaciones IA generadas

- ✅ **Exportación**:
  - Descargar reportes en CSV/PDF
  - Generar gráficos

**Estructura de Datos Aplicada:**
- **Tree**: Árbol de categorías de reportes
- **Graph**: Análisis de relaciones entre entidades

### Configuración del Sistema

**Funcionalidades:**
- ✅ **Configuraciones globales**:
  - Parámetros de la aplicación
  - Límites y restricciones
  - Notificaciones

- ✅ **Mantenimiento**:
  - Limpieza de caché
  - Logs del sistema
  - Backups

---

## 🌐 Funcionalidades Públicas (Sin Autenticación)

### Marketplace Público (`/marketplace`)

**Funcionalidades:**
- Ver productos disponibles
- Búsqueda y filtros básicos
- Ver detalles de productos
- Invitación a registrarse para comprar

### Comparador de Precios (`/price-comparator`)

**Funcionalidades:**
- Comparar precios de insumos entre tiendas
- Ver estadísticas de precios
- Filtros por tipo de insumo
- Visualización con Graph (BFS/DFS)

---

## 📊 Estructuras de Datos en Acción

### Queue (Cola)
- Solicitudes de recomendaciones IA (anti-spam)
- Cola de pedidos en tiendas (FIFO)
- Procesamiento de requests HTTP

### Stack (Pila)
- Historial de acciones (deshacer/rehacer)
- Navegación de breadcrumbs
- Historial de productos vistos

### LinkedList (Lista Enlazada)
- Historial de cambios en cultivos
- Lista de productos en marketplace
- Historial de movimientos de inventario
- Items en carrito de compras

### Tree (Árbol)
- Categorías de productos jerárquicas
- Estructura de roles y permisos
- Menús de navegación dinámicos
- Estados de pedidos

### Graph (Grafo)
- Comparador de precios (nodos: tiendas/productos)
- Relaciones entre usuarios y acciones
- Algoritmos BFS/DFS para búsqueda óptima

---

## 🔐 Seguridad y Validaciones

### Validaciones en Formularios
- ✅ Anti-espacios en campos de texto
- ✅ Campos obligatorios
- ✅ Formato de email válido
- ✅ Longitud mínima/máxima
- ✅ Caracteres especiales bloqueados

### Protección de Rutas
- ✅ JWT Token en todas las peticiones
- ✅ Redirección automática si no autenticado
- ✅ Verificación de rol en cada ruta protegida
- ✅ Prevención de navegación hacia atrás después del login

### Anti-Spam
- ✅ Cooldown en solicitudes IA (Queue)
- ✅ Rate limiting en requests HTTP
- ✅ Debounce en búsquedas (500ms)

---

## 🎨 UI/UX

### Componentes Reutilizables
- Button (primary, secondary, danger)
- Input (text, email, password, number)
- Card (contenedor con shadow)
- Loading (spinner animado)
- Toast notifications (éxito, error, advertencia)

### Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Tailwind CSS utilities

### Animaciones
- ✅ Transiciones suaves
- ✅ Loading states
- ✅ Hover effects
- ✅ Skeleton loaders

---

## 📦 Deploy y Configuración

### Local Development
```bash
npm run dev  # http://localhost:5173
```

### Production (Vercel)
```
URL: https://pf-rontend-lh091mcep-sebatian-roseros-projects.vercel.app
```

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=AgriGoSJ
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_REQUEST_TIMEOUT=30000
```
