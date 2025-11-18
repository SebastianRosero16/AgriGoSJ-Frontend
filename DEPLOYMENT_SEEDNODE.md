# Despliegue en Seednode - AgriGoSJ Frontend

## 📋 Instrucciones de Despliegue

### 1. Crear Cuenta en Seednode
- Ve a: https://seednode.com (o la plataforma similar que uses)
- Crea una cuenta gratuita

### 2. Conectar Repositorio GitHub
1. Haz clic en "New Project" o "Import Project"
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio: **SebastianRosero16/AgriGoSJ-Frontend**
4. Selecciona la rama: **master**

### 3. Configurar Variables de Entorno

Agrega las siguientes variables de entorno en la configuración del proyecto:

```
VITE_API_BASE_URL=https://back-agrigo.onrender.com
VITE_APP_NAME=AgriGoSJ
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_REQUEST_TIMEOUT=30000
```

**IMPORTANTE:** Asegúrate de que todas las variables tengan el prefijo `VITE_`

### 4. Configuración de Build

Si Seednode no detecta automáticamente la configuración:

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `dist`
- **Node Version:** 18.x

### 5. Desplegar

1. Haz clic en "Deploy"
2. Espera 2-3 minutos mientras se construye el proyecto
3. Una vez completado, recibirás una URL como: `https://tu-proyecto.seednode.app`

### 6. Configurar CORS en el Backend

Una vez que tengas tu URL de Seednode, debes actualizar el backend para permitir peticiones desde esa URL:

1. Ve a tu backend en Render
2. Agrega la nueva URL a la configuración de CORS
3. Ejemplo: `https://tu-proyecto.seednode.app`

## ✅ Verificación

Una vez desplegado:

1. Abre tu nueva URL de Seednode
2. Inicia sesión con tu usuario agricultor
3. Ve a "Mis Productos"
4. Intenta crear un producto
5. Verifica en la consola (F12) que los datos se envíen correctamente

## 🔧 Troubleshooting

### Error de CORS
Si ves errores de CORS, asegúrate de que el backend permite tu nueva URL de Seednode.

### Variables de Entorno no Funcionan
Verifica que todas las variables tengan el prefijo `VITE_` y que hayas hecho redeploy después de agregarlas.

### Error 404 en Rutas
El archivo `_redirects` debería manejar esto. Si no funciona, verifica que esté en la carpeta `public/`.

## 📝 Notas Adicionales

- Los cambios en GitHub se desplegarán automáticamente
- Puedes ver los logs de build en el dashboard de Seednode
- El proyecto usa las mismas validaciones y configuraciones que funcionaron en local

## 🚀 URLs Importantes

- **Frontend (Seednode):** [Tu URL aquí después del deploy]
- **Backend (Render):** https://back-agrigo.onrender.com
- **Repositorio GitHub:** https://github.com/SebastianRosero16/AgriGoSJ-Frontend
