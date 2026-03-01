<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
    <!-- Top Navbar (Desktop) -->
    <nav class="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/marketplace" class="flex items-center gap-2">
            <span
              class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              CardsMarket
            </span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <router-link to="/marketplace"
              class="px-4 py-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'marketplace' }">
              <i class="pi pi-shopping-cart mr-2"></i>Marketplace
            </router-link>
            <router-link to="/minhas-cartas"
              class="px-4 py-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'minhas-cartas' }">
              <i class="pi pi-id-card mr-2"></i>Minhas Cartas
            </router-link>
            <router-link to="/nova-troca"
              class="px-4 py-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'nova-troca' }">
              <i class="pi pi-exchange mr-2"></i>Nova Troca
            </router-link>
          </div>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-3">
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 px-6 py-3 bg-neutral-300 rounded-sm">
              <i class="pi pi-user text-neutral-500"></i>
              <span class="text-sm font-medium text-neutral-700">{{ authStore.user?.name }}</span>
            </div>
            <PButton v-if="authStore.isAuthenticated" label="Sair" severity="custom" outlined @click="logout"
              class="rounded-lg" />
            <router-link v-else to="/login">
              <PButton label="Entrar" class="rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 border-0" />
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100">
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-neutral-200 shadow-lg">
          <div class="px-4 py-3 space-y-2">
            <!-- Marketplace (sempre visível) -->
            <router-link to="/marketplace" @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
              :class="{ 'text-primary-600 bg-primary-50': $route.name === 'marketplace' }">
              <i class="pi pi-shopping-cart text-lg"></i>
              <span>Marketplace</span>
            </router-link>

            <!-- Menu quando LOGADO -->
            <template v-if="authStore.isAuthenticated">
              <router-link to="/minhas-cartas" @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                :class="{ 'text-primary-600 bg-primary-50': $route.name === 'minhas-cartas' }">
                <i class="pi pi-id-card text-lg"></i>
                <span>Minhas Cartas</span>
              </router-link>
              <router-link to="/nova-troca" @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                :class="{ 'text-primary-600 bg-primary-50': $route.name === 'nova-troca' }">
                <i class="pi pi-exchange text-lg"></i>
                <span>Nova Troca</span>
              </router-link>

              <div class="pt-2 border-t border-neutral-200">
                <div class="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600">
                  <i class="pi pi-user"></i>
                  <span>{{ authStore.user?.name }}</span>
                </div>
                <button @click="logout"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all mt-1">
                  <i class="pi pi-sign-out text-lg"></i>
                  <span>Sair</span>
                </button>
              </div>
            </template>

            <!-- Menu quando DESLOGADO -->
            <template v-else>
              <router-link to="/login" @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                :class="{ 'text-primary-600 bg-primary-50': $route.name === 'login' }">
                <i class="pi pi-sign-in text-lg"></i>
                <span>Login</span>
              </router-link>
              <router-link to="/registro" @click="mobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                :class="{ 'text-primary-600 bg-primary-50': $route.name === 'register' }">
                <i class="pi pi-user-plus text-lg"></i>
                <span>Registrar</span>
              </router-link>
            </template>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="pb-20 md:pb-8">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-40">
      <div class="grid grid-cols-3 gap-0">
        <router-link to="/marketplace" class="flex flex-col items-center justify-center py-3 px-2 transition-all"
          :class="$route.name === 'marketplace' ? 'text-primary-600 bg-primary-50' : 'text-neutral-500 hover:text-neutral-700'">
          <i class="pi pi-shopping-cart text-xl mb-1"></i>
          <span class="text-xs font-medium">Market</span>
        </router-link>
        <router-link to="/minhas-cartas" class="flex flex-col items-center justify-center py-3 px-2 transition-all"
          :class="$route.name === 'minhas-cartas' ? 'text-primary-600 bg-primary-50' : 'text-neutral-500 hover:text-neutral-700'">
          <i class="pi pi-id-card text-xl mb-1"></i>
          <span class="text-xs font-medium">Cartas</span>
        </router-link>
        <router-link to="/nova-troca" class="flex flex-col items-center justify-center py-3 px-2 transition-all"
          :class="$route.name === 'nova-troca' ? 'text-primary-600 bg-primary-50' : 'text-neutral-500 hover:text-neutral-700'">
          <i class="pi pi-exchange text-xl mb-1"></i>
          <span class="text-xs font-medium">Troca</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

function logout() {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Down Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Active link indicator */
.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #4f46e5;
  border-radius: 50%;
}
</style>