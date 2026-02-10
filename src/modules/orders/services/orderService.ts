import { requestJson } from '@core/services/http'
import type { CreateOrderRequest, CreateOrderResponse, OrderStatusResponse, OrderStatusValue } from '../types'

export const createOrder = async (token: string, payload: CreateOrderRequest) =>
  requestJson<CreateOrderResponse>('/api/Orders', {
    method: 'POST',
    body: payload,
    token,
  })

export const updateOrderStatus = async (
  token: string,
  orderId: string,
  newStatus: OrderStatusValue,
) =>
  requestJson<OrderStatusResponse>(`/api/Orders/${orderId}/status`, {
    method: 'PUT',
    body: { newStatus },
    token,
  })
