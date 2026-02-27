const BASE_URL = 'https://cards-marketplace-api.onrender.com'

function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

function handleUnauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    },
    ...options
  })

  // Interceptor: trata 401 (token expirado/inválido)
  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (!response.ok) {
    let message = 'Erro na requisição'
    try {
      const error = await response.json()
      message = error?.message || message
    } catch {
      // ignore se não for JSON
    }
    throw new Error(message)
  }

  const contentLength = response.headers.get('content-length')
  if (contentLength === '0' || response.status === 204) {
    return {} as T
  }

  return response.json()
}

export const httpClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' })
}