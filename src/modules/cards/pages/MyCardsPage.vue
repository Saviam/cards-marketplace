<template>
  <div class="my-cards-page">
    <h1>Minhas Cartas</h1>

    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchMyCards">Tentar novamente</button>
    </div>

    <div v-else>

      <button @click="showAddModal = true" class="btn-add">
        + Adicionar Carta
      </button>

      <!-- Lista de cartas -->
      <div v-if="myCards.length === 0" class="empty">
        Você ainda não tem cartas. Clique em "Adicionar Carta" para começar.
      </div>

      <div v-else class="cards-grid">
        <div v-for="card in myCards" :key="card.id" class="card-item">
          <img :src="card.imageUrl" :alt="card.name" class="card-image" />
          <div class="card-info">
            <h3>{{ card.name }}</h3>
            <p class="card-description">{{ card.description }}</p>
            <span class="card-date">Adicionada em: {{ formatDate(card.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Carta -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h2>Adicionar Carta</h2>

        <div class="search-box">
          <input v-model="searchQuery" @input="searchCards" type="text" placeholder="Buscar cartas disponíveis..." />
        </div>

        <div v-if="searching" class="searching">Buscando...</div>

        <div v-else-if="availableCards.length > 0" class="available-cards">
          <div v-for="card in availableCards" :key="card.id" class="available-card"
            :class="{ selected: selectedCards.includes(card.id) }" @click="toggleCardSelection(card.id)">
            <img :src="card.imageUrl" :alt="card.name" class="card-thumb" />
            <div class="card-details">
              <strong>{{ card.name }}</strong>
              <span>{{ card.description }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="searchQuery" class="no-results">
          Nenhuma carta encontrada.
        </div>

        <div v-else class="no-results">
          Digite para buscar ou aguarde o carregamento...
        </div>

      
        <div v-if="availableCards.length > 0" class="modal-footer">
          <div class="selected-count">
            Selecionadas: {{ selectedCards.length }} carta(s)
          </div>
          <div class="modal-actions">
            <button @click="addCardsToCollection" :disabled="selectedCards.length === 0" class="btn-confirm">
              Adicionar {{ selectedCards.length > 0 ? selectedCards.length : '' }} carta(s)
            </button>
            <button @click="showAddModal = false" class="btn-cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import { httpClient } from '@/core/http/httpClient'


interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

interface CardsListResponse {
  list: Card[]
  page: number
  rpp: number
  more: boolean
}


const myCards = ref<Card[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


const showAddModal = ref(false)
const searchQuery = ref('')
const searching = ref(false)
const availableCards = ref<Card[]>([])
const selectedCards = ref<string[]>([])

async function fetchMyCards() {
  loading.value = true
  error.value = null

  try {
    const cards = await httpClient.get<Card[]>('/me/cards')
    myCards.value = cards
  } catch (e) {
    error.value = 'Erro ao carregar suas cartas. Tente novamente.'
    console.error('Erro fetch my cards:', e)
  } finally {
    loading.value = false
  }
}

async function searchCards() {
  if (!searchQuery.value.trim()) {
    availableCards.value = []
    return
  }

  searching.value = true

  try {

    const response = await httpClient.get<CardsListResponse>(`/cards?page=1&rpp=20`)

    availableCards.value = response.list.filter(card =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    selectedCards.value = []
  } catch (e) {
    console.error('Erro search cards:', e)
    availableCards.value = []
  } finally {
    searching.value = false
  }
}

function toggleCardSelection(cardId: string) {
  const index = selectedCards.value.indexOf(cardId)
  if (index > -1) {
    selectedCards.value.splice(index, 1)
  } else {
    selectedCards.value.push(cardId)
  }
}

async function addCardsToCollection() {
  try {
    await httpClient.post('/me/cards', {
      cardIds: selectedCards.value
    })

    await fetchMyCards()
    showAddModal.value = false
    searchQuery.value = ''
    availableCards.value = []
    selectedCards.value = []

    alert('Carta(s) adicionada(s) com sucesso!')
  } catch (e) {
    alert('Erro ao adicionar carta(s)')
    console.error('Erro add cards:', e)
  }
}
// Carrega todas as cartas quando modal abre
watch(showAddModal, async (newValue) => {
  if (newValue) {
    try {
      searching.value = true
      const response = await httpClient.get<CardsListResponse>('/cards?page=1&rpp=100')
      availableCards.value = response.list
      selectedCards.value = []
      searchQuery.value = ''
    } catch (e) {
      console.error('Erro ao carregar cartas:', e)
      availableCards.value = []
    } finally {
      searching.value = false
    }
  } else {
    availableCards.value = []
    selectedCards.value = []
    searchQuery.value = ''
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchMyCards()
})
</script>

<style scoped>
.my-cards-page {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.empty,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc2626;
}

.btn-add {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.btn-add:hover {
  background: #4338ca;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  background: #f5f5f5;
}

.card-info {
  padding: 1rem;
}

.card-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: #333;
}

.card-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.card-date {
  font-size: 0.75rem;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin: 0 0 1rem 0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.searching,
.no-results {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.available-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.available-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.available-card:hover {
  border-color: #4f46e5;
}

.available-card.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.card-thumb {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
}

.card-details {
  flex: 1;
}

.card-details strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #333;
}

.card-details span {
  font-size: 0.875rem;
  color: #666;
}

.btn-confirm {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.selected-count {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>