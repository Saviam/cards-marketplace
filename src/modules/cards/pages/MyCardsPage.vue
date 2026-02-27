<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 text-center sm:text-left">
      <h1 class="text-3xl font-bold text-neutral-900">Minhas Cartas</h1>
      
      <!-- ✅ ButtonItem para ação principal -->
      <ButtonItem
        variant="primary"
        size="md"
        @click="openModal"
        class="flex items-center gap-2"
      >
        <i class="pi pi-plus"></i> Adicionar Carta
      </ButtonItem>
    </div>

    <!-- Loading fullscreen -->
    <LoadingSpinner v-if="loading" fullscreen message="Carregando suas cartas..." />

    <!-- Error state -->
    <EmptyState
      v-else-if="error"
      title="Ops! Algo deu errado"
      :description="error"
      icon="pi pi-exclamation-triangle"
    >
      <template #actions>
        <!-- ✅ ButtonItem para ação de retry -->
        <ButtonItem variant="primary" @click="refresh">
          Tentar novamente
        </ButtonItem>
      </template>
    </EmptyState>

    <!-- Empty state -->
    <EmptyState
      v-else-if="!cards?.length"
      title="Sua coleção está vazia"
      description="Comece adicionando cartas para criar trocas no marketplace"
      icon="pi pi-inbox"
    >
      <template #actions>
        <!-- ✅ ButtonItem para CTA principal -->
        <ButtonItem variant="primary" @click="openModal">
          Adicionar Primeira Carta
        </ButtonItem>
      </template>
    </EmptyState>

    <!-- Grid de cartas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      <PCard
        v-for="card in cards"
        :key="card.id"
        class="w-full max-w-sm hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden"
      >
        <template #header>
          <div class="relative overflow-hidden">
            <img
              :src="card.imageUrl"
              :alt="card.name"
              class="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
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

    <!-- Modal de Adicionar Carta -->
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
          <!-- ✅ LoadingSpinner inline para busca -->
          <LoadingSpinner message="Buscando cartas..." />
        </div>

        <div v-else-if="availableCards?.length" class="space-y-2 max-h-96 overflow-y-auto pr-2 px-2">
          <CardItem
            v-for="card in availableCards"
            :key="card.id"
            :card="card"
            :selectable="true"
            :selected="selectedCards.includes(card.id)"
            :show-description="true"
            :show-date="false"
            @click="toggleSelection(card.id)"
          />
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
            <!-- ✅ PButton secondary para cancelar (feature outlined do PrimeVue) -->
            <PButton
              label="Cancelar"
              severity="secondary"
              outlined
              @click="closeModal"
              class="flex-1 sm:flex-none rounded-lg"
            />
            <!-- ✅ ButtonItem para ação principal do modal -->
            <ButtonItem
              variant="primary"
              size="md"
              :disabled="!selectedCards.length"
              :loading="adding"
              @click="confirmAdd"
              class="flex-1 sm:flex-none"
            >
              {{ adding ? 'Adicionando...' : 'Adicionar' }}
            </ButtonItem>
          </div>
        </div>
      </template>
    </PDialog>

    <PToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
import ButtonItem from '@/shared/components/ButtonItem.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import CardItem from '@/shared/components/CardItem.vue'
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

onMounted(() => { refresh() })
onActivated(() => { refresh() })
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