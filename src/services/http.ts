import { API_BASE_URL } from '../config'

type JsonRequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

export const requestJson = async <T>(path: string, options: JsonRequestOptions = {}): Promise<T> => {
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (response.status === 204) {
    return null as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!response.ok) {
    const errorPayload = isJson ? await response.json() : await response.text()
    const errorMessage =
      typeof errorPayload === 'string'
        ? errorPayload
        : errorPayload?.message ?? JSON.stringify(errorPayload)

    throw new Error(errorMessage || `Request failed (${response.status})`)
  }

  if (!isJson) {
    return (await response.text()) as T
  }

  return (await response.json()) as T
}
