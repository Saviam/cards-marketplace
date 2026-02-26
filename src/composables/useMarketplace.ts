import { ref, onMounted, onActivated } from 'vue'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'
import { useAuthStore } from '@/stores/auth.store'

interface Trade {
  id: string
  userId: string
  user: {
    id: string
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
  console.log('🔵 [useMarketplace] Composable iniciado')

  const toast = useToast()
  const authStore = useAuthStore()

  const trades = ref<Trade[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const more = ref(false)
  const deleting = ref<string | null>(null)

 async function fetchTrades(reset = false) {
  console.log('🔵 [fetchTrades] Iniciando... reset:', reset)
  
  if (reset) page.value = 1
  
  loading.value = true
  error.value = null

  try {
    console.log('🌐 [fetchTrades] Chamando API /trades?page=' + page.value)
    const response = await httpClient.get<TradesResponse>(`/trades?page=${page.value}&rpp=12`)
    console.log(' [fetchTrades] Resposta:', response)
    
    // if (response.list[0]?.tradeCards) {
    //   console.log(' [fetchTrades] tradeCards[0]:', response.list[0].tradeCards[0])
    //   console.log(' [fetchTrades] tradeCards[1]:', response.list[0].tradeCards[1])
    //   console.log(' [fetchTrades] Array completo:', response.list[0].tradeCards)
    // }
    
    trades.value = reset ? response.list : [...trades.value, ...response.list]
    more.value = response.more
    console.log(' [fetchTrades] Trades:', trades.value.length, 'More:', more.value)
  } catch (e) {
    console.error(' [fetchTrades] Erro:', e)
    error.value = 'Erro ao carregar solicitações. Tente novamente.'
  } finally {
    loading.value = false
    console.log(' [fetchTrades] Finalizado')
  }
}

  async function deleteTrade(tradeId: string) {
    if (!confirm('Confirmar exclusão desta solicitação?')) return

    deleting.value = tradeId
    try {
      await httpClient.delete(`/trades/${tradeId}`)
      trades.value = trades.value.filter((t) => t.id !== tradeId)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Solicitação excluída!',
        life: 3000,
      })
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir solicitação',
        life: 3000,
      })
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
  return trade.user?.id === authStore.user.id
}

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

function getOfferedCard(trade: Trade) {
  const offering = trade.tradeCards?.find(tc => tc.type === 'OFFERING')
  return offering?.card || null
}

function getRequestedCard(trade: Trade) {
  const receiving = trade.tradeCards?.find(tc => tc.type === 'RECEIVING')
  return receiving?.card || null
}

  onMounted(() => {
    console.log('🟢 [useMarketplace] onMounted')
    fetchTrades(true)
  })

  onActivated(() => {
    console.log('🟢 [useMarketplace] onActivated')
    fetchTrades(true)
  })

  console.log('🔵 [useMarketplace] Retornando:', {
    trades: trades.value.length,
    loading: loading.value,
    error: error.value,
    more: more.value,
  })

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
