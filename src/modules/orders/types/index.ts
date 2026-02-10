export type OrderStatusValue = number

export interface CreateOrderRequestItem {
  productId: string
  quantity: number
}

export interface CreateOrderRequest {
  customerId: string
  items: CreateOrderRequestItem[]
}

export interface CreateOrderResponse {
  orderId: string
  status: OrderStatusValue
  totalAmount: number
  createdAt: string
}

export interface OrderStatusResponse {
  orderId: string
  status: OrderStatusValue
}
