import { ref, onMounted, onActivated } from 'vue'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'
import { useAuthStore } from '@/stores/auth.store'
import { TOAST_LIFE_MS, API_RPP_DEFAULT } from '@/core/constants'

interface Trade {
  id: string
  userId: string
  user?: {
    id?: string
    name: string
  }
  tradeCards: Array<{
    id: string
    cardId: string
    tradeId: string
    type: 'OFFERING' | 'RECEIVING'
    card: {
      id: string
      name: string
      description: string
      imageUrl: string
    }
  }>
  status: string
  createdAt: string
}

interface TradesResponse {
  list: Trade[]
  page: number
  rpp: number
  more: boolean
}

export function useMarketplace() {
  const toast = useToast()
  const authStore = useAuthStore()
  
  const trades = ref<Trade[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const more = ref(false)
  const deleting = ref<string | null>(null)

  async function fetchTrades(reset = false) {
    if (reset) page.value = 1
    
    loading.value = true
    error.value = null

    try {
      const response = await httpClient.get<TradesResponse>(`/trades?page=${page.value}&rpp=${API_RPP_DEFAULT}`)
      trades.value = reset ? response.list : [...trades.value, ...response.list]
      more.value = response.more
    } catch (e) {
      error.value = 'Erro ao carregar solicitações. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  async function deleteTrade(tradeId: string) {
    if (!confirm('Confirmar exclusão desta solicitação?')) return
    
    deleting.value = tradeId
    try {
      await httpClient.delete(`/trades/${tradeId}`)
      trades.value = trades.value.filter(t => t.id !== tradeId)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação excluída!', life: TOAST_LIFE_MS })
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir solicitação', life: TOAST_LIFE_MS })
    } finally {
      deleting.value = null
    }
  }

  function loadMore() {
    if (!loading.value && more.value) {
      page.value++
      fetchTrades()
    }
  }

  function isOwner(trade: Trade): boolean {
    if (!authStore.isAuthenticated || !authStore.user) return false
    return authStore.user.id === trade.userId
  }

  function getOfferedCard(trade: Trade) {
    const offering = trade.tradeCards?.find(tc => tc.type === 'OFFERING')
    return offering?.card || null
  }

  function getRequestedCard(trade: Trade) {
    const receiving = trade.tradeCards?.find(tc => tc.type === 'RECEIVING')
    return receiving?.card || null
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  onMounted(() => { fetchTrades(true) })
  onActivated(() => { fetchTrades(true) })

  return {
    trades,
    loading,
    error,
    more,
    deleting,
    isOwner,
    deleteTrade,
    loadMore,
    formatDate,
    fetchTrades,
    getOfferedCard,
    getRequestedCard
  }
}