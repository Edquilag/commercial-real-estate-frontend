export const isDemo = import.meta.env.VITE_USE_MOCK_DATA !== 'false'
export const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const backendOrigin = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '')
export const propertiesEndpoint = import.meta.env.VITE_PROPERTIES_ENDPOINT || '/api/v1/properties'

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>
  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body) headers.set('Content-Type', 'application/json')
  const csrf = document.cookie.split('; ').find((cookie) => cookie.startsWith('XSRF-TOKEN='))?.slice(11)
  if (csrf) headers.set('X-XSRF-TOKEN', decodeURIComponent(csrf))
  const response = await fetch(`${apiOrigin}${path}`, { ...options, headers, credentials: 'include' })
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body?.message || 'The service could not complete your request.', body?.errors)
  return body as T
}
export function queryString(filters: object) {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  return query.toString()
}
export async function demoDelay(signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    const cancel = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) }
    const timer = window.setTimeout(() => { signal?.removeEventListener('abort', cancel); resolve() }, 180)
    signal?.addEventListener('abort', cancel, { once: true })
  })
}
