import { requestJson } from '@core/services/http'
import type { TokenResponse } from '../types'

export const requestToken = async (username: string, password: string) =>
  requestJson<TokenResponse>('/api/Auth/token', {
    method: 'POST',
    body: { username, password },
  })
