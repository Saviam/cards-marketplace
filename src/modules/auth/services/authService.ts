import { httpClient } from '@/core/http/httpClient'
import { useAuthStore } from '@/stores/auth.store'

interface RegisterPayload {
  name: string
  email: string
  password: string
}

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface MeResponse {
  id: string
  name: string
  email: string
  cards: unknown[]
}

export const authService = {
 async register(payload: RegisterPayload) {
  
  const response = await httpClient.post<{ userId: string }>('/register', payload)
  
  return response
},
  async login(payload: LoginPayload) {
    const authStore = useAuthStore()

    authStore.setLoading(true)
    authStore.setError(null)

    try {
      const response = await httpClient.post<LoginResponse>('/login', payload)

      if (!response.token || !response.user) {
        throw new Error('Resposta inválida da API')
      }

      authStore.setAuth(response.token, response.user)

      return response
    } catch (error: unknown) {
      console.error('[DEBUG] Login error:', error)

      const message =
        error instanceof Error ? error.message : 'Email ou senha inválidos'

      authStore.setError(message)
      throw error
    } finally {
      authStore.setLoading(false)
    }
  },

  async getMe() {
    const authStore = useAuthStore()

    try {
      const user = await httpClient.get<MeResponse>('/me')

      authStore.user = {
        id: user.id,
        name: user.name,
        email: user.email
      }

      return user
    } catch (error) {
      console.error('[DEBUG] getMe error:', error)
      authStore.logout()
      throw error
    }
  }
}