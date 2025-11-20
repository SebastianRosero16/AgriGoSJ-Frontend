# Funcionalidades Implementadas - AgriGoSJ Frontend

## Resumen

Este documento describe las funcionalidades completas implementadas para el módulo de Agricultor (Farmer) en la plataforma AgriGoSJ, incluyendo:

1. **Mis Cultivos** - CRUD completo con LinkedList
2. **Mis Productos** - CRUD completo con Stack para historial
3. **Recomendaciones IA** - Sistema inteligente con Queue anti-spam

---

## 1. Mis Cultivos (FarmerCrops)

### Características Implementadas

#### CRUD Completo
- **Crear Cultivo**: Formulario con validaciones completas
- **Leer Cultivos**: Lista de cultivos con LinkedList para gestión eficiente
- **Actualizar Cultivo**: Edición en línea con formulario pre-llenado
- **Eliminar Cultivo**: Confirmación antes de eliminar

#### Campos del Cultivo
```typescript
interface Crop {
  id: number;
  name: string;           // Nombre del cultivo (ej: Maíz)
  type: string;           // Tipo (ej: Cereal)
  plantedDate: string;    // Fecha de siembra
  area: number;           // Área en hectáreas
  location: string;       // Ubicación (ej: Parcela A)
  status: string;         // Estado: PLANTED | GROWING | READY | HARVESTED
  notes?: string;         // Notas adicionales
}
```

#### Interfaz de Usuario
- **Estado vacío**: Mensaje motivacional para crear primer cultivo
- **Vista de tarjetas**: Grid responsivo con información completa
- **Estados visuales**: 
  - Verde: Cosechado
  - Amarillo: Listo para cosechar
  - Azul: Creciendo
  - Gris: Plantado
- **Validaciones en tiempo real**:
  - Campos requeridos
  - Área debe ser > 0
  - Fecha de siembra válida

#### Estructura de Datos
- **LinkedList**: Gestión eficiente de la lista de cultivos
  - Inserción O(1) al final
  - Búsqueda O(n)
  - Eliminación O(n)
  - Conversión a array para renderizado

#### Integración con API
```typescript
// Endpoints utilizados
GET    /farmers/crops              // Obtener todos los cultivos
POST   /farmers/crops              // Crear cultivo
PUT    /farmers/crops/{id}         // Actualizar cultivo
DELETE /farmers/crops/{id}         // Eliminar cultivo
```

---

## 2. Mis Productos (FarmerProducts)

### Características Implementadas

#### CRUD Completo
- **Publicar Producto**: Formulario completo con todas las opciones
- **Listar Productos**: Grid con imágenes y detalles
- **Editar Producto**: Actualización de stock, precio, descripción
- **Eliminar Producto**: Confirmación y eliminación del marketplace

#### Campos del Producto
```typescript
interface Product {
  id: number;
  name: string;           // Nombre del producto
  description: string;    // Descripción detallada
  price: number;          // Precio por unidad
  stock: number;          // Cantidad disponible
  unit: string;           // Unidad: kg | lb | unit | bunch | box
  category: string;       // Categoría del producto
  imageUrl?: string;      // URL de imagen (opcional)
}
```

#### Interfaz de Usuario
- **Tarjetas con imágenes**: Placeholder si no hay imagen
- **Indicadores de stock**:
  - Verde: Stock > 10
  - Amarillo: Stock 1-10
  - Rojo: Agotado
- **Vista de precios**: Formato profesional con unidad
- **Botón de historial**: Ver últimas acciones realizadas

#### Historial de Acciones (Stack)
- **Estructura LIFO**: Última acción primero
- **Acciones registradas**:
  - Cargar productos
  - Crear nuevo producto
  - Actualizar producto
  - Eliminar producto
- **Información guardada**:
  - Tipo de acción
  - Nombre del producto
  - Timestamp preciso
- **Visualización**: Panel expandible con scroll

#### Estructura de Datos
- **Array**: Lista principal de productos
- **Stack**: Historial de acciones (LIFO - Last In First Out)
  - Push O(1) - Agregar acción
  - Pop O(1) - Remover última acción
  - Peek O(1) - Ver última acción
  - toArray() - Convertir para renderizado

#### Integración con API
```typescript
// Endpoints utilizados
GET    /farmers/products           // Obtener mis productos
POST   /farmers/products           // Publicar producto
PUT    /farmers/products/{id}      // Actualizar producto
DELETE /farmers/products/{id}      // Eliminar producto
```

#### Validaciones
- Nombre, descripción y categoría requeridos
- Precio debe ser > 0
- Stock debe ser >= 0
- URL de imagen opcional con fallback

---

## 3. Recomendaciones IA (FarmerAI)

### Características Implementadas

#### Tipos de Recomendaciones
1. **Recomendaciones de Siembra**
   - Mejor época para sembrar
   - Técnicas de siembra recomendadas
   - Rotación de cultivos

2. **Gestión de Riego**
   - Optimización de uso de agua
   - Frecuencia de riego según clima
   - Técnicas de riego eficiente

3. **Control de Plagas**
   - Identificación de plagas comunes
   - Métodos de control natural
   - Prevención de enfermedades

4. **Momento de Cosecha**
   - Indicadores de madurez
   - Mejor momento para cosechar
   - Técnicas de cosecha óptimas

#### Sistema Anti-Spam (Queue)
- **Cola de peticiones**: Gestión FIFO (First In First Out)
- **Cooldown de 3 segundos**: Previene spam de solicitudes
- **Validación en cliente**: Mensaje amigable si intenta spam
- **Procesamiento secuencial**: Una recomendación a la vez
- **Indicador visual**: Muestra cuántas solicitudes hay en cola

#### Historial de Recomendaciones (Stack)
- **Estructura LIFO**: Más recientes primero
- **Información guardada**:
  ```typescript
  interface Recommendation {
    id: string;
    type: string;
    title: string;
    content: string;
    timestamp: Date;
    priority: 'high' | 'medium' | 'low';
  }
  ```
- **Prioridades visuales**:
  - Alta: Fondo rojo
  - Media: Fondo amarillo
  - Baja: Fondo verde
- **Opción de limpieza**: Botón para limpiar historial completo

#### Interfaz de Usuario
- **Tarjetas por tipo**: 4 categorías principales
- **Estados de carga**: 
  - Spinner animado durante generación
  - Texto "Generando..."
  - Botón deshabilitado mientras procesa
- **Vista de temporada**: Muestra temporada actual automáticamente
- **Panel informativo**: Explica cómo funciona el sistema
- **Historial expandible**: Mostrar/ocultar con botón

#### 🔧 Estructuras de Datos

##### Queue (Cola de Peticiones)
```typescript
interface RequestQueue {
  type: string;
  timestamp: Date;
}
```
- **useQueue hook**: Custom hook que implementa Queue
- **Funciones**:
  - `enqueue()`: Agregar petición O(1)
  - `dequeue()`: Remover petición O(1)
  - `toArray()`: Ver estado de la cola
- **Anti-spam**: Verifica timestamp de última petición

##### Stack (Historial)
- **LIFO**: Última recomendación primero
- **Persistencia**: Durante la sesión del usuario
- **Funciones**:
  - `push()`: Agregar recomendación O(1)
  - `pop()`: Remover recomendación O(1)
  - `toArray()`: Convertir para renderizado

#### 📡 Integración con API
```typescript
// Endpoint utilizado
POST /ai/recommend
Body: {
  type: string,           // planting | irrigation | pests | harvest
  context: {
    farmerId: number,
    season: string,       // Temporada actual
    location: string,     // Ubicación del agricultor
  }
}

Response: {
  recommendation: string,
  priority: 'high' | 'medium' | 'low',
}
```

#### 🌍 Lógica de Temporadas
```typescript
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Otoño';
  if (month >= 6 && month <= 8) return 'Invierno';
  if (month >= 9 && month <= 11) return 'Primavera';
  return 'Verano';
}
```

---

## Arquitectura Técnica

### Componentes React
```
src/pages/farmer/
├── FarmerCrops.tsx       # CRUD de cultivos con LinkedList
├── FarmerProducts.tsx    # CRUD de productos con Stack
└── FarmerAI.tsx          # Recomendaciones IA con Queue + Stack
```

### Estructuras de Datos Utilizadas
```typescript
// LinkedList para cultivos
class LinkedList<T> {
  append(data: T): void
  delete(data: T): boolean
  find(predicate: (data: T) => boolean): T | null
  toArray(): T[]
}

// Stack para historial
class Stack<T> {
  push(data: T): void
  pop(): T | undefined
  peek(): T | undefined
  isEmpty(): boolean
  toArray(): T[]
}

// Queue para anti-spam
class Queue<T> {
  enqueue(data: T): void
  dequeue(): T | undefined
  peek(): T | undefined
  isEmpty(): boolean
  toArray(): T[]
}
```

### Servicios API
```typescript
// farmerService.ts
- getCrops(): Promise<Crop[]>
- createCrop(crop: CreateCropRequest): Promise<Crop>
- updateCrop(id: number, crop: UpdateCropRequest): Promise<Crop>
- deleteCrop(id: number): Promise<void>

// marketplaceService.ts
- getMyProducts(): Promise<Product[]>
- createProduct(product: CreateProductRequest): Promise<Product>
- updateProduct(id: number, product: UpdateProductRequest): Promise<Product>
- deleteProduct(id: number): Promise<void>

// aiService.ts
- getRecommendation(params: { type: string; context: any }): Promise<any>
```

### Custom Hooks
```typescript
// useQueue hook
const useQueue = <T>() => {
  const queue = new Queue<T>();
  return {
    enqueue: (item: T) => queue.enqueue(item),
    dequeue: () => queue.dequeue(),
    toArray: () => queue.toArray(),
  };
}
```

---

## Características Destacadas

### 1. **Validaciones Robustas**
- Validación en cliente antes de enviar
- Mensajes de error en español
- Prevención de campos vacíos
- Validación de tipos numéricos

### 2. **Experiencia de Usuario**
- Toast notifications con react-toastify
- Estados de carga con spinners
- Confirmaciones antes de eliminar
- Estados vacíos con llamados a la acción

### 3. **Rendimiento**
- Lazy loading de componentes
- Estructuras de datos eficientes
- Memoización donde es necesario
- Renderizado condicional

### 4. **Responsive Design**
- Grid adaptativo (1-2-3 columnas)
- Formularios responsive
- Tarjetas con hover effects
- Mobile-friendly

### 5. **Manejo de Errores**
- Try-catch en todas las peticiones API
- Mensajes de error descriptivos
- Fallbacks para imágenes rotas
- Normalización de errores del backend

---

## Despliegue

### Producción
- **URL**: https://pf-rontend.vercel.app
- **Plataforma**: Vercel
- **Build**: Automático desde GitHub
- **Última versión**: Commit `43e4514`

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_REQUEST_TIMEOUT=30000
VITE_APP_NAME=AgriGoSJ
```

---

## Dependencias Principales

```json
{
  "react": "18.2.0",
  "react-router-dom": "6.21.0",
  "react-toastify": "9.1.3",
  "axios": "1.6.5",
  "typescript": "5.2.2",
  "vite": "5.0.8",
  "tailwindcss": "3.4.0"
}
```

---

## Estado Actual

### Completado
- [x] CRUD completo de Cultivos con LinkedList
- [x] CRUD completo de Productos con Stack para historial
- [x] Sistema de Recomendaciones IA con Queue anti-spam
- [x] Integración con API backend
- [x] Validaciones completas en formularios
- [x] Manejo de errores robusto
- [x] Estados de carga y vacíos
- [x] Responsive design
- [x] Despliegue en producción

### Pendiente
- [ ] Tests unitarios para componentes
- [ ] Tests de integración para API
- [ ] Caché de recomendaciones IA
- [ ] Paginación para listas grandes
- [ ] Filtros y búsqueda avanzada
- [ ] Exportación de datos (PDF/Excel)
- [ ] Notificaciones push

---

## Notas Técnicas

### Decisiones de Diseño

1. **LinkedList para Cultivos**: Permite inserción/eliminación eficiente sin reorganizar toda la lista
2. **Stack para Historial de Productos**: LIFO es perfecto para ver últimas acciones primero
3. **Queue para Anti-Spam IA**: FIFO asegura procesamiento ordenado y previene sobrecarga
4. **useQueue Hook**: Encapsula la lógica de cola para reutilización

### Mejoras Futuras

1. **Optimistic Updates**: Actualizar UI antes de confirmar con API
2. **Undo/Redo**: Usar Stack para deshacer acciones
3. **Búsqueda Avanzada**: Implementar Trie para autocompletado
4. **Ordenamiento**: Implementar múltiples algoritmos de sorting
5. **Caché Inteligente**: Map para caché con TTL

---

## Contacto

**Desarrollador**: Sebastian Rosero  
**Proyecto**: AgriGoSJ Frontend  
**Universidad**: Universidad de Nariño  
**Semestre**: IV Semestre - Estructura de Datos  

---

## Estructuras de Datos Aplicadas

Este proyecto demuestra el uso práctico de estructuras de datos en una aplicación real:

1. **LinkedList**: Gestión dinámica de cultivos
2. **Stack**: Historial de acciones (LIFO)
3. **Queue**: Control de peticiones (FIFO)
4. **Arrays**: Renderizado de listas
5. **Maps**: Caché de datos (futuro)
6. **Sets**: Eliminación de duplicados (futuro)

Cada estructura fue elegida específicamente por sus características de rendimiento y casos de uso óptimos.
