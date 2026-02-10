import { describe, it, expect } from 'vitest'
import { createOrder, updateOrderStatus } from '@modules/orders/services/orderService'
import { mockFetchSuccess, mockFetchError } from '@tests/helpers/mockFetch'
import type { CreateOrderRequest, CreateOrderResponse, OrderStatusResponse } from '@modules/orders/types'

describe('orderService', () => {
  const mockToken = 'test-token-123'

  describe('createOrder', () => {
    it('should create an order with single item', async () => {
      const request: CreateOrderRequest = {
        customerId: 'customer-123',
        items: [
          { productId: 'prod-1', quantity: 2 },
        ],
      }

      const mockResponse: CreateOrderResponse = {
        orderId: 'order-789',
        status: 0,
        totalAmount: 100.0,
        createdAt: '2026-02-09T10:00:00Z',
      }

      mockFetchSuccess(mockResponse)

      const result = await createOrder(mockToken, request)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Orders'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(request),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(result.status).toBe(0)
    })

    it('should create an order with multiple items', async () => {
      const request: CreateOrderRequest = {
        customerId: 'customer-456',
        items: [
          { productId: 'prod-1', quantity: 2 },
          { productId: 'prod-2', quantity: 1 },
          { productId: 'prod-3', quantity: 5 },
        ],
      }

      const mockResponse: CreateOrderResponse = {
        orderId: 'order-multi-123',
        status: 0,
        totalAmount: 350.75,
        createdAt: '2026-02-09T11:00:00Z',
      }

      mockFetchSuccess(mockResponse)

      const result = await createOrder(mockToken, request)

      expect(result.orderId).toBe('order-multi-123')
      expect(result.totalAmount).toBe(350.75)
    })

    it('should include authorization token', async () => {
      const request: CreateOrderRequest = {
        customerId: 'customer-123',
        items: [{ productId: 'prod-1', quantity: 1 }],
      }

      mockFetchSuccess({
        orderId: '1',
        status: 0,
        totalAmount: 50,
        createdAt: '2026-02-09T10:00:00Z',
      })

      await createOrder(mockToken, request)

      const callArgs = (global.fetch as any).mock.calls[0]
      const headers = callArgs[1]?.headers as Headers
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`)
    })

    it('should handle invalid customer error', async () => {
      const request: CreateOrderRequest = {
        customerId: 'non-existent',
        items: [{ productId: 'prod-1', quantity: 1 }],
      }

      mockFetchError('Customer not found', 404)

      await expect(createOrder(mockToken, request)).rejects.toThrow('Customer not found')
    })

    it('should handle validation errors', async () => {
      const request: CreateOrderRequest = {
        customerId: 'customer-123',
        items: [],
      }

      mockFetchError('Order must have at least one item', 400)

      await expect(createOrder(mockToken, request)).rejects.toThrow('Order must have at least one item')
    })
  })

  describe('updateOrderStatus', () => {
    it('should update order status to Paid', async () => {
      const orderId = 'order-123'
      const newStatus = 1

      const mockResponse: OrderStatusResponse = {
        orderId: orderId,
        status: newStatus,
      }

      mockFetchSuccess(mockResponse)

      const result = await updateOrderStatus(mockToken, orderId, newStatus)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/Orders/${orderId}/status`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ newStatus }),
        })
      )
      expect(result).toEqual(mockResponse)
      expect(result.status).toBe(1)
    })

    it('should update order status to Shipped', async () => {
      const orderId = 'order-456'
      const newStatus = 2

      const mockResponse: OrderStatusResponse = {
        orderId: orderId,
        status: newStatus,
      }

      mockFetchSuccess(mockResponse)

      const result = await updateOrderStatus(mockToken, orderId, newStatus)

      expect(result.status).toBe(2)
    })

    it('should update order status to Delivered', async () => {
      const orderId = 'order-789'
      const newStatus = 3

      const mockResponse: OrderStatusResponse = {
        orderId: orderId,
        status: newStatus,
      }

      mockFetchSuccess(mockResponse)

      const result = await updateOrderStatus(mockToken, orderId, newStatus)

      expect(result.status).toBe(3)
    })

    it('should update order status to Cancelled', async () => {
      const orderId = 'order-999'
      const newStatus = 4

      const mockResponse: OrderStatusResponse = {
        orderId: orderId,
        status: newStatus,
      }

      mockFetchSuccess(mockResponse)

      const result = await updateOrderStatus(mockToken, orderId, newStatus)

      expect(result.status).toBe(4)
    })

    it('should include authorization token', async () => {
      mockFetchSuccess({ orderId: '1', status: 1 })

      await updateOrderStatus(mockToken, 'order-1', 1)

      const callArgs = (global.fetch as any).mock.calls[0]
      const headers = callArgs[1]?.headers as Headers
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`)
    })

    it('should handle order not found error', async () => {
      mockFetchError('Order not found', 404)

      await expect(updateOrderStatus(mockToken, 'non-existent', 1)).rejects.toThrow('Order not found')
    })

    it('should handle invalid status transition', async () => {
      mockFetchError('Invalid status transition', 400)

      await expect(updateOrderStatus(mockToken, 'order-123', 3)).rejects.toThrow('Invalid status transition')
    })

    it('should handle unauthorized access', async () => {
      mockFetchError('Unauthorized', 401)

      await expect(updateOrderStatus(mockToken, 'order-123', 1)).rejects.toThrow('Unauthorized')
    })
  })
})
