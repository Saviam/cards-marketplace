<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 text-center sm:text-left">
      <h1 class="text-3xl font-bold text-neutral-900">Minhas Cartas</h1>
      <PButton
        label="+ Adicionar Carta"
        icon="pi pi-plus"
        @click="openModal"
        class="bg-gradient-to-r from-primary-600 to-primary-500 border-0 shadow-lg shadow-primary-500/30"
      />
    </div>

    <div v-if="loading" class="text-center py-16">
      <PProgressBar mode="indeterminate" class="h-1 max-w-md mx-auto" />
      <p class="text-neutral-500 mt-4 font-medium">Carregando suas cartas...</p>
    </div>

    <EmptyState
      v-else-if="error"
      title="Ops! Algo deu errado"
      :description="error"
      icon="pi pi-exclamation-triangle"
    >
      <template #actions>
        <PButton
          label="Tentar novamente"
          @click="refresh"
          class="bg-gradient-to-r from-primary-600 to-primary-500 border-0"
        />
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="!cards?.length"
      title="Sua coleção está vazia"
      description="Comece adicionando cartas para criar trocas no marketplace"
      icon="pi pi-inbox"
    >
      <template #actions>
        <PButton
          label="Adicionar Primeira Carta"
          @click="openModal"
          class="bg-gradient-to-r from-primary-600 to-primary-500 border-0 shadow-lg shadow-primary-500/30"
        />
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      <PCard
        v-for="card in cards"
        :key="card.id"
        class="w-full max-w-sm hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden group"
      >
        <template #header>
          <div class="relative overflow-hidden">
            <img
              :src="card.imageUrl"
              :alt="card.name"
              class="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </template>
        <template #title>
          <h3 class="font-semibold text-neutral-900 text-lg line-clamp-1">{{ card.name }}</h3>
        </template>
        <template #content>
          <div class="flex items-center gap-2 text-sm text-neutral-500">
            <i class="pi pi-calendar text-xs"></i>
            <span>Adicionada em {{ formatDate(card.createdAt) }}</span>
          </div>
        </template>
      </PCard>
    </div>

    <PDialog
      v-model:visible="modalVisible"
      modal
      header="Adicionar Carta"
      :style="{ width: '50rem' }"
      :breakpoints="{ '768px': '95vw' }"
      class="rounded-xl"
    >
      <div class="space-y-4 -mx-2">
        <div class="px-2">
          <PInputText
            v-model="searchQuery"
            @input="debouncedSearch"
            placeholder="Buscar cartas disponíveis..."
            class="w-full rounded-lg"
          />
        </div>

        <div v-if="searching" class="text-center py-8">
          <PProgressBar mode="indeterminate" class="h-1 max-w-xs mx-auto" />
          <p class="text-neutral-500 text-sm mt-3">Buscando cartas...</p>
        </div>

        <div
          v-else-if="availableCards?.length"
          class="space-y-2 max-h-96 overflow-y-auto pr-2 px-2"
        >
          <div
            v-for="card in availableCards"
            :key="card.id"
            class="flex items-center gap-4 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="selectedCards.includes(card.id) ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-neutral-200 hover:border-primary-300'"
            @click="toggleSelection(card.id)"
          >
            <img
              :src="card.imageUrl"
              :alt="card.name"
              class="w-16 h-22 object-cover rounded-lg flex-shrink-0 shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-neutral-900 truncate">{{ card.name }}</h4>
              <p class="text-sm text-neutral-500 line-clamp-2 mt-1">{{ card.description }}</p>
            </div>
            <div
              v-if="selectedCards.includes(card.id)"
              class="w-9 h-9 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary-500/30"
            >
              <i class="pi pi-check text-sm font-bold"></i>
            </div>
            <div
              v-else
              class="w-9 h-9 border-2 border-neutral-300 rounded-full flex-shrink-0"
            ></div>
          </div>
        </div>

        <EmptyState
          v-else-if="searchQuery"
          title="Nenhuma carta encontrada"
          description="Tente buscar com outro termo"
          icon="pi pi-search"
        />

        <EmptyState
          v-else
          title="Buscar cartas"
          description="Digite para buscar cartas disponíveis no sistema"
          icon="pi pi-search"
        />
      </div>

      <template #footer>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 w-full pt-4 border-t border-neutral-200">
          <span class="text-sm text-neutral-500 font-medium">
            <span class="text-primary-600 font-bold">{{ selectedCards.length }}</span> carta(s) selecionada(s)
          </span>
          <div class="flex gap-2 w-full sm:w-auto">
            <PButton
              label="Cancelar"
              severity="secondary"
              outlined
              @click="closeModal"
              class="flex-1 sm:flex-none rounded-lg"
            />
            <PButton
              label="Adicionar"
              :disabled="!selectedCards.length"
              :loading="adding"
              @click="confirmAdd"
              class="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-primary-500 border-0 rounded-lg shadow-lg shadow-primary-500/30"
            />
          </div>
        </div>
      </template>
    </PDialog>

    <PToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
import { useMyCards } from '@/composables/useMyCards'

const {
  cards,
  loading,
  error,
  modalVisible,
  searchQuery,
  searching,
  adding,
  availableCards,
  selectedCards,
  openModal,
  closeModal,
  toggleSelection,
  debouncedSearch,
  confirmAdd,
  refresh,
  formatDate
} = useMyCards()

onMounted(() => {
  refresh()
})

onActivated(() => {
  refresh()
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.p-dialog-header) {
  border-radius: 14px 14px 0 0;
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
}

:deep(.p-dialog-content) {
  border-radius: 0 0 14px 14px;
}
</style>