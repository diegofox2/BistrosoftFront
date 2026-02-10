import { describe, it, expect, vi } from 'vitest'
import { requestToken } from '@modules/auth/services/authService'
import { mockFetchSuccess, mockFetchError } from '@tests/helpers/mockFetch'
import type { TokenResponse } from '@modules/auth/types'

describe('authService', () => {
  describe('requestToken', () => {
    it('should request token with correct credentials', async () => {
      const mockResponse: TokenResponse = { token: 'test-token-123' }
      mockFetchSuccess(mockResponse)

      const result = await requestToken('testuser', 'password123')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Auth/token'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(result.token).toBe('test-token-123')
    })

    it('should throw error on invalid credentials', async () => {
      mockFetchError('Invalid credentials', 401)

      await expect(requestToken('invalid', 'wrong')).rejects.toThrow('Invalid credentials')
    })

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(requestToken('user', 'pass')).rejects.toThrow('Network error')
    })
  })
})
