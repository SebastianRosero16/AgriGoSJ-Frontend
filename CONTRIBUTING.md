# Contribuir a AgriGoSJ Frontend

¡Gracias por tu interés en contribuir! 🎉

## 📋 Tabla de Contenidos
- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Guía de Estilo](#guía-de-estilo)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

## 📜 Código de Conducta

Este proyecto sigue principios de respeto y colaboración profesional.

## 🤝 ¿Cómo Contribuir?

### Reportar Bugs
1. Verifica que el bug no haya sido reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

### Proponer Nuevas Características
1. Crea un issue describiendo la característica
2. Explica el caso de uso
3. Espera feedback antes de implementar

### Enviar Pull Requests
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-caracteristica`
3. Haz commits descriptivos
4. Push a tu fork: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 🎨 Guía de Estilo

### Código
- **Idioma**: Código en inglés, comentarios y UI en español
- **Formato**: 2 espacios de indentación
- **Naming**:
  - Variables y funciones: `camelCase`
  - Componentes: `PascalCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Archivos: `PascalCase.tsx` para componentes

### TypeScript
- Siempre tipar variables y funciones
- Evitar `any`, usar tipos específicos
- Preferir interfaces sobre types cuando sea posible
- Usar enums para valores constantes

### React
- Componentes funcionales con hooks
- Props destructuradas en la firma
- Usar memo() solo cuando sea necesario
- Custom hooks para lógica reutilizable

### CSS/Tailwind
- Usar clases de Tailwind cuando sea posible
- Nombres de clases custom en inglés
- Mobile-first approach
- Evitar CSS inline

## 📝 Commits

### Formato
```
<tipo>: <descripción breve en español>

<descripción detallada opcional>
```

### Tipos de Commit
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento
- `perf`: Mejoras de rendimiento

### Ejemplos
```bash
feat: Agregar filtro de búsqueda en marketplace
fix: Corregir validación de email en registro
docs: Actualizar README con nuevas instrucciones
refactor: Simplificar lógica de autenticación
```

## 🔍 Pull Requests

### Antes de Enviar
- ✅ El código compila sin errores
- ✅ No hay warnings en consola
- ✅ Las validaciones funcionan correctamente
- ✅ El código sigue las convenciones
- ✅ Commits descriptivos y en español

### Template de PR
```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Refactorización
- [ ] Documentación

## Checklist
- [ ] Código compilado sin errores
- [ ] Sin warnings en consola
- [ ] Validaciones probadas
- [ ] README actualizado si es necesario
```

## 🧪 Testing

Antes de enviar un PR:
1. Ejecuta `npm run dev` y verifica que no hay errores
2. Prueba la funcionalidad manualmente
3. Verifica la consola del navegador (F12)

## 📞 Contacto

Para preguntas o dudas:
- **Email**: sebastian.manchabajo@campusucc.edu.co
- **GitHub**: [@SebastianRosero16](https://github.com/SebastianRosero16)

¡Gracias por contribuir! 🚀
