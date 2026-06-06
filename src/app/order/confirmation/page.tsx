'use client'
import Link from 'next/link'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmationContent() {
  const params = useSearchParams()
  const pi = params.get('pi')
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className={`text-4xl text-walnut mb-4 ${serif.className}`}>Order Confirmed!</h1>
      <p className="text-slate text-lg mb-2 max-w-md">
        Thank you for your order. We'll start crafting your piece right away and email you when it ships.
      </p>
      {pi && (
        <p className="text-sm text-slate mt-2 mb-8">
          Order reference: <span className="font-mono text-walnut">{pi}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Link href="/order/lookup" className="bg-cherry text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-colors">
          Track Your Order
        </Link>
        <Link href="/shop" className="border border-cherry text-cherry px-8 py-3 rounded font-semibold hover:bg-cherry hover:text-white transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate">Loading…</div>}>
        <ConfirmationContent />
      </Suspense>
      <FooterSection />
    </main>
  )
}
