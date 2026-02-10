import type { OrderStatusValue } from '../types'

export const ORDER_STATUS_OPTIONS: Array<{ value: OrderStatusValue; label: string }> = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Paid' },
  { value: 2, label: 'Shipped' },
  { value: 3, label: 'Delivered' },
  { value: 4, label: 'Cancelled' },
]

export const getOrderStatusLabel = (value: number | string) => {
  const numericValue = typeof value === 'string' ? Number(value) : value
  const match = ORDER_STATUS_OPTIONS.find((option) => option.value === numericValue)
  return match ? match.label : String(value)
}
