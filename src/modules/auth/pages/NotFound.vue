<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50">
    <div class="text-center max-w-2xl mx-auto">
      <!-- Ícone/Ilustração -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full shadow-2xl mb-6">
          <i class="pi pi-exclamation-triangle text-6xl text-primary-600"></i>
        </div>
        <h1 class="text-8xl font-bold text-neutral-900 mb-4">404</h1>
      </div>

      <!-- Texto -->
      <h2 class="text-3xl font-bold text-neutral-900 mb-4">
        Página não encontrada
      </h2>
      <p class="text-lg text-neutral-500 mb-8">
        Ops! A página que você está procurando não existe ou foi movida.
      </p>

      <!-- Botões de ação -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <PButton
          label="Voltar para o Marketplace"
          @click="goToMarketplace"
          class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 border-0 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
        />
        <PButton
          label="Ir para Minhas Cartas"
          @click="goToMyCards"
          severity="secondary"
          outlined
          class="px-8 py-3 rounded-xl"
        />
      </div>

      <!-- Link para voltar -->
      <div class="mt-8">
        <button
          @click="goBack"
          class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          ← Voltar para página anterior
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToMarketplace() {
  router.push('/marketplace')
}

function goToMyCards() {
  router.push('/minhas-cartas')
}

function goBack() {
  router.back()
}
</script>