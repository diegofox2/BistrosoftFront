export type OrderStatusValue = number

export interface TokenResponse {
  token: string
}

export interface CustomerSummaryOrder {
  id: string
  status: OrderStatusValue
  totalAmount: number
  createdAt: string
}

export interface CustomerDetails {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  orders: CustomerSummaryOrder[]
}

export interface CustomerOrderItem {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CustomerOrder {
  orderId: string
  status: OrderStatusValue
  totalAmount: number
  createdAt: string
  items: CustomerOrderItem[]
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phoneNumber?: string | null
}

export interface CreateCustomerResponse {
  id: string
  name: string
  email: string
  phoneNumber?: string | null
}

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
