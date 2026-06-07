'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email_address')
  const phone = searchParams.get('phone_number')

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="text-5xl mb-6">✉️</div>
      <h1 className={`text-4xl text-walnut mb-4 ${serif.className}`}>Thank You!</h1>
      <p className="text-slate text-lg max-w-md">
        Thank you for contacting us — we'll respond shortly.
        {(phone || email) && (
          <>
            <br />
            We'll reach you{phone ? ` by phone at ${phone}` : ''}
            {phone && email ? ' or' : ''}
            {email ? ` at ${email}` : ''}.
          </>
        )}
      </p>
      <a href="/shop" className="mt-8 text-forest hover:underline text-sm">Browse the shop →</a>
    </div>
  )
}

export default function Page() {
  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate">Loading…</div>}>
        <ThankYouContent />
      </Suspense>
      <FooterSection />
    </main>
  )
}
