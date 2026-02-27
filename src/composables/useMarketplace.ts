import { ref, onMounted, onActivated } from 'vue'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'
import { useAuthStore } from '@/stores/auth.store'
import { TOAST_LIFE_MS, API_RPP_DEFAULT } from '@/core/constants'
import type { Trade, TradesListResponse, TradeCard, TradeCardType } from '@/types'
import { useConfirm } from 'primevue/useconfirm'

export function useMarketplace() {
  const confirmDialog = useConfirm()
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
      const response = await httpClient.get<TradesListResponse>(`/trades?page=${page.value}&rpp=${API_RPP_DEFAULT}`)
      trades.value = reset ? response.list : [...trades.value, ...response.list]
      more.value = response.more
    } catch (e) {
      error.value = 'Erro ao carregar solicitações. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

 async function deleteTrade(tradeId: string) {
  confirmDialog.require({
    message: 'Deseja realmente excluir esta solicitação de troca?',
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Excluir',
    rejectLabel: 'Cancelar',
    acceptClass: 'bg-red-600 border-0',
    rejectClass: 'bg-neutral-200 text-neutral-700 border-0',
    accept: async () => {
      deleting.value = tradeId
      try {
        await httpClient.delete(`/trades/${tradeId}`)
        trades.value = trades.value.filter(t => t.id !== tradeId)
        toast.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Solicitação excluída com sucesso!', 
          life: TOAST_LIFE_MS 
        })
      } catch (e) {
        toast.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao excluir solicitação', 
          life: TOAST_LIFE_MS 
        })
      } finally {
        deleting.value = null
      }
    },
    reject: () => {
      // Usuário cancelou
    }
  })
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
    const offering = trade.tradeCards?.find((tc): tc is TradeCard & { type: 'OFFERING' } => tc.type === 'OFFERING')
    return offering?.card || null
  }

  function getRequestedCard(trade: Trade) {
    const receiving = trade.tradeCards?.find((tc): tc is TradeCard & { type: 'RECEIVING' } => tc.type === 'RECEIVING')
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