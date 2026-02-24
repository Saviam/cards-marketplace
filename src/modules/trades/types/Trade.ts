export interface Trade {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  sellerId: string
  createdAt: string
  status: 'available' | 'sold' | 'reserved'
}