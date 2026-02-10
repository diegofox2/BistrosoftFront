# Bistrosoft Frontend - Estructura Modular

## Estructura del Proyecto

```
src/
├── core/                          # Funcionalidad transversal
│   ├── components/                # Componentes compartidos
│   │   ├── SectionCard.vue
│   │   └── StatusPill.vue
│   ├── router/                    # Router principal
│   │   └── index.ts
│   ├── services/
│   │   └── http.ts               # Cliente HTTP base
│   └── config.ts                 # Configuración global
│
├── modules/                       # Módulos de negocio
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.vue
│   │   ├── views/
│   │   │   └── LoginView.vue
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── router.ts
│   │
│   ├── customers/
│   │   ├── components/
│   │   │   ├── CreateCustomerForm.vue
│   │   │   └── CustomerLookup.vue
│   │   ├── services/
│   │   │   └── customerService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── router.ts
│   │
│   ├── orders/
│   │   ├── components/
│   │   │   ├── CreateOrderForm.vue
│   │   │   └── OrderStatusForm.vue
│   │   ├── services/
│   │   │   └── orderService.ts
│   │   ├── stores/
│   │   │   └── orderStore.ts
│   │   ├── constants/
│   │   │   └── orderStatus.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── router.ts
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── DashboardHeader.vue
│       │   └── ActivityOverview.vue
│       ├── views/
│       │   └── DashboardView.vue
│       ├── stores/
│       │   └── activityStore.ts
│       └── router.ts
│
├── App.vue
├── main.ts
└── style.css
```

## Alias de Paths Configurados

- `@/*` - Apunta a `./src/*`
- `@core/*` - Apunta a `./src/core/*`
- `@modules/*` - Apunta a `./src/modules/*`

## Ventajas de esta Estructura

### 1. **Escalabilidad**

Cada módulo es autocontenido. Puedes añadir nuevos módulos (`inventory/`, `reports/`, `billing/`) sin afectar los existentes.

### 2. **Cohesión**

Todo lo relacionado con un dominio específico está junto:

- `modules/customers/` contiene todo sobre customers
- `modules/orders/` contiene todo sobre orders
- etc.

### 3. **Lazy Loading**

Los módulos pueden cargarse bajo demanda:

```ts
{
  path: '/customers',
  component: () => import('@modules/customers/views/CustomersView.vue')
}
```

### 4. **Testing**

Más fácil testear un módulo completo de forma aislada.

### 5. **Mantenibilidad**

Equipos diferentes pueden trabajar en módulos diferentes sin conflictos.

### 6. **Reutilización**

`core/` contiene todo lo compartido, evitando duplicación.

## Cómo Agregar un Nuevo Módulo

1. Crear carpeta en `src/modules/nombre-modulo/`
2. Crear estructura interna:
   - `components/` - Componentes del módulo
   - `views/` - Vistas/páginas
   - `services/` - Lógica de API
   - `stores/` - Estado (Pinia)
   - `types/` - TypeScript types
   - `router.ts` - Rutas del módulo

3. Exportar rutas en `router.ts`:

```ts
import type { RouteRecordRaw } from "vue-router";

const miModuloRoutes: RouteRecordRaw[] = [
  {
    path: "/mi-ruta",
    name: "mi-vista",
    component: () => import("./views/MiVista.vue"),
  },
];

export default miModuloRoutes;
```

4. Importar en `src/core/router/index.ts`:

```ts
import miModuloRoutes from "@modules/mi-modulo/router";

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...miModuloRoutes, // <-- Agregar aquí
];
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:5137
```
