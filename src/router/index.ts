import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/pages/LoginPage.vue')
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('@/modules/auth/pages/RegisterPage.vue')
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('@/modules/trades/pages/MarketplacePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/minhas-cartas',
      name: 'minhas-cartas',
      component: () => import('@/modules/cards/pages/MyCardsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/nova-troca',
      name: 'nova-troca',
      component: () => import('@/modules/trades/pages/CreateTradePage.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'registro') && authStore.isAuthenticated) {
    next({ name: 'marketplace' })
  } else {
    next()
  }
})

export default router