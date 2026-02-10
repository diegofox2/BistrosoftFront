import { describe, it, expect } from 'vitest'
import { createCustomer, getCustomer, getCustomerOrders } from '@modules/customers/services/customerService'
import { mockFetchSuccess, mockFetchError } from '@tests/helpers/mockFetch'
import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerDetails,
  CustomerOrder,
} from '@modules/customers/types'

describe('customerService', () => {
  const mockToken = 'test-token-123'

  describe('createCustomer', () => {
    it('should create a customer with all fields', async () => {
      const request: CreateCustomerRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
      }

      const mockResponse: CreateCustomerResponse = {
        id: 'customer-123',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
      }

      mockFetchSuccess(mockResponse)

      const result = await createCustomer(mockToken, request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Customers'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(request),
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should create a customer without phone number', async () => {
      const request: CreateCustomerRequest = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      }

      const mockResponse: CreateCustomerResponse = {
        id: 'customer-456',
        name: 'Jane Smith',
        email: 'jane@example.com',
      }

      mockFetchSuccess(mockResponse)

      const result = await createCustomer(mockToken, request)

      expect(result).toEqual(mockResponse)
      expect(result.phoneNumber).toBeUndefined()
    })

    it('should include authorization token', async () => {
      const request: CreateCustomerRequest = {
        name: 'Test User',
        email: 'test@example.com',
      }

      mockFetchSuccess({ id: '1', name: 'Test User', email: 'test@example.com' })

      await createCustomer(mockToken, request)

      const callArgs = (global.fetch as any).mock.calls[0]
      const headers = callArgs[1]?.headers as Headers
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`)
    })

    it('should handle creation errors', async () => {
      const request: CreateCustomerRequest = {
        name: 'Error User',
        email: 'error@example.com',
      }

      mockFetchError('Email already exists', 400)

      await expect(createCustomer(mockToken, request)).rejects.toThrow('Email already exists')
    })
  })

  describe('getCustomer', () => {
    it('should retrieve customer details', async () => {
      const customerId = 'customer-123'
      const mockResponse: CustomerDetails = {
        id: customerId,
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        orders: [
          {
            id: 'order-1',
            status: 1,
            totalAmount: 150.50,
            createdAt: '2026-02-09T10:00:00Z',
          },
        ],
      }

      mockFetchSuccess(mockResponse)

      const result = await getCustomer(mockToken, customerId)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/Customers/${customerId}`),
        expect.any(Object)
      )
      expect(result).toEqual(mockResponse)
      expect(result.orders).toHaveLength(1)
    })

    it('should handle customer not found', async () => {
      mockFetchError('Customer not found', 404)

      await expect(getCustomer(mockToken, 'non-existent')).rejects.toThrow('Customer not found')
    })

    it('should handle null phone number', async () => {
      const mockResponse: CustomerDetails = {
        id: 'customer-789',
        name: 'No Phone User',
        email: 'nophone@example.com',
        phoneNumber: null,
        orders: [],
      }

      mockFetchSuccess(mockResponse)

      const result = await getCustomer(mockToken, 'customer-789')

      expect(result.phoneNumber).toBeNull()
    })
  })

  describe('getCustomerOrders', () => {
    it('should retrieve customer orders', async () => {
      const customerId = 'customer-123'
      const mockOrders: CustomerOrder[] = [
        {
          orderId: 'order-1',
          status: 1,
          totalAmount: 100.0,
          createdAt: '2026-02-09T10:00:00Z',
          items: [
            { productId: 'prod-1', quantity: 2, unitPrice: 50.0 },
          ],
        },
        {
          orderId: 'order-2',
          status: 2,
          totalAmount: 200.0,
          createdAt: '2026-02-09T11:00:00Z',
          items: [
            { productId: 'prod-2', quantity: 1, unitPrice: 200.0 },
          ],
        },
      ]

      mockFetchSuccess(mockOrders)

      const result = await getCustomerOrders(mockToken, customerId)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/Customers/${customerId}/orders`),
        expect.any(Object)
      )
      expect(result).toHaveLength(2)
      expect(result[0].items).toHaveLength(1)
      expect(result[1].totalAmount).toBe(200.0)
    })

    it('should handle empty orders list', async () => {
      const mockOrders: CustomerOrder[] = []
      mockFetchSuccess(mockOrders)

      const result = await getCustomerOrders(mockToken, 'customer-456')

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle authorization errors', async () => {
      mockFetchError('Unauthorized', 401)

      await expect(getCustomerOrders(mockToken, 'customer-123')).rejects.toThrow('Unauthorized')
    })
  })
})
