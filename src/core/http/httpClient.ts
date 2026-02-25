const BASE_URL = 'https://cards-marketplace-api.onrender.com'

function getAuthToken(): string | null {
  return localStorage.getItem('token')
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

  // ✅ Verifica se tem conteúdo antes de tentar parsear JSON
  const contentLength = response.headers.get('content-length')
  if (contentLength === '0' || response.status === 204) {
    return {} as T  // Retorna objeto vazio tipado como T
  }

  return response.json()
}

export const httpClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE'
    })
}