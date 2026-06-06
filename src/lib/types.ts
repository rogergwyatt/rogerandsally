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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

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
