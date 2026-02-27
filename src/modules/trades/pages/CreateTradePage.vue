<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-neutral-900 mb-3">Nova Troca</h1>
      <p class="text-neutral-500 text-lg max-w-2xl mx-auto">
        Selecione as cartas que você quer oferecer e as que deseja receber
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Você Oferece -->
      <div class="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
        <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <i class="pi pi-arrow-up text-white"></i>
              </div>
              <div>
                <h2 class="font-bold text-neutral-900">Você Oferece</h2>
                <p class="text-sm text-neutral-500">{{ selectedOffering.length }} carta(s) selecionada(s)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                v-model="searchOfferingQuery"
                @input="debouncedSearch('offering')"
                type="text"
                placeholder="Buscar suas cartas..."
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
              />
            </div>
          </div>

          <div v-if="myCards.length === 0" class="text-center py-8">
            <i class="pi pi-inbox text-4xl text-neutral-300 mb-3"></i>
            <p class="text-neutral-500">Você não tem cartas</p>
            <router-link to="/minhas-cartas" class="text-primary-600 font-medium hover:text-primary-700 mt-2 inline-block">
              Adicionar cartas
            </router-link>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
            <CardItem
              v-for="card in myCards"
              :key="card.id"
              :card="card"
              :selectable="true"
              :selected="selectedOffering.includes(card.id)"
              :show-description="false"
              :show-date="false"
              @click="toggleOffering(card.id)"
            />
          </div>
        </div>
      </div>

      <!-- Você Recebe -->
      <div class="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
        <div class="bg-gradient-to-r from-accent-50 to-accent-100 px-6 py-4 border-b border-accent-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                <i class="pi pi-arrow-down text-white"></i>
              </div>
              <div>
                <h2 class="font-bold text-neutral-900">Você Recebe</h2>
                <p class="text-sm text-neutral-500">{{ selectedReceiving.length }} carta(s) selecionada(s)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <div class="relative">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                v-model="searchReceivingQuery"
                @input="debouncedSearch('receiving')"
                type="text"
                placeholder="Buscar cartas do marketplace..."
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 outline-none transition-all text-neutral-900 placeholder-neutral-400"
              />
            </div>
          </div>

          <div v-if="searching" class="text-center py-8">
            <PProgressBar mode="indeterminate" class="h-1 max-w-xs mx-auto" />
            <p class="text-neutral-500 text-sm mt-3">Buscando...</p>
          </div>

          <div v-else-if="availableCards.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
            <CardItem
              v-for="card in availableCards"
              :key="card.id"
              :card="card"
              :selectable="true"
              :selected="selectedReceiving.includes(card.id)"
              :show-description="false"
              :show-date="false"
              @click="toggleReceiving(card.id)"
            />
          </div>

          <div v-else-if="searchReceivingQuery" class="text-center py-8">
            <i class="pi pi-search text-4xl text-neutral-300 mb-3"></i>
            <p class="text-neutral-500">Nenhuma carta encontrada</p>
          </div>

          <div v-else class="text-center py-8">
            <i class="pi pi-info-circle text-4xl text-neutral-300 mb-3"></i>
            <p class="text-neutral-500">Digite para buscar cartas</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
      <PButton
        label="Cancelar"
        severity="secondary"
        outlined
        @click="resetForm"
        class="w-full sm:w-auto rounded-xl"
      />
      <PButton
        label="Criar Troca"
        :loading="submitting"
        :disabled="!selectedOffering.length || !selectedReceiving.length"
        @click="submitTrade"
        class="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 border-0 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
      />
    </div>

    <PToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CardItem from '@/shared/components/CardItem.vue'
import { useCreateTrade } from '@/composables/useCreateTrade'

const {
  submitting,
  myCards,
  availableCards,
  selectedOffering,
  selectedReceiving,
  searchOfferingQuery,
  searchReceivingQuery,
  searching,
  fetchMyCards,
  loadAllAvailableCards,
  debouncedSearch,
  toggleOffering,
  toggleReceiving,
  submitTrade,
  resetForm
} = useCreateTrade()

onMounted(() => {
  fetchMyCards()
  loadAllAvailableCards()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>