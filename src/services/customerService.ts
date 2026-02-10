import { requestJson } from './http'
import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerDetails,
  CustomerOrder,
} from '../types/api'

export const createCustomer = async (token: string, payload: CreateCustomerRequest) =>
  requestJson<CreateCustomerResponse>('/api/Customers', {
    method: 'POST',
    body: payload,
    token,
  })

export const getCustomer = async (token: string, customerId: string) =>
  requestJson<CustomerDetails>(`/api/Customers/${customerId}`, { token })

export const getCustomerOrders = async (token: string, customerId: string) =>
  requestJson<CustomerOrder[]>(`/api/Customers/${customerId}/orders`, { token })
