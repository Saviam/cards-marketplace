
import type { ApiListResponse, User } from './api' 

// Card básico (sem dados do usuário)
export interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  createdAt?: string
}

// Card com dados estendidos (quando vem do "me/cards")
export interface UserCard extends Card {
  createdAt: string
  addedAt?: string
}

// Card no contexto de uma troca
export interface TradeCard {
  id: string
  cardId: string
  tradeId: string
  type: TradeCardType
  card: Card
}

// Tipo da carta na troca (oferecendo ou recebendo)
export type TradeCardType = 'OFFERING' | 'RECEIVING'

// Payload para adicionar cartas
export interface AddCardsPayload {
  cardIds: string[]
}

// Response de lista de cards
export type CardsListResponse = ApiListResponse<Card>