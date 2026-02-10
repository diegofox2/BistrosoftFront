# Tests - Bistrosoft Frontend

## Organización de Tests

La estructura de tests sigue la misma organización modular que el código fuente del proyecto, facilitando la localización y mantenimiento de los tests.

```
tests/
├── setup.ts                    # Configuración global de tests
├── helpers/                    # Utilidades compartidas para tests
│   ├── mockFetch.ts           # Helpers para mockear fetch
│   └── storeHelpers.ts        # Helpers para stores de Pinia
│
└── unit/                      # Tests unitarios
    ├── core/                  # Tests de funcionalidad core
    │   ├── components/        # Tests de componentes compartidos
    │   │   ├── SectionCard.spec.ts
    │   │   └── StatusPill.spec.ts
    │   └── services/          # Tests de servicios core
    │       └── http.spec.ts
    │
    └── modules/               # Tests de módulos de negocio
        ├── auth/              # Tests del módulo de autenticación
        │   ├── services/
        │   │   └── authService.spec.ts
        │   └── stores/
        │       └── authStore.spec.ts
        │
        ├── customers/         # Tests del módulo de clientes
        │   └── services/
        │       └── customerService.spec.ts
        │
        ├── orders/            # Tests del módulo de órdenes
        │   ├── constants/
        │   │   └── orderStatus.spec.ts
        │   └── services/
        │       └── orderService.spec.ts
        │
        └── dashboard/         # Tests del módulo de dashboard
            └── stores/
                └── activityStore.spec.ts
```

## Tecnologías de Testing

- **Vitest**: Framework de testing rápido y moderno
- **@vue/test-utils**: Utilidades oficiales para testing de componentes Vue
- **Happy DOM**: Entorno DOM ligero para tests
- **@vitest/ui**: Interfaz visual para ejecutar y visualizar tests

## Ejecutar Tests

### Modo watch (recomendado para desarrollo)

```bash
npm test
```

### Ejecutar todos los tests una vez

```bash
npm run test:run
```

### Interfaz visual de tests

```bash
npm run test:ui
```

Abre una interfaz web interactiva en http://localhost:51204

### Generar reporte de cobertura

```bash
npm run test:coverage
```

Genera reportes en `coverage/` con métricas detalladas de cobertura de código.

## Convenciones de Naming

- **Archivos de test**: `*.spec.ts` para tests de TypeScript/servicios
- **Componentes Vue**: `ComponentName.spec.ts` para tests de componentes
- **Estructura de describe**: Usar nombres descriptivos que reflejen la funcionalidad
- **Estructura de it**: Usar formato "should [acción esperada]"

## Ejemplos de Tests

### Test de Servicio

```typescript
describe("authService", () => {
  describe("requestToken", () => {
    it("should request token with correct credentials", async () => {
      const mockResponse = { token: "test-token" };
      mockFetchSuccess(mockResponse);

      const result = await requestToken("user", "pass");

      expect(result).toEqual(mockResponse);
    });
  });
});
```

### Test de Store (Pinia)

```typescript
describe("authStore", () => {
  beforeEach(() => {
    setupTestPinia();
  });

  it("should login successfully", async () => {
    const store = useAuthStore();
    mockFetchSuccess({ token: "new-token" });

    await store.login("user", "pass");

    expect(store.isAuthenticated).toBe(true);
  });
});
```

### Test de Componente Vue

```typescript
describe("StatusPill.vue", () => {
  it("should display correct label", () => {
    const wrapper = mount(StatusPill, {
      props: { value: 1 },
    });

    expect(wrapper.text()).toBe("Paid");
  });
});
```

## Helpers Disponibles

### mockFetch.ts

- `mockFetchSuccess(data, status)`: Mockea respuesta exitosa
- `mockFetchError(message, status)`: Mockea respuesta de error
- `mockFetchTextError(message, status)`: Mockea error de texto plano
- `mockFetch204()`: Mockea respuesta 204 No Content

### storeHelpers.ts

- `setupTestPinia()`: Configura Pinia para tests

## Cobertura de Código

El proyecto apunta a mantener una cobertura de código superior al 80%. Los reportes de cobertura se generan automáticamente al ejecutar `npm run test:coverage`.

Archivos excluidos de cobertura:

- `node_modules/`
- `tests/`
- `**/*.spec.ts` y `**/*.test.ts`
- `**/types/` (definiciones de tipos)
- `**/*.d.ts` (archivos de declaración)

## Mejores Prácticas

1. **Un concepto por test**: Cada test debe verificar una sola cosa
2. **Nombres descriptivos**: Los nombres deben explicar qué se está probando y el resultado esperado
3. **AAA Pattern**: Arrange (preparar), Act (actuar), Assert (verificar)
4. **Aislar tests**: Los tests no deben depender unos de otros
5. **Mock external dependencies**: Mockear llamadas a API, localStorage, etc.
6. **Cleanup**: Usar `beforeEach` y `afterEach` para limpiar estado entre tests

## Agregar Nuevos Tests

Al agregar un nuevo módulo o funcionalidad:

1. Crear el archivo de test en la misma estructura que el código fuente
2. Importar las funciones/componentes a testear
3. Importar los helpers necesarios de `tests/helpers/`
4. Escribir tests siguiendo las convenciones del proyecto
5. Ejecutar `npm test` para verificar que pasen
6. Verificar cobertura con `npm run test:coverage`

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
