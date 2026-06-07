export interface ProductOption {
  name: string
  key: string
  type?: 'text'
  placeholder?: string
  priceModifier?: number
  choices?: { label: string; priceModifier: number }[]
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  images: string[]
  category: string
  options: ProductOption[]
  basePrice: number
  salePrice?: number
  weightLbs: number
  dimensionsInches: { length: number; width: number; height: number }
  featured: boolean
  inStock: boolean
}

export interface CartItem {
  product: Product
  selectedOptions: Record<string, string>
  quantity: number
  unitPrice: number
}

export interface Cart {
  items: CartItem[]
  sessionId: string
  email?: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'being_crafted'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

// All statuses in lifecycle order (cancelled/returned are terminal off-ramps).
export const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'processing', 'being_crafted', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'returned',
]

// Human labels — statuses are stored as snake_case machine values.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  being_crafted: 'Being Crafted',
  ready_to_ship: 'Ready to Ship',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  being_crafted: 'bg-amber-100 text-amber-800',
  ready_to_ship: 'bg-teal-100 text-teal-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-orange-100 text-orange-800',
}

export type CustomerEventType = 'note' | 'order' | 'refund' | 'custom_order' | 'email'

export interface CustomerEvent {
  type: CustomerEventType
  text: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  events: CustomerEvent[]
  created_at: string
  // computed
  orderCount?: number
  totalSpend?: number
  lastOrderAt?: string
}

export interface RefundRecord {
  stripeRefundId: string
  amount: number
  reason: string
  createdAt: string
  refundedBy: 'full' | 'partial'
}

export interface Order {
  id: string
  stripePaymentIntentId: string
  email: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: ShippingAddress
  status: OrderStatus
  trackingNumber?: string
  createdAt: string
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
}

export interface ShippingRate {
  service: string
  displayName: string
  price: number
  estimatedDays: string
}
