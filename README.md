# Bistrosoft Frontend

> Sistema de gestión de clientes y órdenes con arquitectura modular escalable.

## 🚀 Stack Tecnológico

- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado estático para mayor seguridad
- **Vite** - Build tool ultrarrápido
- **Vue Router** - Navegación SPA con lazy loading
- **Pinia** - Gestión de estado modular
- **Tailwind CSS** - Estilos utility-first

## 📁 Arquitectura Modular

Este proyecto implementa una **arquitectura modular escalable** diseñada para aplicaciones enterprise que requieren crecimiento sostenido. La estructura separa claramente la funcionalidad transversal (`core`) de los módulos de negocio (`modules`), permitiendo:

- ✅ Escalabilidad horizontal (agregar módulos sin límite)
- ✅ Separación de responsabilidades por dominio
- ✅ Lazy loading automático de módulos
- ✅ Testing independiente por módulo
- ✅ Equipos trabajando en paralelo sin conflictos

### Estructura del Proyecto

```
src/
├── core/                          # Funcionalidad transversal y compartida
│   ├── components/                # Componentes UI reutilizables
│   │   ├── SectionCard.vue
│   │   └── StatusPill.vue
│   ├── router/                    # Configuración del router principal
│   │   └── index.ts
│   ├── services/
│   │   └── http.ts               # Cliente HTTP con interceptores
│   └── config.ts                 # Configuración global (API URLs, etc.)
│
├── modules/                       # Módulos de negocio autocontenidos
│   ├── auth/                      # Módulo de autenticación
│   │   ├── components/
│   │   │   └── LoginForm.vue
│   │   ├── views/
│   │   │   └── LoginView.vue
│   │   ├── services/
│   │   │   └── authService.ts    # Lógica de API
│   │   ├── stores/
│   │   │   └── authStore.ts      # Estado del módulo
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── router.ts             # Rutas del módulo
│   │
│   ├── customers/                 # Gestión de clientes
│   ├── orders/                    # Gestión de órdenes
│   └── dashboard/                 # Panel principal
│
├── App.vue                        # Componente raíz
├── main.ts                        # Entry point
└── style.css                      # Estilos globales
```

## 🎯 Beneficios de la Arquitectura

### 1. **Escalabilidad sin Límites**
Cada módulo es completamente autocontenido. Puedes tener 5, 50 o 500 módulos sin que la estructura se vuelva inmanejable.

```typescript
// Agregar un nuevo módulo es tan simple como:
modules/
  └── inventory/          // ← Nuevo módulo
      ├── components/
      ├── views/
      ├── services/
      ├── stores/
      ├── types/
      └── router.ts
```

### 2. **Cohesión por Dominio**
Todo lo relacionado con un dominio de negocio está en un solo lugar:

```
modules/customers/
├── CreateCustomerForm.vue    # UI
├── customerService.ts        # API
├── customerStore.ts          # State
└── types/index.ts            # Types
```

No más buscar archivos dispersos en 10 carpetas diferentes.

### 3. **Lazy Loading Automático**
Los módulos se cargan bajo demanda, mejorando significativamente el tiempo de carga inicial:

```typescript
// El código de customers solo se descarga cuando el usuario accede a esa ruta
{
  path: '/customers',
  component: () => import('@modules/customers/views/CustomersView.vue')
}
```

**Resultado**: Bundle inicial más pequeño, app más rápida.

### 4. **Path Aliases Configurados**
Imports limpios y mantenibles:

```typescript
// ❌ Antes:
import { useAuthStore } from '../../../stores/authStore'

// ✅ Ahora:
import { useAuthStore } from '@modules/auth/stores/authStore'
```

Alias disponibles:
- `@/*` → `./src/*`
- `@core/*` → `./src/core/*`
- `@modules/*` → `./src/modules/*`

### 5. **Testing Independiente**
Cada módulo puede testearse de forma aislada sin dependencias externas innecesarias.

### 6. **Desarrollo en Paralelo**
Múltiples equipos pueden trabajar en diferentes módulos sin conflictos de merge constantes.

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/diegofox2/BistrosoftFront.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API URL
```

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:5137
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo local con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Type-checking
npm run type-check
```

## 📦 Cómo Extender con Nuevos Módulos

### Guía Paso a Paso

#### 1. Crear la Estructura del Módulo

```bash
src/modules/nuevo-modulo/
├── components/           # Componentes específicos del módulo
├── views/               # Páginas/vistas
├── services/            # Lógica de llamadas a API
├── stores/              # Estado con Pinia (opcional)
├── types/               # TypeScript types e interfaces
├── constants/           # Constantes del módulo (opcional)
└── router.ts            # Definición de rutas
```

#### 2. Crear el Archivo de Rutas

`src/modules/nuevo-modulo/router.ts`:

```typescript
import type { RouteRecordRaw } from 'vue-router'

const nuevoModuloRoutes: RouteRecordRaw[] = [
  {
    path: '/nuevo-modulo',
    name: 'nuevo-modulo',
    component: () => import('./views/NuevoModuloView.vue'),
    meta: {
      requiresAuth: true, // Si requiere autenticación
    },
  },
  {
    path: '/nuevo-modulo/:id',
    name: 'nuevo-modulo-detail',
    component: () => import('./views/NuevoModuloDetail.vue'),
  },
]

export default nuevoModuloRoutes
```

#### 3. Registrar las Rutas en el Router Principal

`src/core/router/index.ts`:

```typescript
import nuevoModuloRoutes from '@modules/nuevo-modulo/router'

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...customerRoutes,
  ...orderRoutes,
  ...nuevoModuloRoutes,  // ← Agregar aquí
  // ...
]
```

#### 4. Crear Servicios (si requiere API)

`src/modules/nuevo-modulo/services/nuevoModuloService.ts`:

```typescript
import { requestJson } from '@core/services/http'
import type { NuevoModuloData, NuevoModuloResponse } from '../types'

export const getNuevoModulo = async (token: string, id: string) =>
  requestJson<NuevoModuloResponse>(`/api/NuevoModulo/${id}`, { token })

export const createNuevoModulo = async (token: string, data: NuevoModuloData) =>
  requestJson<NuevoModuloResponse>('/api/NuevoModulo', {
    method: 'POST',
    body: data,
    token,
  })
```

#### 5. Crear Store (si requiere estado)

`src/modules/nuevo-modulo/stores/nuevoModuloStore.ts`:

```typescript
import { defineStore } from 'pinia'
import type { NuevoModuloState } from '../types'

export const useNuevoModuloStore = defineStore('nuevoModulo', {
  state: (): NuevoModuloState => ({
    items: [],
    loading: false,
    error: null,
  }),
  
  getters: {
    itemCount: (state) => state.items.length,
  },
  
  actions: {
    async fetchItems() {
      this.loading = true
      try {
        // Lógica de fetch...
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error'
      } finally {
        this.loading = false
      }
    },
  },
})
```

#### 6. Definir Types

`src/modules/nuevo-modulo/types/index.ts`:

```typescript
export interface NuevoModuloData {
  name: string
  description: string
}

export interface NuevoModuloResponse extends NuevoModuloData {
  id: string
  createdAt: string
}

export interface NuevoModuloState {
  items: NuevoModuloResponse[]
  loading: boolean
  error: string | null
}
```

#### 7. Crear Componentes y Vistas

`src/modules/nuevo-modulo/views/NuevoModuloView.vue`:

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useNuevoModuloStore } from '../stores/nuevoModuloStore'
import SectionCard from '@core/components/SectionCard.vue'

const store = useNuevoModuloStore()

onMounted(() => {
  store.fetchItems()
})
</script>

<template>
  <div class="container">
    <SectionCard title="Nuevo Módulo" badge="Feature">
      <!-- Contenido del módulo -->
    </SectionCard>
  </div>
</template>
```

### Ejemplo Completo: Módulo de Inventario

```typescript
// 1. Estructura
modules/inventory/
├── components/
│   ├── InventoryList.vue
│   └── InventoryForm.vue
├── views/
│   └── InventoryView.vue
├── services/
│   └── inventoryService.ts
├── stores/
│   └── inventoryStore.ts
├── types/
│   └── index.ts
└── router.ts

// 2. Router
// modules/inventory/router.ts
import type { RouteRecordRaw } from 'vue-router'

const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('./views/InventoryView.vue'),
  },
]

export default inventoryRoutes

// 3. Registrar en core/router/index.ts
import inventoryRoutes from '@modules/inventory/router'
// ... agregar a routes array
```

## 🔐 Autenticación y Guards

El proyecto implementa guards de navegación para proteger rutas:

```typescript
// core/router/index.ts
router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)
  
  // Redirigir a login si no está autenticado
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  // Redirigir a dashboard si ya está autenticado
  if (authStore.isAuthenticated && to.name === 'login') {
    return { name: 'dashboard' }
  }
  
  return true
})
```

## 🎨 Componentes Core Disponibles

### SectionCard
Wrapper consistente para secciones de contenido:

```vue
<SectionCard 
  title="Mi Sección" 
  subtitle="Descripción opcional"
  badge="Label"
>
  <!-- Contenido -->
</SectionCard>
```

### StatusPill
Indicador visual de estado (usado en órdenes):

```vue
<StatusPill :value="orderStatus" />
```

## 📚 Recursos y Documentación

- [STRUCTURE.md](./STRUCTURE.md) - Documentación detallada de la arquitectura
- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)

## 🤝 Contribuciones

Al agregar nuevas funcionalidades:

1. ✅ Seguir la estructura modular establecida
2. ✅ Crear un módulo separado para cada dominio de negocio
3. ✅ Utilizar path aliases para imports limpios
4. ✅ Definir types en `types/index.ts` de cada módulo
5. ✅ Implementar lazy loading para nuevas rutas
6. ✅ Mantener componentes compartidos en `core/components`

## 📄 Licencia

[Especificar licencia]

## 👥 Autores

[Información del equipo o autor]
