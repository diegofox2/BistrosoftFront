export interface CustomerSummaryOrder {
  id: string
  status: number
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
  status: number
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
