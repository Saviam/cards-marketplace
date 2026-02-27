<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/marketplace" class="inline-block mb-6">
          <span class="text-3xl font-bold text-primary-600">CardsMarket</span>
        </router-link>
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Bem-vindo de volta</h1>
        <p class="text-neutral-500">Faça login para continuar</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 p-8 border border-neutral-100">
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
                :class="{ 'border-red-400': false }"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-neutral-700 mb-2">
              Senha
            </label>
            <div class="relative">
              <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
              <span class="text-sm text-neutral-600">Lembrar de mim</span>
            </label>
            <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          
          <ButtonItem
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="loading"
            class="w-full"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </ButtonItem>
        </form>

        <div class="mt-6 pt-6 border-t border-neutral-100">
          <p class="text-center text-sm text-neutral-600">
            Não tem uma conta?
            <router-link to="/registro" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Criar conta
            </router-link>
          </p>
        </div>
      </div>

      <p class="text-center text-xs text-neutral-400 mt-6">
        © 2026 CardsMarket. Todos os direitos reservados.
      </p>
    </div>

    <PToast />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import ButtonItem from '@/shared/components/ButtonItem.vue'

const {
  loading,
  email,
  password,
  showPassword,
  login,
  togglePassword
} = useAuth()
</script>