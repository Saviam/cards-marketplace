<template>
  <div>
    <!-- Navbar só aparece se não estiver em login/registro -->
    <nav v-if="$route.name !== 'login' && $route.name !== 'registro'">
      <router-link to="/marketplace">Marketplace</router-link>
      
      <template v-if="authStore.isAuthenticated">
        <router-link to="/minhas-cartas">Minhas Cartas</router-link>
        <router-link to="/nova-troca">Nova Troca</router-link>
        <button @click="handleLogout">Sair</button>
      </template>
      
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/registro">Registrar</router-link>
      </template>
    </nav>

    <!-- Conteúdo das páginas -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>