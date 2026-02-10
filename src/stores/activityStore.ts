import { defineStore } from 'pinia'
import type { OrderStatusValue } from '../types/api'
import { getOrderStatusLabel } from '../constants/orderStatus'

type ActivityEntry = {
  id: string
  label: string
  details: string
  timestamp: string
}

type ActivityState = {
  lastCustomer: ActivityEntry | null
  lastOrder: ActivityEntry | null
  lastStatusUpdate: ActivityEntry | null
}

const buildTimestamp = () => new Date().toISOString()

export const useActivityStore = defineStore('activity', {
  state: (): ActivityState => ({
    lastCustomer: null,
    lastOrder: null,
    lastStatusUpdate: null,
  }),
  actions: {
    setLastCustomer(id: string, name: string, email: string) {
      this.lastCustomer = {
        id,
        label: 'Customer created',
        details: `${name} (${email})`,
        timestamp: buildTimestamp(),
      }
    },
    setLastOrder(id: string, status: OrderStatusValue, totalAmount: number) {
      this.lastOrder = {
        id,
        label: 'Order created',
        details: `${getOrderStatusLabel(status)} - Total ${totalAmount}`,
        timestamp: buildTimestamp(),
      }
    },
    setLastStatusUpdate(id: string, status: OrderStatusValue) {
      this.lastStatusUpdate = {
        id,
        label: 'Status updated',
        details: `New status ${getOrderStatusLabel(status)}`,
        timestamp: buildTimestamp(),
      }
    },
  },
})
