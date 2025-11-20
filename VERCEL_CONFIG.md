# Configuración de Vercel para AgriGoSJ Frontend

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, debes configurar las siguientes variables de entorno:

### Pasos para Configurar en Vercel:

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona el proyecto "pf-rontend" (o el nombre de tu proyecto)
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

```env
VITE_API_BASE_URL=https://back-agrigo.onrender.com
VITE_APP_NAME=AgriGoSJ
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_REQUEST_TIMEOUT=30000
```

### Descripción de Variables:

- **VITE_API_BASE_URL**: URL del backend desplegado en Render
- **VITE_APP_NAME**: Nombre de la aplicación
- **VITE_TOKEN_REFRESH_INTERVAL**: Intervalo de refresco del token (en milisegundos)
- **VITE_REQUEST_TIMEOUT**: Tiempo de espera para las peticiones HTTP (en milisegundos)

### Importante:

**Nota**: Las variables de entorno con prefijo `VITE_` son las únicas que Vite expone al cliente. Asegúrate de que todas tus variables de entorno tengan este prefijo.

## Re-desplegar después de Cambios

Después de agregar o modificar las variables de entorno:

1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos (...) del último deployment
3. Selecciona **Redeploy**
4. Confirma el redespliegue

O simplemente haz un nuevo commit y push al repositorio, Vercel detectará los cambios automáticamente.

## Verificar Logs

Si hay errores, revisa los logs en:
1. Ve a **Deployments**
2. Selecciona el deployment con error
3. Haz clic en **View Function Logs** o **View Build Logs**

## Configuración del Backend

Asegúrate de que tu backend en Render:
1. Tiene CORS configurado correctamente para permitir peticiones desde `pf-rontend.vercel.app`
2. Los endpoints `/farmers/products` están funcionando correctamente
3. La autenticación JWT está configurada

## Testing Local antes de Desplegar

Para probar localmente con las mismas variables de entorno de producción:

```bash
# Copia las variables de entorno
cp .env.example .env

# Edita .env y actualiza VITE_API_BASE_URL
# VITE_API_BASE_URL=https://back-agrigo.onrender.com

# Ejecuta el proyecto
npm run dev
```

## URLs Importantes

- **Frontend (Vercel)**: https://pf-rontend.vercel.app
- **Backend (Render)**: https://back-agrigo.onrender.com
- **Repositorio GitHub**: https://github.com/SebastianRosero16/AgriGoSJ-Frontend

## Solución de Problemas Comunes

### Error 500: "No static resource farmers/products"

**Causa**: El backend no está respondiendo correctamente o el endpoint no existe.

**Solución**:
1. Verifica que el backend esté activo en Render
2. Prueba el endpoint directamente: `https://back-agrigo.onrender.com/farmers/products`
3. Asegúrate de estar autenticado (token JWT válido)

### Error de CORS

**Causa**: El backend no permite peticiones desde el dominio de Vercel.

**Solución**: Configura CORS en el backend para permitir `https://pf-rontend.vercel.app`

### Variables de entorno no funcionan

**Causa**: Olvidaste el prefijo `VITE_` o no redesplegar después de agregar las variables.

**Solución**: 
1. Asegúrate de que todas las variables tengan el prefijo `VITE_`
2. Re-despliega el proyecto en Vercel
