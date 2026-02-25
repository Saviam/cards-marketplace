import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/marketplace',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/modules/auth/pages/LoginPage.vue')
        },
        {
          path: 'registro',
          name: 'registro',
          component: () => import('@/modules/auth/pages/RegisterPage.vue')
        },
        {
          path: 'marketplace',
          name: 'marketplace',
          component: () => import('@/modules/trades/pages/MarketplacePage.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'minhas-cartas',
          name: 'minhas-cartas',
          component: () => import('@/modules/cards/pages/MyCardsPage.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'nova-troca',
          name: 'nova-troca',
          component: () => import('@/modules/trades/pages/CreateTradePage.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  if ((to.name === 'login' || to.name === 'registro') && authStore.isAuthenticated) {
    return { name: 'marketplace' }
  }
})

export default router