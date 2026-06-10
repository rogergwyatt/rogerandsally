'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { ShippingAddress, ShippingRate } from '@/lib/types'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
const emptyAddress: ShippingAddress = { name: '', line1: '', line2: '', city: '', state: '', zip: '' }

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: (piId: string) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order/confirmation` },
      redirect: 'if_required',
    })
    if (result.error) {
      setError(result.error.message ?? 'Payment failed')
      setLoading(false)
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess(result.paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50">
        {loading ? 'Processing…' : 'Place Order'}
      </button>
    </form>
  )
}

interface PromoResult {
  code: string
  type: 'percent' | 'fixed'
  value: number
  discount: number
  description?: string
}

export default function CheckoutPage() {
  const { cart, cartLoaded, subtotal, setEmail } = useCart()
  const router = useRouter()

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [email, setEmailLocal] = useState('')
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [tax, setTax] = useState(0)
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<PromoResult | null>(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    // Don't bounce to /shop once an order is being completed — otherwise the
    // empty-cart guard races the redirect to the confirmation page.
    if (cartLoaded && cart.items.length === 0 && !completing) router.replace('/shop')
  }, [cartLoaded, cart.items.length, router, completing])

  async function applyPromo() {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError('')
    const res = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoInput, subtotal }),
    })
    const data = await res.json()
    if (!res.ok) { setPromoError(data.error); setPromo(null) } else { setPromo(data) }
    setPromoLoading(false)
  }

  function removePromo() { setPromo(null); setPromoInput(''); setPromoError('') }

  const discount = promo?.discount ?? 0
  const discountedSubtotal = subtotal - discount

  async function fetchRates() {
    if (!address.zip || address.zip.length < 5) return
    setLoadingRates(true)
    const totalWeight = cart.items.reduce((sum, item) => {
      return sum + (item.product.weightLbs ?? 2) * item.quantity
    }, 0)
    const res = await fetch('/api/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toZip: address.zip, weightLbs: totalWeight, length: 20, width: 14, height: 4 }),
    })
    const data = await res.json()
    setRates(data.rates ?? [])
    setSelectedRate(data.rates?.[0] ?? null)
    setLoadingRates(false)
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEmail(email)
    await fetchRates()
    setStep('payment')
  }

  useEffect(() => {
    if (step !== 'payment' || !selectedRate) return
    const total = Math.round((discountedSubtotal + selectedRate.price) * 100)
    fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountCents: total,
        cartSessionId: cart.sessionId,
        email,
        cart,
        shippingAddress: address,
        subtotal: discountedSubtotal,
        shipping: selectedRate.price,
        promoCode: promo?.code,
        discount,
      }),
    })
      .then(r => r.json())
      .then(d => { setClientSecret(d.clientSecret ?? ''); setTax(d.tax ?? 0) })
  }, [step, selectedRate])

  function handleSuccess(piId: string) {
    // Mark completing first so the empty-cart guard won't redirect to /shop,
    // then navigate. The cart is cleared on the confirmation page.
    setCompleting(true)
    router.push(`/order/confirmation?pi=${piId}`)
  }

  const total = discountedSubtotal + (selectedRate?.price ?? 0) + tax

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <div className="max-w-2xl mx-auto w-full px-4 py-12 flex-1">
        <h1 className={`text-4xl text-walnut mb-8 ${serif.className}`}>Checkout</h1>

        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <h2 className={`text-xl text-walnut mb-4 ${serif.className}`}>Shipping Information</h2>
            <input required placeholder="Full Name" value={address.name}
              onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
              className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
            <input required type="email" placeholder="Email address" value={email}
              onChange={e => setEmailLocal(e.target.value)}
              className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
            <input required placeholder="Street Address" value={address.line1}
              onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))}
              className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
            <input placeholder="Apt, Suite, etc. (optional)" value={address.line2}
              onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))}
              className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
            <div className="grid grid-cols-3 gap-3">
              <input required placeholder="City" value={address.city}
                onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                className="col-span-1 border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
              <input required placeholder="State" maxLength={2} value={address.state}
                onChange={e => setAddress(a => ({ ...a, state: e.target.value.toUpperCase() }))}
                className="border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
              <input required placeholder="ZIP" maxLength={5} value={address.zip}
                onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))}
                className="border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-white" />
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-lg border border-maple p-4">
              <label className={`block text-sm font-semibold text-walnut mb-2 ${serif.className}`}>Promo Code</label>
              {promo ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                  <div>
                    <span className="font-mono font-bold text-green-800">{promo.code}</span>
                    <span className="text-green-700 text-sm ml-2">
                      — {promo.type === 'percent' ? `${promo.value}% off` : `$${promo.value} off`} (−${promo.discount.toFixed(2)})
                    </span>
                  </div>
                  <button type="button" onClick={removePromo} className="text-sm text-slate hover:text-red-600">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-maple rounded px-3 py-2 font-mono uppercase focus:outline-none focus:border-cherry bg-parchment"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                  />
                  <button type="button" onClick={applyPromo} disabled={promoLoading || !promoInput}
                    className="bg-forest text-white px-4 py-2 rounded font-semibold text-sm hover:bg-opacity-90 disabled:opacity-50">
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-600 text-sm mt-1">{promoError}</p>}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-lg border border-maple p-4">
              <h3 className={`text-lg text-walnut mb-3 ${serif.className}`}>Order Summary</h3>
              {cart.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate mb-1">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-maple mt-2 pt-2 space-y-1">
                <div className="flex justify-between text-sm text-slate"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-700 font-medium">
                    <span>Discount ({promo?.code})</span><span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-walnut">
                  <span>Total</span><span>${discountedSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors">
              Continue to Shipping & Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <div>
            <button type="button" onClick={() => setStep('address')} className="text-sm text-forest hover:underline mb-6 block">← Edit address</button>
            <h2 className={`text-xl text-walnut mb-4 ${serif.className}`}>Shipping Method</h2>
            {loadingRates ? (
              <p className="text-slate text-sm mb-4">Fetching shipping rates…</p>
            ) : (
              <div className="space-y-2 mb-6">
                {rates.map(rate => (
                  <label key={rate.service} className={`flex items-center justify-between p-3 rounded border cursor-pointer ${selectedRate?.service === rate.service ? 'border-cherry bg-white' : 'border-maple bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="rate" checked={selectedRate?.service === rate.service}
                        onChange={() => setSelectedRate(rate)} className="accent-cherry" />
                      <span className="text-slate text-sm">{rate.displayName}</span>
                    </div>
                    <span className="text-walnut font-medium">${rate.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="bg-white rounded-lg border border-maple p-4 mb-6">
              <div className="flex justify-between text-sm text-slate mb-1"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-700 font-medium mb-1">
                  <span>Discount ({promo?.code})</span><span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate mb-1"><span>Shipping</span><span>${(selectedRate?.price ?? 0).toFixed(2)}</span></div>
              {tax > 0 && (
                <div className="flex justify-between text-sm text-slate mb-1"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              )}
              <div className="border-t border-maple mt-2 pt-2 flex justify-between font-semibold text-walnut text-lg">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>

            <h2 className={`text-xl text-walnut mb-4 ${serif.className}`}>Payment</h2>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <p className="text-slate text-sm">Loading payment form…</p>
            )}
          </div>
        )}
      </div>
      <FooterSection />
    </main>
  )
}
