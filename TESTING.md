# Guía de Pruebas - AgriGoSJ Frontend

## 🧪 Pruebas de Autenticación y Navegación por Rol

### Prerequisitos

1. **Backend en ejecución**: Asegúrate de que el backend Spring Boot esté corriendo en `http://localhost:8080`
2. **Base de datos**: MySQL configurado con la base de datos `basedatos`
3. **Frontend local**: `npm run dev` corriendo en `http://localhost:5173`

### Usuarios de Prueba en Base de Datos

Según la captura proporcionada, estos son los usuarios registrados:

```
1. Usuario: farmer1@agrigo.com
   Contraseña: $2a$10$I2q3RCuZCaczQjWQow6AuJZEo1UjAsFBfyP-Cfyk6TmL6bEu2YtQi (encriptada)
   Rol: FARMER

2. Usuario: store1@agrigo.com  
   Contraseña: $2a$10$Bgj0it8opjLCzRxJEkyvn3Qwm3QuerBfeBZbW8v6gZMj-YeCXqr-m (encriptada)
   Rol: STORE

3. Usuario: admin@agrigo.com
   Contraseña: $2a$10$i8b94jVEJO)1UHsr4bPiFCfy2KjLxvi8m4SIYQCNrQKP'ILtO!3X (encriptada)
   Rol: ADMIN

4. Usuario: SebasR
   Contraseña: (la que registraste - encriptada en BD)
   Rol: null (este es el problema)
```

### Problema Identificado ❌

El usuario `SebasR` tiene `role: null` en la base de datos, por lo que no se puede redirigir correctamente.

### Solución 🔧

**Opción 1: Actualizar el rol en la base de datos**

```sql
-- En MySQL Workbench, ejecuta:
UPDATE users 
SET role = 'FARMER'  -- o 'STORE', 'BUYER', 'ADMIN' según corresponda
WHERE username = 'SebasR';
```

**Opción 2: Registrar nuevo usuario**

1. Ir a `/register`
2. Llenar el formulario:
   - Usuario: `TestFarmer`
   - Email: `test@farmer.com`
   - Contraseña: `Test123456`
   - Nombre Completo: `Test Farmer`
   - **Rol: FARMER** (¡IMPORTANTE!)
3. Click en "Registrarse"
4. Automáticamente debería redirigir a `/farmer/dashboard`

### Flujo de Prueba por Rol

#### 🌾 FARMER (Agricultor)
```
1. Registro/Login con rol FARMER
2. Redirección a: /farmer/dashboard
3. Funcionalidades disponibles:
   - Gestión de cultivos
   - Recomendaciones IA
   - Publicación de productos
```

#### 🏪 STORE (Agrotienda)
```
1. Registro/Login con rol STORE
2. Redirección a: /store/dashboard
3. Funcionalidades disponibles:
   - Gestión de insumos
   - Control de inventario
   - Pedidos
```

#### 🛒 BUYER (Comprador)
```
1. Registro/Login con rol BUYER
2. Redirección a: /buyer/dashboard
3. Funcionalidades disponibles:
   - Marketplace de productos
   - Carrito de compras
   - Historial de pedidos
```

#### ⚙️ ADMIN (Administrador)
```
1. Registro/Login con rol ADMIN
2. Redirección a: /admin/dashboard
3. Funcionalidades disponibles:
   - Gestión de usuarios
   - Reportes generales
   - Configuración del sistema
```

### Verificación de Logs en Consola (F12)

Al iniciar sesión, deberías ver en la consola del navegador:

```javascript
Login response: {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: 4,
    username: "SebasR",
    email: "sebastianorlando28@gmail.com",
    role: "FARMER", // ← DEBE TENER UN VALOR
    fullName: "SebasR",
    createdAt: "2024-11-17T...",
    updatedAt: null
  }
}

Auth state changed: {
  isAuthenticated: true,
  user: { ... }
}

getDashboardByRole called with role: FARMER
Redirecting to FARMER dashboard
```

### Problemas Comunes y Soluciones

#### ❌ No redirige después del login
**Causa**: `role` es `null` en la BD
**Solución**: Ejecuta el UPDATE SQL arriba

#### ❌ Token no se guarda
**Causa**: LocalStorage bloqueado
**Solución**: Verifica permisos del navegador

#### ❌ Error 401 Unauthorized
**Causa**: Backend no retorna token válido
**Solución**: Verifica configuración JWT en backend

#### ❌ Redirige siempre a /farmer
**Causa**: Rol no se está leyendo correctamente
**Solución**: Verifica logs de consola y estructura de respuesta

### Estructura de Respuesta Esperada del Backend

```json
POST /api/auth/login
{
  "username": "SebasR",
  "password": "tu_password"
}

Response 200 OK:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 4,
    "username": "SebasR", 
    "email": "sebastianorlando28@gmail.com",
    "role": "FARMER",           // ← CRÍTICO: No debe ser null
    "fullName": "SebasR",
    "createdAt": "2024-11-17T17:35:05",
    "updatedAt": null
  }
}
```

### Validaciones Implementadas ✅

- ✅ Anti-espacios en campos de texto
- ✅ Campos requeridos obligatorios
- ✅ Formato de email válido
- ✅ Prevención de navegación hacia atrás (popstate)
- ✅ Redirección automática según rol
- ✅ Protección de rutas por rol
- ✅ Token JWT en localStorage
- ✅ Interceptor para agregar token en requests

### Testing en Producción (Vercel)

**URL**: https://pf-rontend-lh091mcep-sebatian-roseros-projects.vercel.app

**Nota**: Para que funcione en producción, necesitas:
1. Configurar `VITE_API_BASE_URL` en Vercel Dashboard apuntando a tu backend en producción
2. Backend desplegado con CORS habilitado para el dominio de Vercel
3. Base de datos accesible desde el backend en producción

### Variables de Entorno para Vercel

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_BASE_URL = https://tu-backend.herokuapp.com
VITE_APP_NAME = AgriGoSJ
VITE_TOKEN_REFRESH_INTERVAL = 840000
VITE_REQUEST_TIMEOUT = 30000
```

### Comandos Útiles

```bash
# Ejecutar frontend localmente
npm run dev

# Ver logs en tiempo real
# Abre DevTools (F12) → Console

# Limpiar localStorage (si hay problemas)
# En console del navegador:
localStorage.clear()
location.reload()

# Build de producción local
npm run build
npm run preview
```

### Checklist de Pruebas ✓

- [ ] Usuario puede registrarse con todos los roles
- [ ] Usuario con rol FARMER redirige a `/farmer/dashboard`
- [ ] Usuario con rol STORE redirige a `/store/dashboard`
- [ ] Usuario con rol BUYER redirige a `/buyer/dashboard`
- [ ] Usuario con rol ADMIN redirige a `/admin/dashboard`
- [ ] No se puede acceder a rutas protegidas sin autenticación
- [ ] No se puede acceder a rutas de otros roles
- [ ] Botón "Atrás" del navegador no funciona después del login
- [ ] Token se guarda en localStorage
- [ ] Logout limpia token y redirige a `/login`
- [ ] No aparecen errores en consola (F12)

### Contacto de Soporte

Si encuentras algún problema:
1. Abre DevTools (F12)
2. Captura los logs de la consola
3. Captura el error en la pestaña Network
4. Verifica el payload de la respuesta del backend
