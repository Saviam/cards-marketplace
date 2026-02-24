import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'marketplace',
      component: () => import('@/modules/trades/pages/MarketplacePage.vue')
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
      path: '/minhas-cartas',
      name: 'minhas-cartas',
      component: () => import('@/modules/cards/pages/MyCardsPage.vue')
    },
    {
      path: '/nova-troca',
      name: 'nova-troca',
      component: () => import('@/modules/trades/pages/CreateTradePage.vue')
    }
  ]
})

export default router