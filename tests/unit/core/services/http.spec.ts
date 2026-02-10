import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requestJson } from '@core/services/http'
import { mockFetchSuccess, mockFetchError, mockFetchTextError, mockFetch204 } from '@tests/helpers/mockFetch'

describe('requestJson', () => {
  describe('successful requests', () => {
    it('should make a GET request by default', async () => {
      const mockData = { id: '1', name: 'Test' }
      mockFetchSuccess(mockData)

      const result = await requestJson('/api/test')

      expect(global.fetch).toHaveBeenCalled()
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs[0]).toContain('/api/test')
      expect(callArgs[1]?.method).toBe('GET')
      expect(result).toEqual(mockData)
    })

    it('should make a POST request with body', async () => {
      const mockData = { success: true }
      const requestBody = { name: 'Test' }
      mockFetchSuccess(mockData)

      const result = await requestJson('/api/test', { method: 'POST', body: requestBody })

      expect(global.fetch).toHaveBeenCalled()
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs[0]).toContain('/api/test')
      expect(callArgs[1]?.method).toBe('POST')
      expect(callArgs[1]?.body).toBe(JSON.stringify(requestBody))
      expect(result).toEqual(mockData)
    })

    it('should include Authorization header when token is provided', async () => {
      const mockData = { data: 'protected' }
      mockFetchSuccess(mockData)

      await requestJson('/api/protected', { token: 'my-token' })

      expect(global.fetch).toHaveBeenCalled()
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const headers = callArgs[1]?.headers as Headers
      expect(headers.get('Authorization')).toBe('Bearer my-token')
    })

    it('should handle 204 No Content response', async () => {
      mockFetch204()

      const result = await requestJson('/api/delete')

      expect(result).toBeNull()
    })

    it('should include Content-Type header when body is provided', async () => {
      const mockData = { success: true }
      mockFetchSuccess(mockData)

      await requestJson('/api/test', { method: 'POST', body: { name: 'Test' } })

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const headers = callArgs[1]?.headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
    })

    it('should pass AbortSignal when provided', async () => {
      const mockData = { data: 'test' }
      mockFetchSuccess(mockData)
      const controller = new AbortController()

      await requestJson('/api/test', { signal: controller.signal })

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs[1]?.signal).toBe(controller.signal)
    })
  })

  describe('error handling', () => {
    it('should throw error with message from JSON error response', async () => {
      mockFetchError('Invalid request', 400)

      await expect(requestJson('/api/test')).rejects.toThrow('Invalid request')
    })

    it('should throw error with text from non-JSON error response', async () => {
      mockFetchTextError('Server error', 500)

      await expect(requestJson('/api/test')).rejects.toThrow('Server error')
    })

    it('should throw error with status when no message provided', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      } as Response)

      await expect(requestJson('/api/test')).rejects.toThrow()
    })
  })
})
