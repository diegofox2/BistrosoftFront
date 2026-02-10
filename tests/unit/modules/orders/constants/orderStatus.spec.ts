import { describe, it, expect } from 'vitest'
import { ORDER_STATUS_OPTIONS, getOrderStatusLabel } from '@modules/orders/constants/orderStatus'

describe('orderStatus', () => {
  describe('ORDER_STATUS_OPTIONS', () => {
    it('should have all status options defined', () => {
      expect(ORDER_STATUS_OPTIONS).toHaveLength(5)
    })

    it('should have Pending status (0)', () => {
      const pending = ORDER_STATUS_OPTIONS.find((opt) => opt.value === 0)
      expect(pending).toBeDefined()
      expect(pending?.label).toBe('Pending')
    })

    it('should have Paid status (1)', () => {
      const paid = ORDER_STATUS_OPTIONS.find((opt) => opt.value === 1)
      expect(paid).toBeDefined()
      expect(paid?.label).toBe('Paid')
    })

    it('should have Shipped status (2)', () => {
      const shipped = ORDER_STATUS_OPTIONS.find((opt) => opt.value === 2)
      expect(shipped).toBeDefined()
      expect(shipped?.label).toBe('Shipped')
    })

    it('should have Delivered status (3)', () => {
      const delivered = ORDER_STATUS_OPTIONS.find((opt) => opt.value === 3)
      expect(delivered).toBeDefined()
      expect(delivered?.label).toBe('Delivered')
    })

    it('should have Cancelled status (4)', () => {
      const cancelled = ORDER_STATUS_OPTIONS.find((opt) => opt.value === 4)
      expect(cancelled).toBeDefined()
      expect(cancelled?.label).toBe('Cancelled')
    })
  })

  describe('getOrderStatusLabel', () => {
    it('should return label for numeric status 0', () => {
      expect(getOrderStatusLabel(0)).toBe('Pending')
    })

    it('should return label for numeric status 1', () => {
      expect(getOrderStatusLabel(1)).toBe('Paid')
    })

    it('should return label for numeric status 2', () => {
      expect(getOrderStatusLabel(2)).toBe('Shipped')
    })

    it('should return label for numeric status 3', () => {
      expect(getOrderStatusLabel(3)).toBe('Delivered')
    })

    it('should return label for numeric status 4', () => {
      expect(getOrderStatusLabel(4)).toBe('Cancelled')
    })

    it('should return label for string status "0"', () => {
      expect(getOrderStatusLabel('0')).toBe('Pending')
    })

    it('should return label for string status "1"', () => {
      expect(getOrderStatusLabel('1')).toBe('Paid')
    })

    it('should return label for string status "2"', () => {
      expect(getOrderStatusLabel('2')).toBe('Shipped')
    })

    it('should return label for string status "3"', () => {
      expect(getOrderStatusLabel('3')).toBe('Delivered')
    })

    it('should return label for string status "4"', () => {
      expect(getOrderStatusLabel('4')).toBe('Cancelled')
    })

    it('should return the value itself for unknown numeric status', () => {
      expect(getOrderStatusLabel(99)).toBe('99')
    })

    it('should return the value itself for unknown string status', () => {
      expect(getOrderStatusLabel('99')).toBe('99')
    })

    it('should handle negative numbers', () => {
      expect(getOrderStatusLabel(-1)).toBe('-1')
    })
  })
})
