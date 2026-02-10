import { createRouter, createWebHistory } from 'vue-router'
import type { Pinia } from 'pinia'
import { useAuthStore } from '../stores/authStore'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const createAppRouter = (pinia: Pinia) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'dashboard',
        component: DashboardView,
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
      },
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
