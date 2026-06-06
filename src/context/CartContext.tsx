'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Cart, CartItem, Product } from '@/lib/types'
import { v4 as uuid } from 'uuid'

interface CartContextValue {
  cart: Cart
  cartLoaded: boolean
  addItem: (product: Product, selectedOptions: Record<string, string>, unitPrice: number) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  setEmail: (email: string) => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function newCart(): Cart {
  return { items: [], sessionId: uuid() }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(newCart)
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('rs_cart')
    if (stored) {
      try { setCart(JSON.parse(stored)) } catch { /* ignore corrupt data */ }
    }
    setCartLoaded(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('rs_cart', JSON.stringify(cart))
  }, [cart])

  const persist = useCallback((updater: (c: Cart) => Cart) => {
    setCart(prev => updater(prev))
  }, [])

  const addItem = useCallback((product: Product, selectedOptions: Record<string, string>, unitPrice: number) => {
    persist(c => {
      const existing = c.items.findIndex(
        i => i.product.id === product.id && JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
      )
      if (existing >= 0) {
        const items = [...c.items]
        items[existing] = { ...items[existing], quantity: items[existing].quantity + 1 }
        return { ...c, items }
      }
      return { ...c, items: [...c.items, { product, selectedOptions, quantity: 1, unitPrice }] }
    })
  }, [persist])

  const removeItem = useCallback((index: number) => {
    persist(c => ({ ...c, items: c.items.filter((_, i) => i !== index) }))
  }, [persist])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    persist(c => {
      if (quantity <= 0) return { ...c, items: c.items.filter((_, i) => i !== index) }
      const items = [...c.items]
      items[index] = { ...items[index], quantity }
      return { ...c, items }
    })
  }, [persist])

  const clearCart = useCallback(() => {
    const fresh = newCart()
    setCart(fresh)
    localStorage.setItem('rs_cart', JSON.stringify(fresh))
  }, [])

  const setEmail = useCallback((email: string) => {
    persist(c => ({ ...c, email }))
    // Persist cart session server-side for abandoned cart tracking
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cart, email }),
    }).catch(() => {/* best-effort */})
  }, [persist, cart])

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartLoaded, addItem, removeItem, updateQuantity, clearCart, setEmail, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
