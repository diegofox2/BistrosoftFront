import { defineStore } from 'pinia'
import { requestToken } from '../services/authService'

const getStoredValue = (key: string) =>
  typeof window === 'undefined' ? null : window.localStorage.getItem(key)

const setStoredValue = (key: string, value: string | null) => {
  if (typeof window === 'undefined') {
    return
  }

  if (value === null) {
    window.localStorage.removeItem(key)
    return
  }

  window.localStorage.setItem(key, value)
}

type AuthStatus = 'idle' | 'loading' | 'success' | 'error'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredValue('bistrosoft_token') as string | null,
    username: getStoredValue('bistrosoft_username') ?? '',
    status: 'idle' as AuthStatus,
    errorMessage: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      this.status = 'loading'
      this.errorMessage = null

      if (!username.trim() || !password.trim()) {
        this.status = 'error'
        this.errorMessage = 'Username and password are required.'
        return
      }

      try {
        const response = await requestToken(username.trim(), password)
        this.token = response.token
        this.username = username.trim()
        this.status = 'success'
        setStoredValue('bistrosoft_token', response.token)
        setStoredValue('bistrosoft_username', this.username)
      } catch (error) {
        this.status = 'error'
        this.errorMessage = error instanceof Error ? error.message : 'Login failed.'
      }
    },
    logout() {
      this.token = null
      this.username = ''
      this.status = 'idle'
      this.errorMessage = null
      setStoredValue('bistrosoft_token', null)
      setStoredValue('bistrosoft_username', null)
    },
  },
})
