import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
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

export function useMyCards() {
  const toast = useToast()
  
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const modalVisible = ref(false)
  const searchQuery = ref('')
  const searching = ref(false)
  const adding = ref(false)
  const availableCards = ref<Card[]>([])
  const selectedCards = ref<string[]>([])
  
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  async function fetchCards() {
    const cacheKey = 'cards-marketplace:my-cards'
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      try {
        const entry = JSON.parse(cached)
        if (Date.now() - entry.timestamp < 300000) {
          cards.value = entry.cards
          return
        }
      } catch {
        localStorage.removeItem(cacheKey)
      }
    }

    loading.value = true
    error.value = null

    try {
      const result = await httpClient.get<Card[]>('/me/cards')
      cards.value = result
      localStorage.setItem(cacheKey, JSON.stringify({ cards: result, timestamp: Date.now() }))
    } catch (e) {
      error.value = 'Erro ao carregar suas cartas. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  async function searchAvailableCards() {
    if (!searchQuery.value.trim()) {
      availableCards.value = []
      return
    }

    searching.value = true
    try {
      const response = await httpClient.get<CardsListResponse>('/cards?page=1&rpp=50')
      availableCards.value = response.list.filter(c => 
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      selectedCards.value = []
    } catch (e) {
      availableCards.value = []
    } finally {
      searching.value = false
    }
  }

  function debouncedSearch() {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(searchAvailableCards, 300)
  }

  function toggleSelection(cardId: string) {
    const idx = selectedCards.value.indexOf(cardId)
    idx > -1 ? selectedCards.value.splice(idx, 1) : selectedCards.value.push(cardId)
  }

  async function confirmAdd() {
    if (!selectedCards.value.length) return
    
    adding.value = true
    try {
      await httpClient.post('/me/cards', { cardIds: selectedCards.value })
      localStorage.removeItem('cards-marketplace:my-cards')
      await fetchCards()
      closeModal()
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Carta(s) adicionada(s)!', life: 3000 })
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar carta(s)', life: 3000 })
    } finally {
      adding.value = false
    }
  }

  function openModal() {
    modalVisible.value = true
    searchAvailableCards()
  }

  function closeModal() {
    modalVisible.value = false
    searchQuery.value = ''
    availableCards.value = []
    selectedCards.value = []
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  watch(modalVisible, (val) => {
    if (!val) {
      searchQuery.value = ''
      availableCards.value = []
      selectedCards.value = []
    }
  })

  return {
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
    refresh: fetchCards,
    formatDate
  }
}