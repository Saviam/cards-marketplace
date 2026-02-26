<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-18">
          <div class="flex items-center gap-8">
            <router-link to="/marketplace" class="flex items-center gap-2">
              <span class="text-2xl font-bold text-primary-600">
                CardsMarket
              </span>
            </router-link>
            
            <div class="hidden md:flex items-center gap-1">
              <router-link
                to="/marketplace"
                class="px-4 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                Marketplace
              </router-link>
              <template v-if="authStore.isAuthenticated">
                <router-link
                  to="/minhas-cartas"
                  class="px-4 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                  Minhas Cartas
                </router-link>
                <router-link
                  to="/nova-troca"
                  class="px-4 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                  Nova Troca
                </router-link>
              </template>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <template v-if="authStore.isAuthenticated">
              <div class="hidden sm:flex items-center gap-2 px-10 py-2.5 bg-primary-100 rounded-sm">
                <i class="pi pi-user text-primary-500"></i>
                <span class="text-md font-medium text-primary-700">{{ authStore.user?.name }}</span>
              </div>
              <PButton
                label="Sair"
                severity="custom"
                @click="handleLogout"
                class="hidden sm:flex items-center gap-2 px-6 py-2 rounded-lg text-md font-medium text-primary-700 hover:bg-primary-100 bg-primary-100 border-0 transition-colors duration-200"
              />
            </template>
            <template v-else>
              <router-link to="/login">
                <PButton
                  label="Login"
                  severity="secondary"
                  size="small"
                  class="rounded-lg"
                />
              </router-link>
              <router-link to="/registro">
                <PButton
                  label="Registrar"
                  size="small"
                  class="rounded-lg bg-primary-600 border-0"
                />
              </router-link>
            </template>
          </div>
        </div>

        <div class="md:hidden flex items-center gap-2 pb-3">
          <router-link
            to="/marketplace"
            class="flex-1 text-center px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            Marketplace
          </router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/minhas-cartas"
              class="flex-1 text-center px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              Minhas Cartas
            </router-link>
            <router-link
              to="/nova-troca"
              class="flex-1 text-center px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              Nova Troca
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <router-view :key="$route.fullPath" />
    </main>

    <footer class="bg-white border-t border-neutral-200 py-6 mt-auto">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-neutral-500">
        <p>&copy; 2025 CardsMarket. Todos os direitos reservados.</p>
      </div>
    </footer>

    <PToast position="top-right" />
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