
// Response padrão de listagem com paginação
export interface ApiListResponse<T> {
  list: T[]
  page: number
  rpp: number
  more: boolean
}

// Response padrão de item único
export interface ApiSingleResponse<T> {
  data: T
}

// Response de erro da API
export interface ApiErrorResponse {
  message: string
  error?: string
  statusCode?: number
}

// Payload de autenticação
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Usuário
export interface User {
  id: string
  name: string
  email: string
}