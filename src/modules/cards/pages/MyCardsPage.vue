<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 text-center sm:text-left">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900">Minhas Cartas</h1>
        <p class="text-neutral-500 text-sm mt-1">{{ cards.length }} carta(s) na coleção</p>
      </div>

      <ButtonItem variant="primary" size="md" @click="openModal" class="flex items-center gap-2">
        <i class="pi pi-plus"></i> Adicionar Carta
      </ButtonItem>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" fullscreen message="Carregando suas cartas..." />

    <!-- Error -->
    <EmptyState v-else-if="error" title="Ops! Algo deu errado" :description="error" icon="pi pi-exclamation-triangle">
      <template #actions>
        <ButtonItem variant="primary" @click="refresh">
          Tentar novamente
        </ButtonItem>
      </template>
    </EmptyState>

    <!-- Empty -->
    <EmptyState v-else-if="!cards?.length" title="Sua coleção está vazia"
      description="Comece adicionando cartas para criar trocas no marketplace" icon="pi pi-inbox">
      <template #actions>
        <ButtonItem variant="primary" @click="openModal">
          Adicionar Primeira Carta
        </ButtonItem>
      </template>
    </EmptyState>

    <!-- Carousel + Thumbnails -->
    <div v-else class="space-y-6">
      <!-- Carta Principal (Carousel) -->
      <div class="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- Imagem -->
          <div class="relative bg-gradient-to-br from-neutral-100 to-neutral-200 p-8 flex items-center justify-center">
            <Transition name="fade-scale" mode="out-in">
              <img :key="currentCard?.id" :src="currentCard?.imageUrl" :alt="currentCard?.name"
                class="w-full max-w-sm h-auto object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105" />
            </Transition>

            <!-- Navegação -->
            <button @click="prevCard"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-all"
              :disabled="currentIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }">
              <i class="pi pi-chevron-left"></i>
            </button>
            <button @click="nextCard"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-all"
              :disabled="currentIndex === cards.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentIndex === cards.length - 1 }">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>

          <!-- Detalhes -->
          <div class="p-8 flex flex-col justify-center">
            <Transition name="fade" mode="out-in">
              <div :key="currentCard?.id" class="space-y-4" v-if="currentCard">
                <div>
                  <h2 class="text-2xl font-bold text-neutral-900">{{ currentCard.name }}</h2>
                  <p class="text-neutral-500 text-sm mt-1">
                    Adicionada em {{ formatDate(currentCard.createdAt) }}
                  </p>
                </div>

                <div class="flex items-center gap-2 text-sm text-neutral-600">
                  <i class="pi pi-id-card text-neutral-400" v-tooltip="'ID da Carta'"></i>
                  <span class="font-mono text-xs">{{ currentCard.id.slice(0, 8) }}...</span>
                </div>

                <div>
                  <h3 class="font-semibold text-neutral-700 text-sm mb-2">Descrição</h3>
                  <p class="text-neutral-600 text-sm leading-relaxed">
                    {{ currentCard.description || 'Sem descrição' }}
                  </p>
                </div>

                <div class="flex gap-3 pt-4">
                  <ButtonItem variant="primary" size="md" @click="openDetailModal" class="flex-1">
                    <i class="pi pi-eye"></i> Ver Detalhes
                  </ButtonItem>
                  <router-link to="/nova-troca" class="flex-1">
                    <ButtonItem variant="secondary" size="md" class="w-full">
                      <i class="pi pi-exchange"></i> Nova Troca
                    </ButtonItem>
                  </router-link>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Miniaturas -->
      <div class="bg-white rounded-xl shadow-lg shadow-neutral-200/30 border border-neutral-100 p-4">
        <h3 class="font-semibold text-neutral-700 text-sm mb-3 flex items-center gap-2">
          <i class="pi pi-images text-neutral-400" v-tooltip="'Todas as cartas'"></i>
          Sua Coleção
        </h3>
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          <TransitionGroup name="list" tag="div" class="flex gap-3">
            <button v-for="(card, index) in cards" :key="card.id" @click="currentIndex = index"
              class="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105"
              :class="currentIndex === index ? 'border-primary-500 shadow-md' : 'border-neutral-200 hover:border-primary-300'">
              <img :src="card.imageUrl" :alt="card.name" class="w-full h-full object-cover" />
            </button>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <PDialog v-model:visible="detailModalVisible" modal header="Detalhes da Carta" :style="{ width: '40rem' }"
      :breakpoints="{ '768px': '95vw' }" class="rounded-xl">
      <div class="space-y-4" v-if="currentCard">
        <div class="flex justify-center">
          <img :src="currentCard.imageUrl" :alt="currentCard.name"
            class="w-48 h-64 object-cover rounded-xl shadow-lg" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-neutral-900">{{ currentCard.name }}</h3>
          <p class="text-neutral-500 text-sm mt-1">
            Adicionada em {{ formatDate(currentCard.createdAt) }}
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-neutral-700 text-sm mb-2">Descrição</h4>
          <p class="text-neutral-600 text-sm leading-relaxed">
            {{ currentCard.description || 'Sem descrição' }}
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm text-neutral-500">
          <i class="pi pi-id-card"></i>
          <span class="font-mono text-xs">ID: {{ currentCard.id }}</span>
        </div>
      </div>
      <template #footer>
        <PButton label="Fechar" @click="detailModalVisible = false" class="w-full rounded-lg" />
      </template>
    </PDialog>

    <!-- Modal de Adicionar Carta -->
    <PDialog v-model:visible="modalVisible" modal header="Adicionar Carta" :style="{ width: '50rem' }"
      :breakpoints="{ '768px': '95vw' }" class="rounded-xl">
      <div class="space-y-4 -mx-2">
        <div class="px-2">
          <PInputText v-model="searchQuery" @input="debouncedSearch" placeholder="Buscar cartas disponíveis..."
            class="w-full rounded-lg" />
        </div>

        <div v-if="searching" class="text-center py-8">
          <LoadingSpinner message="Buscando cartas..." />
        </div>

        <div v-else-if="availableCards?.length" class="space-y-2 max-h-96 overflow-y-auto pr-2 px-2">
          <CardItem v-for="card in availableCards" :key="card.id" :card="card" :selectable="true"
            :selected="selectedCards.includes(card.id)" :show-description="true" :show-date="false"
            @click="toggleSelection(card.id)" />
        </div>

        <EmptyState v-else-if="searchQuery" title="Nenhuma carta encontrada" description="Tente buscar com outro termo"
          icon="pi pi-search" />

        <EmptyState v-else title="Buscar cartas" description="Digite para buscar cartas disponíveis no sistema"
          icon="pi pi-search" />
      </div>

      <template #footer>
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-3 w-full pt-4 border-t border-neutral-200">
          <span class="text-sm text-neutral-500 font-medium">
            <span class="text-primary-600 font-bold">{{ selectedCards.length }}</span> carta(s) selecionada(s)
          </span>
          <div class="flex gap-2 w-full sm:w-auto">
            <!-- Cancelar também com ButtonItem -->
            <ButtonItem variant="secondary" size="md" @click="closeModal" class="flex-1 sm:flex-none">
              Cancelar
            </ButtonItem>

            <ButtonItem variant="primary" size="md" :disabled="!selectedCards.length" :loading="adding"
              @click="confirmAdd" class="flex-1 sm:flex-none">
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
import { ref, computed, onMounted, onActivated } from 'vue'
import ButtonItem from '@/shared/components/ButtonItem.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import CardItem from '@/shared/components/CardItem.vue'
import { useMyCards } from '@/composables/useMyCards'
import Tooltip from 'primevue/tooltip'

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

const currentIndex = ref(0)
const detailModalVisible = ref(false)


const currentCard = computed(() => cards.value[currentIndex.value])

function nextCard() {
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++
  }
}

function prevCard() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function openDetailModal() {
  detailModalVisible.value = true
}

const vTooltip = Tooltip

onMounted(() => { refresh() })
onActivated(() => { refresh() })
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

/* Fade Scale Transition */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* List Transition (thumbnails) */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>