import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'
import { DEBOUNCE_DELAY_MS, TOAST_LIFE_MS, API_RPP_MAX, API_RPP_SEARCH } from '@/core/constants'
import type { Card, CardsListResponse, CreateTradePayload, TradeCardType } from '@/types'

export function useCreateTrade() {
  const router = useRouter()
  const toast = useToast()
  
  const submitting = ref(false)
  const myCards = ref<Card[]>([])
  const availableCards = ref<Card[]>([])
  
  const selectedOffering = ref<string[]>([])
  const selectedReceiving = ref<string[]>([])
  
  const searchOfferingQuery = ref('')
  const searchReceivingQuery = ref('')
  const searching = ref(false)
  
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  async function fetchMyCards() {
    try {
      const response = await httpClient.get<Card[]>('/me/cards')
      myCards.value = response
    } catch (e) {
      console.error('Erro ao buscar minhas cartas:', e)
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar suas cartas',
        life: TOAST_LIFE_MS
      })
    }
  }

  async function loadAllAvailableCards() {
    try {
      const response = await httpClient.get<CardsListResponse>(`/cards?page=1&rpp=${API_RPP_MAX}`)
      availableCards.value = response.list
    } catch (e) {
      console.error('Erro ao carregar cartas disponíveis:', e)
      availableCards.value = []
    }
  }

  async function searchAvailableCards() {
    if (!searchReceivingQuery.value.trim()) {
      await loadAllAvailableCards()
      return
    }

    searching.value = true
    try {
      const response = await httpClient.get<CardsListResponse>(`/cards?page=1&rpp=${API_RPP_SEARCH}`)
      availableCards.value = response.list.filter(c =>
        c.name.toLowerCase().includes(searchReceivingQuery.value.toLowerCase())
      )
    } catch (e) {
      console.error('Erro na busca:', e)
      availableCards.value = []
    } finally {
      searching.value = false
    }
  }

  function debouncedSearch(type: 'offering' | 'receiving') {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (type === 'offering') {
        // Filtro local para minhas cartas
        // (implementar se necessário)
      } else {
        searchAvailableCards()
      }
    }, DEBOUNCE_DELAY_MS)
  }

  function toggleOffering(cardId: string) {
    if (selectedOffering.value.includes(cardId)) {
      selectedOffering.value = []
    } else {
      selectedOffering.value = [cardId]
    }
  }

  function toggleReceiving(cardId: string) {
    if (selectedReceiving.value.includes(cardId)) {
      selectedReceiving.value = []
    } else {
      selectedReceiving.value = [cardId]
    }
  }

  async function submitTrade() {
    if (selectedOffering.value.length !== 1 || selectedReceiving.value.length !== 1) {
      toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione exatamente 1 carta para oferecer e 1 para receber',
        life: TOAST_LIFE_MS
      })
      return
    }

    submitting.value = true
    try {
      const payload: CreateTradePayload = {
        cards: [
          { cardId: selectedOffering.value[0]!, type: 'OFFERING' as TradeCardType },
          { cardId: selectedReceiving.value[0]!, type: 'RECEIVING' as TradeCardType }
        ]
      }
      
      await httpClient.post('/trades', payload)

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Troca criada com sucesso!',
        life: TOAST_LIFE_MS
      })

      router.push('/marketplace')
    } catch (e) {
      console.error('Erro ao criar troca:', e)
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar troca. Tente novamente.',
        life: TOAST_LIFE_MS
      })
    } finally {
      submitting.value = false
    }
  }

  function resetForm() {
    selectedOffering.value = []
    selectedReceiving.value = []
    searchOfferingQuery.value = ''
    searchReceivingQuery.value = ''
    availableCards.value = []
  }

  return {
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
  }
}