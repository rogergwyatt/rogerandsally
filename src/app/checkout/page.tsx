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
import products from '@/data/products.json'
import { Product } from '@/lib/types'

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
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Place Order'}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { cart, cartLoaded, subtotal, setEmail, clearCart } = useCart()
  const router = useRouter()

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [email, setEmailLocal] = useState('')
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [loadingRates, setLoadingRates] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [step, setStep] = useState<'address' | 'payment'>('address')

  useEffect(() => {
    if (cartLoaded && cart.items.length === 0) router.replace('/shop')
  }, [cartLoaded, cart.items.length, router])

  async function fetchRates() {
    if (!address.zip || address.zip.length < 5) return
    setLoadingRates(true)
    // Use the heaviest single product's dimensions + combined weight
    const totalWeight = cart.items.reduce((sum, item) => {
      const p = (products as Product[]).find(p => p.id === item.product.id)
      return sum + (p?.weightLbs ?? 2) * item.quantity
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
    setEmail(email) // persist for abandoned cart tracking
    await fetchRates()
    setStep('payment')
  }

  useEffect(() => {
    if (step !== 'payment' || !selectedRate) return
    const total = Math.round((subtotal + selectedRate.price) * 100)
    fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountCents: total,
        cartSessionId: cart.sessionId,
        email,
        cart,
        shippingAddress: address,
        subtotal,
        shipping: selectedRate?.price ?? 0,
      }),
    })
      .then(r => r.json())
      .then(d => setClientSecret(d.clientSecret ?? ''))
  }, [step, selectedRate])

  function handleSuccess(piId: string) {
    clearCart()
    router.push(`/order/confirmation?pi=${piId}`)
  }

  const total = subtotal + (selectedRate?.price ?? 0)

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

            {/* Order summary */}
            <div className="bg-white rounded-lg border border-maple p-4 mt-4">
              <h3 className={`text-lg text-walnut mb-3 ${serif.className}`}>Order Summary</h3>
              {cart.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-slate mb-1">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-maple mt-2 pt-2 flex justify-between font-semibold text-walnut">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors">
              Continue to Shipping & Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <div>
            <button onClick={() => setStep('address')} className="text-sm text-forest hover:underline mb-6 block">← Edit address</button>
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
              <div className="flex justify-between text-sm text-slate mb-1"><span>Shipping</span><span>${(selectedRate?.price ?? 0).toFixed(2)}</span></div>
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
