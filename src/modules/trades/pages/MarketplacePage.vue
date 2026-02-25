<template>
  <div class="marketplace-page">
    <h1>Solicitações de Troca</h1>

    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchTrades">Tentar novamente</button>
    </div>

    <div v-else-if="trades.length === 0" class="empty">
      Nenhuma solicitação de troca encontrada.
    </div>

    <div v-else class="trades-list">
      <div v-for="trade in trades" :key="trade.id" class="trade-card">
        <div class="trade-header">
          <strong>{{ trade.user.name }}</strong>
          <span class="trade-date">{{ formatDate(trade.createdAt) }}</span>
          
          <button 
            v-if="authStore.isAuthenticated && trade.userId === authStore.user?.id"
            @click="deleteTrade(trade.id)"
            class="btn-delete"
          >
            Excluir
          </button>
        </div>

        <div class="trade-content">
          <div class="trade-section">
            <h4>Oferece:</h4>
            <!-- ✅ Filtrado via função, sem v-if no v-for -->
            <div v-for="item in getOfferingCards(trade.tradeCards)" :key="item.id" class="card-item">
              <img :src="item.card.imageUrl" :alt="item.card.name" class="card-thumb" />
              <span>{{ item.card.name }}</span>
            </div>
          </div>

          <div class="trade-section">
            <h4>Recebe:</h4>
            <!-- ✅ Filtrado via função, sem v-if no v-for -->
            <div v-for="item in getReceivingCards(trade.tradeCards)" :key="item.id" class="card-item">
              <img :src="item.card.imageUrl" :alt="item.card.name" class="card-thumb" />
              <span>{{ item.card.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="trades.length > 0" class="pagination">
      <button :disabled="page === 1" @click="changePage(page - 1)">Anterior</button>
      <span>Página {{ page }}</span>
      <button :disabled="!more" @click="changePage(page + 1)">Próxima</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { httpClient } from '@/core/http/httpClient'
import { cacheService } from '@/core/cache/cacheService'

interface TradeCard {
  id: string
  cardId: string
  type: 'OFFERING' | 'RECEIVING'
  card: {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
  }
}

interface Trade {
  id: string
  userId: string
  createdAt: string
  user: { name: string }
  tradeCards: TradeCard[]
}

interface TradesResponse {
  list: Trade[]
  page: number
  rpp: number
  more: boolean
}

const authStore = useAuthStore()
const trades = ref<Trade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const page = ref(1)
const more = ref(false)
const RPP = 10


async function fetchTrades() {
  const cacheKey = `trades:page:${page.value}`
  
  // Tenta pegar do cache primeiro
  const cached = cacheService.get<TradesResponse>(cacheKey)
  if (cached) {
    trades.value = cached.list
    more.value = cached.more
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await httpClient.get<TradesResponse>(`/trades?page=${page.value}&rpp=${RPP}`)
    trades.value = response.list
    more.value = response.more
    
    // Salva no cache
    cacheService.set(cacheKey, response)
  } catch (e) {
    error.value = 'Erro ao carregar solicitações. Tente novamente.'
    console.error('Erro fetch trades:', e)
  } finally {
    loading.value = false
  }
}

// Invalida cache após deletar trade
async function deleteTrade(tradeId: string) {
  if (!confirm('Confirmar exclusão desta solicitação?')) return

  try {
    await httpClient.delete(`/trades/${tradeId}`)
    trades.value = trades.value.filter(t => t.id !== tradeId)
    
    // Invalida cache dos trades
    cacheService.remove(`trades:page:${page.value}`)
  } catch (e) {
    alert('Erro ao excluir solicitação')
    console.error('Erro delete trade:', e)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

function changePage(newPage: number) {
  if (newPage < 1) return
  page.value = newPage
  fetchTrades()
}

function getOfferingCards(cards: TradeCard[]) {
  return cards.filter(c => c.type === 'OFFERING')
}

function getReceivingCards(cards: TradeCard[]) {
  return cards.filter(c => c.type === 'RECEIVING')
}

onMounted(() => {
  fetchTrades()
})
</script>

<style scoped>
.marketplace-page {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .empty, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc2626;
}

.trades-list {
  display: grid;
  gap: 1rem;
}

.trade-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.trade-date {
  font-size: 0.875rem;
  color: #666;
}

.btn-delete {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-delete:hover {
  background: #b91c1c;
}

.trade-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.trade-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.card-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.card-thumb {
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .trade-content {
    grid-template-columns: 1fr;
  }
}
</style>