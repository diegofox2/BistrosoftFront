import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@modules/auth/stores/authStore'
import { setupTestPinia } from '@tests/helpers/storeHelpers'
import { mockFetchSuccess, mockFetchError } from '@tests/helpers/mockFetch'
import type { TokenResponse } from '@modules/auth/types'

describe('authStore', () => {
  beforeEach(() => {
    setupTestPinia()
    window.localStorage.clear()
  })

  describe('initial state', () => {
    it('should initialize with idle state and no token', () => {
      const store = useAuthStore()

      expect(store.token).toBeNull()
      expect(store.username).toBe('')
      expect(store.status).toBe('idle')
      expect(store.errorMessage).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should load token from localStorage if available', () => {
      window.localStorage.setItem('bistrosoft_token', 'stored-token')
      window.localStorage.setItem('bistrosoft_username', 'storeduser')

      const store = useAuthStore()

      expect(store.token).toBe('stored-token')
      expect(store.username).toBe('storeduser')
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'new-token-123' }
      mockFetchSuccess(mockResponse)

      await store.login('testuser', 'password123')

      expect(store.status).toBe('success')
      expect(store.token).toBe('new-token-123')
      expect(store.username).toBe('testuser')
      expect(store.isAuthenticated).toBe(true)
      expect(store.errorMessage).toBeNull()
      expect(window.localStorage.getItem('bistrosoft_token')).toBe('new-token-123')
      expect(window.localStorage.getItem('bistrosoft_username')).toBe('testuser')
    })

    it('should trim username whitespace', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'token' }
      mockFetchSuccess(mockResponse)

      await store.login('  testuser  ', 'password123')

      expect(store.username).toBe('testuser')
      expect(window.localStorage.getItem('bistrosoft_username')).toBe('testuser')
    })

    it('should handle login failure', async () => {
      const store = useAuthStore()
      mockFetchError('Invalid credentials', 401)

      await store.login('wronguser', 'wrongpass')

      expect(store.status).toBe('error')
      expect(store.token).toBeNull()
      expect(store.username).toBe('')
      expect(store.isAuthenticated).toBe(false)
      expect(store.errorMessage).toBe('Invalid credentials')
      expect(window.localStorage.getItem('bistrosoft_token')).toBeNull()
    })

    it('should validate empty username', async () => {
      const store = useAuthStore()

      await store.login('', 'password')

      expect(store.status).toBe('error')
      expect(store.errorMessage).toBe('Username and password are required.')
      expect(store.token).toBeNull()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should validate empty password', async () => {
      const store = useAuthStore()

      await store.login('username', '')

      expect(store.status).toBe('error')
      expect(store.errorMessage).toBe('Username and password are required.')
      expect(store.token).toBeNull()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should validate whitespace-only username', async () => {
      const store = useAuthStore()

      await store.login('   ', 'password')

      expect(store.status).toBe('error')
      expect(store.errorMessage).toBe('Username and password are required.')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should set loading status during login', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'token' }
      
      // Mock fetch to return a promise we can control
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      global.fetch = vi.fn().mockReturnValue(promise)

      const loginPromise = store.login('user', 'pass')
      
      // Check loading state immediately
      expect(store.status).toBe('loading')
      expect(store.errorMessage).toBeNull()

      // Resolve the promise
      resolvePromise!({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      })

      await loginPromise
      expect(store.status).toBe('success')
    })

    it('should handle non-Error objects in catch', async () => {
      const store = useAuthStore()
      global.fetch = vi.fn().mockRejectedValue('String error')

      await store.login('user', 'pass')

      expect(store.status).toBe('error')
      expect(store.errorMessage).toBe('Login failed.')
    })
  })

  describe('logout', () => {
    it('should clear all auth data', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'token-to-clear' }
      mockFetchSuccess(mockResponse)

      // Login first
      await store.login('testuser', 'password')
      expect(store.isAuthenticated).toBe(true)

      // Then logout
      store.logout()

      expect(store.token).toBeNull()
      expect(store.username).toBe('')
      expect(store.status).toBe('idle')
      expect(store.errorMessage).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(window.localStorage.getItem('bistrosoft_token')).toBeNull()
      expect(window.localStorage.getItem('bistrosoft_username')).toBeNull()
    })

    it('should work even when not logged in', () => {
      const store = useAuthStore()

      store.logout()

      expect(store.token).toBeNull()
      expect(store.username).toBe('')
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('isAuthenticated getter', () => {
    it('should return true when token exists', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'valid-token' }
      mockFetchSuccess(mockResponse)

      await store.login('user', 'pass')

      expect(store.isAuthenticated).toBe(true)
    })

    it('should return false when token is null', () => {
      const store = useAuthStore()

      expect(store.isAuthenticated).toBe(false)
    })

    it('should return false after logout', async () => {
      const store = useAuthStore()
      const mockResponse: TokenResponse = { token: 'token' }
      mockFetchSuccess(mockResponse)

      await store.login('user', 'pass')
      expect(store.isAuthenticated).toBe(true)

      store.logout()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})
