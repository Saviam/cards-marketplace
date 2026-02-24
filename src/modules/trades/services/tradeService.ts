import type { Trade } from '../types/Trade'

const mockTrades: Trade[] = [
  {
    id: '1',
    title: 'Charizard 1ª Edição',
    description: 'Carta rara em excelente estado.',
    price: 2500,
    imageUrl: 'https://via.placeholder.com/300x400',
    sellerId: 'user1',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
  {
    id: '2',
    title: 'Blue-Eyes White Dragon',
    description: 'Edição clássica, levemente usada.',
    price: 1200,
    imageUrl: 'https://via.placeholder.com/300x400',
    sellerId: 'user2',
    createdAt: new Date().toISOString(),
    status: 'reserved'
  },
  {
    id: '3',
    title: 'Black Lotus',
    description: 'Carta lendária extremamente rara.',
    price: 150000,
    imageUrl: 'https://via.placeholder.com/300x400',
    sellerId: 'user3',
    createdAt: new Date().toISOString(),
    status: 'available'
  }
]

export const tradeService = {
  async getAll(): Promise<Trade[]> {
    await simulateDelay()
    return mockTrades
  },

  async getById(id: string): Promise<Trade | undefined> {
    await simulateDelay()
    return mockTrades.find(trade => trade.id === id)
  },

  async create(trade: Trade): Promise<Trade> {
    await simulateDelay()
    mockTrades.push(trade)
    return trade
  }
}

function simulateDelay(ms = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}