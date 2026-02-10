import { createRouter, createWebHistory } from 'vue-router'
import type { Pinia } from 'pinia'
import { useAuthStore } from '@modules/auth/stores/authStore'
import authRoutes from '@modules/auth/router'
import dashboardRoutes from '@modules/dashboard/router'
import customerRoutes from '@modules/customers/router'
import orderRoutes from '@modules/orders/router'

const createAppRouter = (pinia: Pinia) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      ...authRoutes,
      ...dashboardRoutes,
      ...customerRoutes,
      ...orderRoutes,
      {
        path: '/:pathMatch(.*)*',
        redirect: '/',
      },
    ],
  })

  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)

    if (!authStore.isAuthenticated && to.name !== 'login') {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (authStore.isAuthenticated && to.name === 'login') {
      return { name: 'dashboard' }
    }

    return true
  })

  return router
}

export default createAppRouter
