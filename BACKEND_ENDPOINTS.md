# Endpoints del Backend Requeridos

Este documento describe los endpoints que el backend debe implementar para que el frontend funcione correctamente.

## 🔐 Autenticación

### POST `/auth/register`
Registrar nuevo usuario
```json
Request:
{
  "username": "string",
  "password": "string",
  "email": "string",
  "fullName": "string",
  "role": "FARMER" | "STORE" | "BUYER" | "ADMIN"
}

Response: 200 OK
{
  "id": 1,
  "username": "string",
  "email": "string",
  "fullName": "string",
  "role": "FARMER",
  "token": "jwt_token_here"
}
```

### POST `/auth/login`
Iniciar sesión
```json
Request:
{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "id": 1,
  "username": "string",
  "email": "string",
  "fullName": "string",
  "role": "FARMER",
  "token": "jwt_token_here"
}
```

## 📦 Productos del Marketplace

### GET `/marketplace/products`
Obtener todos los productos (público)
```json
Response: 200 OK
[
  {
    "id": 1,
    "name": "Tomate Orgánico",
    "description": "Tomates frescos cultivados orgánicamente",
    "price": 2.50,
    "unit": "kg",
    "stock": 100,
    "category": "Verduras",
    "imageUrl": "https://example.com/image.jpg",
    "farmerId": 1,
    "farmerName": "Juan Pérez",
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

### GET `/marketplace/products/{id}`
Obtener producto por ID
```json
Response: 200 OK
{
  "id": 1,
  "name": "Tomate Orgánico",
  "description": "Tomates frescos cultivados orgánicamente",
  "price": 2.50,
  "unit": "kg",
  "stock": 100,
  "category": "Verduras",
  "imageUrl": "https://example.com/image.jpg",
  "farmerId": 1,
  "farmerName": "Juan Pérez",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### POST `/marketplace/products`
Crear nuevo producto (requiere autenticación como FARMER)
```json
Request:
{
  "name": "Tomate Orgánico",
  "description": "Tomates frescos cultivados orgánicamente",
  "price": 2.50,
  "unit": "kg",
  "stock": 100,
  "category": "Verduras",
  "imageUrl": "https://example.com/image.jpg"
}

Response: 201 Created
{
  "id": 1,
  "name": "Tomate Orgánico",
  "description": "Tomates frescos cultivados orgánicamente",
  "price": 2.50,
  "unit": "kg",
  "stock": 100,
  "category": "Verduras",
  "imageUrl": "https://example.com/image.jpg",
  "farmerId": 1,
  "farmerName": "Juan Pérez",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### PUT `/marketplace/products/{id}`
Actualizar producto existente (requiere autenticación como FARMER y ser dueño del producto)
```json
Request:
{
  "name": "Tomate Orgánico Premium",
  "description": "Tomates frescos cultivados orgánicamente - Premium",
  "price": 3.00,
  "unit": "kg",
  "stock": 50,
  "category": "Verduras",
  "imageUrl": "https://example.com/image.jpg"
}

Response: 200 OK
{
  "id": 1,
  "name": "Tomate Orgánico Premium",
  "description": "Tomates frescos cultivados orgánicamente - Premium",
  "price": 3.00,
  "unit": "kg",
  "stock": 50,
  "category": "Verduras",
  "imageUrl": "https://example.com/image.jpg",
  "farmerId": 1,
  "farmerName": "Juan Pérez",
  "updatedAt": "2025-01-02T00:00:00Z"
}
```

### DELETE `/marketplace/products/{id}`
Eliminar producto (requiere autenticación como FARMER y ser dueño del producto)
```json
Response: 204 No Content
```

## 🌾 Cultivos del Agricultor

### GET `/farmers/crops`
Obtener cultivos del agricultor autenticado
```json
Response: 200 OK
[
  {
    "id": 1,
    "name": "Cultivo de Tomate",
    "cropType": "Tomate",
    "area": 1000,
    "plantingDate": "2025-01-01",
    "expectedHarvest": "2025-04-01",
    "status": "GROWING",
    "farmerId": 1
  }
]
```

### POST `/farmers/crops`
Crear nuevo cultivo
```json
Request:
{
  "name": "Cultivo de Tomate",
  "cropType": "Tomate",
  "area": 1000,
  "plantingDate": "2025-01-01",
  "expectedHarvest": "2025-04-01"
}

Response: 201 Created
{
  "id": 1,
  "name": "Cultivo de Tomate",
  "cropType": "Tomate",
  "area": 1000,
  "plantingDate": "2025-01-01",
  "expectedHarvest": "2025-04-01",
  "status": "GROWING",
  "farmerId": 1
}
```

## 🔧 Configuración de CORS

El backend DEBE permitir peticiones desde:
- `http://localhost:3000` (desarrollo)
- `https://pf-rontend.vercel.app` (producción)

Ejemplo de configuración en Spring Boot:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:3000",
                "https://pf-rontend.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## 🔐 Autenticación JWT

Todas las peticiones a endpoints protegidos deben incluir:
```
Authorization: Bearer <jwt_token>
```

## 📝 Códigos de Estado HTTP

- `200 OK`: Petición exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Eliminación exitosa
- `400 Bad Request`: Datos inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## 🐛 Solución de Problemas

### Error: "No static resource farmers/products"

Este error indica que Spring Boot está intentando servir el endpoint como un archivo estático en lugar de como una ruta de API.

**Solución:**
1. Asegúrate de que el controlador esté correctamente anotado con `@RestController` o `@Controller` + `@ResponseBody`
2. Verifica que el mapping sea correcto: `@GetMapping("/farmers/products")` o `@GetMapping("/marketplace/products")`
3. El controlador debe estar en un paquete escaneado por Spring (`@ComponentScan`)
4. Verifica que no haya conflictos con recursos estáticos

Ejemplo de controlador correcto:

```java
@RestController
@RequestMapping("/marketplace")
public class ProductController {
    
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        // Implementación
        return ResponseEntity.ok(products);
    }
    
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO productDTO) {
        // Implementación
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
}
```

## 📚 Recursos

- [Spring Boot REST API Tutorial](https://spring.io/guides/tutorials/rest/)
- [Spring Security JWT](https://www.baeldung.com/spring-security-oauth-jwt)
- [CORS Configuration](https://spring.io/guides/gs/rest-service-cors/)
