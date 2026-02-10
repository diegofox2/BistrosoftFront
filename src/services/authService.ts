import { requestJson } from './http'
import type { TokenResponse } from '../types/api'

export const requestToken = async (username: string, password: string) =>
  requestJson<TokenResponse>('/api/Auth/token', {
    method: 'POST',
    body: { username, password },
  })
