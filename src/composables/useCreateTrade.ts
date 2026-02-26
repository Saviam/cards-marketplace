import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'

interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
}

interface CardsListResponse {
  list: Card[]
  page: number
  rpp: number
  more: boolean
}

export function useCreateTrade() {
  const router = useRouter()
  const toast = useToast()
  
  const submitting = ref(false)
  const myCards = ref<Card[]>([])
  const filteredMyCards = ref<Card[]>([])
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
      filteredMyCards.value = response
    } catch (e) {
      console.error('Erro ao buscar minhas cartas:', e)
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar suas cartas',
        life: 3000
      })
    }
  }

  function filterMyCards() {
    if (!searchOfferingQuery.value.trim()) {
      filteredMyCards.value = myCards.value
      return
    }
    filteredMyCards.value = myCards.value.filter(c =>
      c.name.toLowerCase().includes(searchOfferingQuery.value.toLowerCase())
    )
  }

  async function loadAllAvailableCards() {
    try {
      const response = await httpClient.get<CardsListResponse>('/cards?page=1&rpp=100')
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
      const response = await httpClient.get<CardsListResponse>('/cards?page=1&rpp=50')
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
        filterMyCards()
      } else {
        searchAvailableCards()
      }
    }, 300)
  }

  function toggleOffering(cardId: string) {
    const idx = selectedOffering.value.indexOf(cardId)
    idx > -1 ? selectedOffering.value.splice(idx, 1) : selectedOffering.value.push(cardId)
  }

  function toggleReceiving(cardId: string) {
    const idx = selectedReceiving.value.indexOf(cardId)
    idx > -1 ? selectedReceiving.value.splice(idx, 1) : selectedReceiving.value.push(cardId)
  }

  async function submitTrade() {
  if (!selectedOffering.value.length || !selectedReceiving.value.length) {
    toast.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Selecione pelo menos 1 carta para oferecer e 1 para receber',
      life: 3000
    })
    return
  }

  submitting.value = true
  try {
    // ✅ Formato correto que a API espera
    const tradeCards = [
      ...selectedOffering.value.map(cardId => ({ cardId, type: 'OFFERING' })),
      ...selectedReceiving.value.map(cardId => ({ cardId, type: 'RECEIVING' }))
    ]

    console.log('📤 Enviando troca:', { cards: tradeCards })
    
    await httpClient.post('/trades', {
      cards: tradeCards
    })

    console.log('✅ Troca criada com sucesso!')

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Troca criada com sucesso!',
      life: 3000
    })

    router.push('/marketplace')
  } catch (e) {
    console.error('❌ Erro ao criar troca:', e)
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao criar troca. Tente novamente.',
      life: 3000
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
    filteredMyCards.value = myCards.value
    availableCards.value = []
  }

  return {
    submitting,
    myCards: filteredMyCards,
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