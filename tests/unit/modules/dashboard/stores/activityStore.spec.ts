import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useActivityStore } from '@modules/dashboard/stores/activityStore'
import { setupTestPinia } from '@tests/helpers/storeHelpers'

describe('activityStore', () => {
  beforeEach(() => {
    setupTestPinia()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should initialize with null activities', () => {
      const store = useActivityStore()

      expect(store.lastCustomer).toBeNull()
      expect(store.lastOrder).toBeNull()
      expect(store.lastStatusUpdate).toBeNull()
    })
  })

  describe('setLastCustomer', () => {
    it('should set last customer activity', () => {
      const store = useActivityStore()
      const mockDate = new Date('2026-02-09T10:30:00.000Z')
      vi.setSystemTime(mockDate)

      store.setLastCustomer('customer-123', 'John Doe', 'john@example.com')

      expect(store.lastCustomer).toEqual({
        id: 'customer-123',
        label: 'Customer created',
        details: 'John Doe (john@example.com)',
        timestamp: mockDate.toISOString(),
      })
    })

    it('should update timestamp on multiple calls', () => {
      const store = useActivityStore()
      
      const firstDate = new Date('2026-02-09T10:00:00.000Z')
      vi.setSystemTime(firstDate)
      store.setLastCustomer('customer-1', 'User 1', 'user1@example.com')
      const firstTimestamp = store.lastCustomer?.timestamp

      const secondDate = new Date('2026-02-09T11:00:00.000Z')
      vi.setSystemTime(secondDate)
      store.setLastCustomer('customer-2', 'User 2', 'user2@example.com')
      const secondTimestamp = store.lastCustomer?.timestamp

      expect(firstTimestamp).toBe(firstDate.toISOString())
      expect(secondTimestamp).toBe(secondDate.toISOString())
      expect(firstTimestamp).not.toBe(secondTimestamp)
    })

    it('should handle special characters in customer details', () => {
      const store = useActivityStore()
      
      store.setLastCustomer('customer-456', 'José García', 'josé@email.com')

      expect(store.lastCustomer?.details).toBe('José García (josé@email.com)')
    })
  })

  describe('setLastOrder', () => {
    it('should set last order activity with Pending status', () => {
      const store = useActivityStore()
      const mockDate = new Date('2026-02-09T10:30:00.000Z')
      vi.setSystemTime(mockDate)

      store.setLastOrder('order-789', 0, 150.50)

      expect(store.lastOrder).toEqual({
        id: 'order-789',
        label: 'Order created',
        details: 'Pending - Total 150.5',
        timestamp: mockDate.toISOString(),
      })
    })

    it('should set last order activity with Paid status', () => {
      const store = useActivityStore()
      const mockDate = new Date('2026-02-09T10:30:00.000Z')
      vi.setSystemTime(mockDate)

      store.setLastOrder('order-456', 1, 99.99)

      expect(store.lastOrder?.details).toBe('Paid - Total 99.99')
    })

    it('should set last order activity with Shipped status', () => {
      const store = useActivityStore()
      
      store.setLastOrder('order-123', 2, 250.00)

      expect(store.lastOrder?.details).toBe('Shipped - Total 250')
    })

    it('should set last order activity with Delivered status', () => {
      const store = useActivityStore()
      
      store.setLastOrder('order-999', 3, 75.25)

      expect(store.lastOrder?.details).toBe('Delivered - Total 75.25')
    })

    it('should set last order activity with Cancelled status', () => {
      const store = useActivityStore()
      
      store.setLastOrder('order-000', 4, 0)

      expect(store.lastOrder?.details).toBe('Cancelled - Total 0')
    })

    it('should handle large amounts', () => {
      const store = useActivityStore()
      
      store.setLastOrder('order-big', 1, 9999.99)

      expect(store.lastOrder?.details).toBe('Paid - Total 9999.99')
    })

    it('should update previous order entry', () => {
      const store = useActivityStore()
      
      store.setLastOrder('order-1', 0, 100)
      expect(store.lastOrder?.id).toBe('order-1')

      store.setLastOrder('order-2', 1, 200)
      expect(store.lastOrder?.id).toBe('order-2')
      expect(store.lastOrder?.details).toBe('Paid - Total 200')
    })
  })

  describe('setLastStatusUpdate', () => {
    it('should set last status update with Pending status', () => {
      const store = useActivityStore()
      const mockDate = new Date('2026-02-09T10:30:00.000Z')
      vi.setSystemTime(mockDate)

      store.setLastStatusUpdate('order-123', 0)

      expect(store.lastStatusUpdate).toEqual({
        id: 'order-123',
        label: 'Status updated',
        details: 'New status Pending',
        timestamp: mockDate.toISOString(),
      })
    })

    it('should set last status update with Paid status', () => {
      const store = useActivityStore()
      
      store.setLastStatusUpdate('order-456', 1)

      expect(store.lastStatusUpdate?.details).toBe('New status Paid')
    })

    it('should set last status update with Shipped status', () => {
      const store = useActivityStore()
      
      store.setLastStatusUpdate('order-789', 2)

      expect(store.lastStatusUpdate?.details).toBe('New status Shipped')
    })

    it('should set last status update with Delivered status', () => {
      const store = useActivityStore()
      
      store.setLastStatusUpdate('order-999', 3)

      expect(store.lastStatusUpdate?.details).toBe('New status Delivered')
    })

    it('should set last status update with Cancelled status', () => {
      const store = useActivityStore()
      
      store.setLastStatusUpdate('order-000', 4)

      expect(store.lastStatusUpdate?.details).toBe('New status Cancelled')
    })

    it('should update previous status update entry', () => {
      const store = useActivityStore()
      
      store.setLastStatusUpdate('order-1', 0)
      expect(store.lastStatusUpdate?.id).toBe('order-1')

      store.setLastStatusUpdate('order-2', 3)
      expect(store.lastStatusUpdate?.id).toBe('order-2')
      expect(store.lastStatusUpdate?.details).toBe('New status Delivered')
    })
  })

  describe('activity isolation', () => {
    it('should maintain separate activities', () => {
      const store = useActivityStore()
      const mockDate = new Date('2026-02-09T10:30:00.000Z')
      vi.setSystemTime(mockDate)

      store.setLastCustomer('customer-1', 'John Doe', 'john@example.com')
      store.setLastOrder('order-1', 1, 100.50)
      store.setLastStatusUpdate('order-2', 2)

      expect(store.lastCustomer).not.toBeNull()
      expect(store.lastOrder).not.toBeNull()
      expect(store.lastStatusUpdate).not.toBeNull()

      expect(store.lastCustomer?.id).toBe('customer-1')
      expect(store.lastOrder?.id).toBe('order-1')
      expect(store.lastStatusUpdate?.id).toBe('order-2')
    })

    it('should not affect other activities when updating one', () => {
      const store = useActivityStore()
      
      const firstDate = new Date('2026-02-09T10:00:00.000Z')
      vi.setSystemTime(firstDate)
      store.setLastCustomer('customer-1', 'User 1', 'user1@example.com')
      const customerTimestamp = store.lastCustomer?.timestamp

      const secondDate = new Date('2026-02-09T11:00:00.000Z')
      vi.setSystemTime(secondDate)
      store.setLastOrder('order-1', 0, 50)

      expect(store.lastCustomer?.timestamp).toBe(customerTimestamp)
      expect(store.lastOrder?.timestamp).toBe(secondDate.toISOString())
    })
  })
})
