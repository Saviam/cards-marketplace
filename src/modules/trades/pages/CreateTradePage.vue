<template>
  <div class="create-trade-page">
    <h1>Nova Solicitação de Troca</h1>

    <!-- Loading inicial -->
    <div v-if="loading" class="loading">Carregando cartas...</div>

    <!-- Erro -->
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="initializePage">Tentar novamente</button>
    </div>

    <!-- Conteúdo -->
    <div v-else class="trade-form">
      <!-- Seção: Cartas que vou oferecer -->
      <section class="trade-section">
        <h2>1. Selecione as cartas que vai OFERECER</h2>
        <p class="section-hint">Cartas da sua coleção</p>

        <div v-if="myCards.length === 0" class="no-cards">
          Você não tem cartas. 
          <router-link to="/minhas-cartas">Adicione cartas primeiro</router-link>
        </div>

        <div v-else class="cards-selection">
          <div 
            v-for="card in myCards" 
            :key="card.id" 
            class="card-selectable"
            :class="{ selected: offeringCards.includes(card.id) }"
            @click="toggleOffering(card.id)"
          >
            <img :src="card.imageUrl" :alt="card.name" class="card-thumb" />
            <div class="card-info">
              <strong>{{ card.name }}</strong>
            </div>
            <div v-if="offeringCards.includes(card.id)" class="checkmark">✓</div>
          </div>
        </div>
      </section>

      <!-- Seção: Cartas que quero receber -->
      <section class="trade-section">
        <h2>2. Selecione as cartas que vai RECEBER</h2>
        <p class="section-hint">Cartas disponíveis no sistema</p>

        <div class="search-box">
          <input 
            v-model="searchQuery" 
            @input="debouncedSearch"
            type="text" 
            placeholder="Buscar cartas..."
          />
        </div>

        <div v-if="searching" class="searching">Buscando...</div>

        <div v-else-if="availableCards.length === 0" class="no-cards">
          {{ searchQuery ? 'Nenhuma carta encontrada.' : 'Digite para buscar cartas.' }}
        </div>

        <div v-else class="cards-selection">
          <div 
            v-for="card in availableCards" 
            :key="card.id" 
            class="card-selectable"
            :class="{ selected: receivingCards.includes(card.id) }"
            @click="toggleReceiving(card.id)"
          >
            <img :src="card.imageUrl" :alt="card.name" class="card-thumb" />
            <div class="card-info">
              <strong>{{ card.name }}</strong>
            </div>
            <div v-if="receivingCards.includes(card.id)" class="checkmark">✓</div>
          </div>
        </div>
      </section>

      <!-- Resumo e Submit -->
      <section class="trade-summary">
        <h2>Resumo</h2>
        <div class="summary-content">
          <div>
            <strong>Oferecendo:</strong> {{ offeringCards.length }} carta(s)
          </div>
          <div>
            <strong>Recebendo:</strong> {{ receivingCards.length }} carta(s)
          </div>
        </div>

        <div class="actions">
          <button 
            @click="submitTrade" 
            :disabled="!canSubmit || submitting"
            class="btn-submit"
          >
            {{ submitting ? 'Enviando...' : 'Criar Solicitação de Troca' }}
          </button>
          <router-link to="/marketplace" class="btn-cancel">Cancelar</router-link>
        </div>

        <p v-if="submitError" class="submit-error">{{ submitError }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { httpClient } from '@/core/http/httpClient'
import { cacheService } from '@/core/cache/cacheService'

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

const router = useRouter()

// Estado
const loading = ref(false)
const error = ref<string | null>(null)
const myCards = ref<Card[]>([])
const availableCards = ref<Card[]>([])

// Seleção
const offeringCards = ref<string[]>([])
const receivingCards = ref<string[]>([])

// Busca
const searchQuery = ref('')
const searching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Submit
const submitting = ref(false)
const submitError = ref<string | null>(null)

// Computed manual
const canSubmit = ref(false)

function updateCanSubmit() {
  canSubmit.value = offeringCards.value.length > 0 && receivingCards.value.length > 0
}

async function initializePage() {
  loading.value = true
  error.value = null

  try {
    const [myCardsRes, allCardsRes] = await Promise.all([
      httpClient.get<Card[]>('/me/cards'),
      
      // Cache do catálogo de cartas
      (() => {
        const cached = cacheService.get<CardsListResponse>('cards-catalog')
        if (cached) return Promise.resolve(cached)
        
        return httpClient.get<CardsListResponse>('/cards?page=1&rpp=50')
          .then(res => {
            cacheService.set('cards-catalog', res)
            return res
          })
      })()
    ])

    myCards.value = myCardsRes
    availableCards.value = allCardsRes.list
  } catch (e) {
    error.value = 'Erro ao carregar cartas. Tente novamente.'
    console.error('Erro initialize:', e)
  } finally {
    loading.value = false
  }
}

function toggleOffering(cardId: string) {
  const index = offeringCards.value.indexOf(cardId)
  if (index > -1) {
    offeringCards.value.splice(index, 1)
  } else {
    offeringCards.value.push(cardId)
  }
  updateCanSubmit()
}

function toggleReceiving(cardId: string) {
  const index = receivingCards.value.indexOf(cardId)
  if (index > -1) {
    receivingCards.value.splice(index, 1)
  } else {
    receivingCards.value.push(cardId)
  }
  updateCanSubmit()
}

function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(() => {
    searchCards()
  }, 300)
}

async function searchCards() {
  if (!searchQuery.value.trim()) {
    availableCards.value = []
    return
  }

  searching.value = true
  
  try {
    const response = await httpClient.get<CardsListResponse>('/cards?page=1&rpp=50')
    
    availableCards.value = response.list.filter(card =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  } catch (e) {
    console.error('Erro search:', e)
    availableCards.value = []
  } finally {
    searching.value = false
  }
}

async function submitTrade() {
  if (!canSubmit.value) return

  submitting.value = true
  submitError.value = null

  try {
    const tradeCards = [
      ...offeringCards.value.map(id => ({ cardId: id, type: 'OFFERING' })),
      ...receivingCards.value.map(id => ({ cardId: id, type: 'RECEIVING' }))
    ]

    await httpClient.post('/trades', { cards: tradeCards })

    alert('Solicitação de troca criada com sucesso!')
    router.push('/marketplace')
  } catch (e) {
    submitError.value = 'Erro ao criar solicitação. Tente novamente.'
    console.error('Erro submit trade:', e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  initializePage()
})
</script>

<style scoped>
.create-trade-page {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc2626;
}

.trade-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.trade-section h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.section-hint {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.875rem;
}

.no-cards {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
  color: #666;
}

.no-cards a {
  color: #4f46e5;
}

.cards-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.card-selectable {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: #fff;
}

.card-selectable:hover {
  border-color: #4f46e5;
}

.card-selectable.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.card-thumb {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
  margin-bottom: 0.5rem;
}

.card-info strong {
  font-size: 0.875rem;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.checkmark {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #4f46e5;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.search-box input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.searching {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.trade-summary {
  background: #f9fafb;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
}

.trade-summary h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.summary-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 6px;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-submit {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-submit:hover:not(:disabled) {
  background: #4338ca;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  color: #333;
  text-decoration: none;
}

.submit-error {
  margin-top: 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .cards-selection {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .summary-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>