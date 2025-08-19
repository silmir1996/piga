# 🚀 Pull Request - Framework de Testing E2E

## 📋 Descripción

<!-- Proporciona una descripción clara y concisa de los cambios realizados -->

### Tipo de Cambio

- [ ] 🐛 **Bug fix** (cambio que corrige un problema)
- [ ] ✨ **Nueva funcionalidad** (cambio que agrega una nueva característica)
- [ ] 📝 **Documentación** (cambio en la documentación)
- [ ] 🎨 **Refactorización** (cambio que no corrige un bug ni agrega funcionalidad)
- [ ] ⚡ **Mejora de rendimiento** (cambio que mejora el rendimiento)
- [ ] ✅ **Test** (agregar o corregir tests)
- [ ] 🔧 **Configuración** (cambio en archivos de configuración)
- [ ] 🚀 **Deploy** (cambio relacionado con deployment)

### Área Afectada

- [ ] **Abonos** - Pruebas relacionadas con abonos
- [ ] **Autenticación** - Pruebas de login/logout
- [ ] **Reservas** - Pruebas de reserva de partidos
- [ ] **Pagos** - Pruebas de flujos de pago
- [ ] **Utilidades** - Funciones helper y utilidades
- [ ] **Configuración** - Configuración de Playwright
- [ ] **Documentación** - Guías y documentación
- [ ] **Otro** - Especificar: _______________

## 🔍 Cambios Realizados

<!-- Lista detallada de los cambios realizados -->

### Archivos Modificados

- `ruta/al/archivo.ts` - Descripción del cambio
- `ruta/al/otro-archivo.ts` - Descripción del cambio

### Nuevos Archivos

- `ruta/al/nuevo-archivo.spec.ts` - Descripción del archivo

### Archivos Eliminados

- `ruta/al/archivo-eliminado.ts` - Razón de la eliminación

## 🧪 Testing

### Pruebas Ejecutadas

- [ ] **Desktop Chrome** - Todas las pruebas pasan
- [ ] **Mobile Safari** - Todas las pruebas pasan
- [ ] **Pruebas específicas** - Lista de pruebas ejecutadas

### Comandos de Testing

```bash
# Comandos ejecutados para validar los cambios
npm run test:desktop
npm run test:mobile
npx playwright test "ruta/específica/*.spec.ts"
```

### Resultados

<!-- Adjuntar capturas de pantalla de los resultados de las pruebas -->

- ✅ **Pruebas exitosas**: X/X pruebas pasaron
- ⚠️ **Advertencias**: Especificar si las hay
- ❌ **Fallos**: Especificar si los hay

## 📸 Evidencia Visual

<!-- Adjuntar screenshots o videos si aplica -->

### Antes
<!-- Screenshot del estado anterior -->

### Después
<!-- Screenshot del estado posterior -->

## 🔧 Configuración

### Variables de Entorno

- [ ] No se requieren cambios en variables de entorno
- [ ] Se requieren nuevas variables: `NUEVA_VARIABLE=valor`
- [ ] Se modificaron variables existentes: `VARIABLE_MODIFICADA=nuevo_valor`

### Dependencias

- [ ] No se agregaron nuevas dependencias
- [ ] Se agregaron dependencias: `nueva-dependencia@version`
- [ ] Se actualizaron dependencias: `dependencia@nueva-version`

## 📚 Documentación

### Documentación Actualizada

- [ ] **CONTRIBUTING.md** - Guías de contribución
- [ ] **README.md** - Documentación principal
- [ ] **docs/** - Documentación específica
- [ ] **Comentarios en código** - JSDoc y comentarios

### Nuevos Archivos de Documentación

- `docs/nueva-guia.md` - Descripción del contenido

## 🚨 Breaking Changes

<!-- Describir cambios que rompen la compatibilidad hacia atrás -->

- [ ] No hay breaking changes
- [ ] Hay breaking changes:
  - **Descripción**: Explicar qué cambió
  - **Migración**: Cómo migrar código existente
  - **Impacto**: Quién se ve afectado

## 🔗 Issues Relacionados

<!-- Vincular issues relacionados -->

- **Fixes**: #123
- **Relacionado con**: #456
- **Parte de**: #789

## ✅ Checklist de Revisión

### Código

- [ ] El código sigue las convenciones del proyecto
- [ ] Se usan utilidades compartidas cuando es apropiado
- [ ] Los selectores son robustos (no usan nth, posiciones)
- [ ] Se implementa limpieza adecuada en las pruebas
- [ ] No hay credenciales hardcodeadas
- [ ] Los timeouts son apropiados y justificados
- [ ] Se manejan casos edge y errores

### Testing

- [ ] Las pruebas son independientes y reproducibles
- [ ] Se ejecutaron en todos los dispositivos configurados
- [ ] Las pruebas pasan consistentemente
- [ ] Se agregaron pruebas para nueva funcionalidad
- [ ] Se actualizaron pruebas existentes si es necesario

### Documentación

- [ ] Los cambios están documentados
- [ ] Se actualizaron comentarios en código
- [ ] La documentación es clara y completa
- [ ] Se agregaron ejemplos si es necesario

### Git

- [ ] Los commits son descriptivos y pequeños
- [ ] Se usa el formato de commit convencional
- [ ] No hay commits de debugging o temporales
- [ ] El historial de commits es limpio

## 🎯 Criterios de Aceptación

<!-- Lista de criterios que deben cumplirse para que el PR sea aceptado -->

- [ ] **Funcionalidad**: La nueva funcionalidad funciona correctamente
- [ ] **Testing**: Todas las pruebas pasan en todos los dispositivos
- [ ] **Documentación**: La documentación está actualizada
- [ ] **Revisión**: Al menos un reviewer aprobó los cambios
- [ ] **CI/CD**: Los pipelines de CI/CD pasan exitosamente

## 📝 Notas Adicionales

<!-- Información adicional que los reviewers deben conocer -->

### Contexto

<!-- Proporcionar contexto adicional sobre por qué se realizaron estos cambios -->

### Alternativas Consideradas

<!-- Describir alternativas que se consideraron y por qué se rechazaron -->

### Próximos Pasos

<!-- Describir pasos futuros si aplica -->

## 🤝 Reviewers

<!-- Etiquetar reviewers apropiados -->

**Reviewers sugeridos:**
- @reviewer1 - Para revisión de código
- @reviewer2 - Para revisión de testing
- @reviewer3 - Para revisión de documentación

---

**¡Gracias por tu contribución al framework de testing! 🏆⚽**
