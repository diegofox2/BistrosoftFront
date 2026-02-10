import { vi } from 'vitest'

export const mockFetchSuccess = <T>(data: T, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
  } as Response)
}

export const mockFetchError = (message: string, status = 400) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ message }),
  } as Response)
}

export const mockFetchTextError = (message: string, status = 400) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    headers: new Headers({ 'content-type': 'text/plain' }),
    text: async () => message,
  } as Response)
}

export const mockFetch204 = () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 204,
    headers: new Headers(),
  } as Response)
}
