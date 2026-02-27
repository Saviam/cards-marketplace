import type { ApiListResponse, User } from './api'
import type { TradeCard, TradeCardType } from './card'

// Status possível de uma troca
export type TradeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

// Trade completo
export interface Trade {
  id: string
  userId: string
  user?: Pick<User, 'id' | 'name'>
  tradeCards: TradeCard[]
  status: TradeStatus
  createdAt: string
}

// Payload para criar troca
export interface CreateTradePayload {
  cards: Array<{
    cardId: string
    type: TradeCardType
  }>
}

// Response de lista de trades
export type TradesListResponse = ApiListResponse<Trade>

// Filtros para busca de trades
export interface TradeFilters {
  status?: TradeStatus
  userId?: string
  page?: number
  rpp?: number
}