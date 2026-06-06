'use client'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, subtotal } = useCart()
  const router = useRouter()

  if (cart.items.length === 0) {
    return (
      <main className="bg-parchment min-h-screen flex flex-col">
        <TopSection />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h1 className={`text-4xl text-walnut mb-4 ${serif.className}`}>Your cart is empty</h1>
          <p className="text-slate mb-8">Add some handcrafted pieces to get started.</p>
          <Link href="/shop" className="bg-cherry text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors">
            Browse the Shop
          </Link>
        </div>
        <FooterSection />
      </main>
    )
  }

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <h1 className={`text-4xl text-walnut mb-8 ${serif.className}`}>Your Cart</h1>

        <div className="space-y-4 mb-8">
          {cart.items.map((item, i) => (
            <div key={i} className="bg-white rounded-lg border border-maple p-4 flex gap-4 items-start">
              <div className="relative h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-maple">
                {item.product.images[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate">No image</div>
                )}
              </div>
              <div className="flex-1">
                <h2 className={`text-lg text-walnut ${serif.className}`}>{item.product.name}</h2>
                <div className="text-sm text-slate mt-1 space-y-0.5">
                  {Object.entries(item.selectedOptions).map(([k, v]) =>
                    v ? <div key={k}><span className="capitalize">{k}:</span> {v}</div> : null
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-cherry font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(i, item.quantity - 1)}
                    className="w-7 h-7 border border-maple rounded flex items-center justify-center text-slate hover:border-cherry"
                  >−</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(i, item.quantity + 1)}
                    className="w-7 h-7 border border-maple rounded flex items-center justify-center text-slate hover:border-cherry"
                  >+</button>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-slate hover:text-cherry underline"
                >Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-maple p-6">
          <div className="flex justify-between text-lg mb-2">
            <span className="text-slate">Subtotal</span>
            <span className="text-walnut font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-sm text-slate mb-6">Shipping calculated at checkout</p>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link href="/shop" className="block text-center mt-4 text-sm text-forest hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
