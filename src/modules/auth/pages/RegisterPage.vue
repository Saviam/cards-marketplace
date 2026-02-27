<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/marketplace" class="inline-block mb-6">
          <span class="text-3xl font-bold text-primary-600">CardsMarket</span>
        </router-link>
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Crie sua conta</h1>
        <p class="text-neutral-500">Comece a trocar cartas agora</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 p-8 border border-neutral-100">
        <form @submit.prevent="register" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-neutral-700 mb-2">
              Nome completo
            </label>
            <div class="relative">
              <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Seu nome"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
              />
            </div>
          </div>

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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-neutral-700 mb-2">
              Confirmar senha
            </label>
            <div class="relative">
              <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="flex items-start gap-2 cursor-pointer">
              <input
                v-model="acceptTerms"
                type="checkbox"
                class="w-4 h-4 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-neutral-600">
                Li e aceito os
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Termos de Uso</a>
                e
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Política de Privacidade</a>
              </span>
            </label>
          </div>

          <!-- ✅ ButtonItem no lugar de PButton -->
          <ButtonItem
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="loading || !acceptTerms"
            class="w-full"
          >
            {{ loading ? 'Cadastrando...' : 'Criar conta' }}
          </ButtonItem>
        </form>

        <div class="mt-6 pt-6 border-t border-neutral-100">
          <p class="text-center text-sm text-neutral-600">
            Já tem uma conta?
            <router-link to="/login" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Fazer login
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
import { useRegister } from '@/composables/useRegister'
import ButtonItem from '@/shared/components/ButtonItem.vue'

const {
  loading,
  name,
  email,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  acceptTerms,
  register,
  togglePassword,
  toggleConfirmPassword
} = useRegister()
</script>