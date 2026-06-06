import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_REPLACE_ME')

export async function POST(req: NextRequest) {
  try {
    const { amountCents, cartSessionId, email, cart, shippingAddress, subtotal, shipping } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: { cartSessionId: cartSessionId ?? '' },
      // Stripe Tax — enable in Dashboard → Tax settings, then set STRIPE_TAX_ENABLED=true
      ...(process.env.STRIPE_TAX_ENABLED === 'true' ? { automatic_tax: { enabled: true } } : {}),
    })

    // Pre-create order record so the webhook can update it on success
    if (cart && email) {
      const db = supabaseAdmin()
      await db.from('orders').upsert({
        stripe_payment_intent_id: paymentIntent.id,
        email,
        items: cart.items ?? [],
        subtotal: subtotal ?? 0,
        shipping: shipping ?? 0,
        total: (subtotal ?? 0) + (shipping ?? 0),
        shipping_address: shippingAddress ?? {},
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_payment_intent_id' })
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
