const CACHE_PREFIX = 'cards-marketplace:'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export const cacheService = {
  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry))
  },

  get<T>(key: string): T | null {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (!item) return null

    try {
      const entry: CacheEntry<T> = JSON.parse(item)
      const isExpired = Date.now() - entry.timestamp > CACHE_TTL

      if (isExpired) {
        this.remove(key)
        return null
      }

      return entry.data
    } catch {
      this.remove(key)
      return null
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`)
  },

  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX))
    keys.forEach(k => localStorage.removeItem(k))
  }
}