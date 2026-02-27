import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { httpClient } from '@/core/http/httpClient'
import { CACHE_EXPIRY_MS, DEBOUNCE_DELAY_MS, STORAGE_KEYS, TOAST_LIFE_MS, API_RPP_MAX, API_RPP_SEARCH } from '@/core/constants'
import type { Card, UserCard, CardsListResponse, AddCardsPayload } from '@/types'

export function useMyCards() {
  const toast = useToast()
  
  const cards = ref<UserCard[]>([])
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
    const cached = localStorage.getItem(STORAGE_KEYS.MY_CARDS)
    
    if (cached) {
      try {
        const entry = JSON.parse(cached)
        if (Date.now() - entry.timestamp < CACHE_EXPIRY_MS) {
          cards.value = entry.cards
          return
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.MY_CARDS)
      }
    }

    loading.value = true
    error.value = null

    try {
      const result = await httpClient.get<UserCard[]>('/me/cards')
      cards.value = result
      localStorage.setItem(STORAGE_KEYS.MY_CARDS, JSON.stringify({ cards: result, timestamp: Date.now() }))
    } catch (e) {
      error.value = 'Erro ao carregar suas cartas. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  async function loadAllAvailableCards() {
    searching.value = true
    try {
      const response = await httpClient.get<CardsListResponse>(`/cards?page=1&rpp=${API_RPP_MAX}`)
      availableCards.value = response.list
      selectedCards.value = []
    } catch (e) {
      availableCards.value = []
    } finally {
      searching.value = false
    }
  }

  async function searchAvailableCards() {
    if (!searchQuery.value.trim()) {
      await loadAllAvailableCards()
      return
    }

    searching.value = true
    try {
      const response = await httpClient.get<CardsListResponse>(`/cards?page=1&rpp=${API_RPP_SEARCH}`)
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
    searchTimeout = setTimeout(searchAvailableCards, DEBOUNCE_DELAY_MS)
  }

  function toggleSelection(cardId: string) {
    const idx = selectedCards.value.indexOf(cardId)
    idx > -1 ? selectedCards.value.splice(idx, 1) : selectedCards.value.push(cardId)
  }

  async function confirmAdd() {
    if (!selectedCards.value.length) return
    
    adding.value = true
    try {
      const payload: AddCardsPayload = { cardIds: selectedCards.value }
      await httpClient.post('/me/cards', payload)
      localStorage.removeItem(STORAGE_KEYS.MY_CARDS)
      await fetchCards()
      closeModal()
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Carta(s) adicionada(s)!', life: TOAST_LIFE_MS })
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar carta(s)', life: TOAST_LIFE_MS })
    } finally {
      adding.value = false
    }
  }

  function openModal() {
    modalVisible.value = true
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

  watch(modalVisible, async (val) => {
    if (val) {
      await loadAllAvailableCards()
    } else {
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