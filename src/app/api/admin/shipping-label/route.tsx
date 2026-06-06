import { NextRequest, NextResponse } from 'next/server'
import EasyPostClient from '@easypost/api'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { logCustomerEvent } from '@/lib/customers'
import products from '@/data/products.json'
import { Product } from '@/lib/types'
import nodemailer from 'nodemailer'

const api = new EasyPostClient(process.env.EASYPOST_API_KEY ?? 'EZTK_REPLACE_ME')

// Build a single parcel that represents the whole order. We sum item weights
// and use the largest single product's dimensions as a reasonable box size.
function buildParcel(items: any[]) {
  let totalWeightOz = 0
  let maxL = 6, maxW = 6, maxH = 2
  for (const item of items) {
    const p = (products as Product[]).find(pr => pr.id === item.product?.id)
    const qty = item.quantity ?? 1
    const lbs = p?.weightLbs ?? 2
    totalWeightOz += lbs * 16 * qty
    const d = p?.dimensionsInches
    if (d) {
      maxL = Math.max(maxL, d.length)
      maxW = Math.max(maxW, d.width)
      maxH = Math.max(maxH, d.height * qty) // stack height grows with qty
    }
  }
  // Never ship a zero-weight parcel
  if (totalWeightOz <= 0) totalWeightOz = 16
  return { length: maxL, width: maxW, height: maxH, weight: Math.ceil(totalWeightOz) }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await req.json()
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

  const db = supabaseAdmin()
  const { data: order } = await db
    .from('orders')
    .select('id, email, items, shipping_address, label_url, tracking_number')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Idempotency — never buy a second label for the same order
  if (order.label_url) {
    return NextResponse.json({
      error: 'A label has already been purchased for this order.',
      labelUrl: order.label_url,
      trackingNumber: order.tracking_number,
    }, { status: 409 })
  }

  const addr = order.shipping_address ?? {}
  if (!addr.line1 || !addr.city || !addr.state || !addr.zip) {
    return NextResponse.json({ error: 'Order is missing a complete shipping address.' }, { status: 400 })
  }

  try {
    const parcel = buildParcel(order.items ?? [])

    const shipment = await api.Shipment.create({
      to_address: {
        name: addr.name,
        street1: addr.line1,
        street2: addr.line2 || undefined,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: 'US',
      },
      from_address: {
        name: process.env.SHIP_FROM_NAME ?? 'Roger & Sally',
        street1: process.env.SHIP_FROM_STREET ?? '507 Coalbrook Dr',
        city: process.env.SHIP_FROM_CITY ?? 'Midlothian',
        state: process.env.SHIP_FROM_STATE ?? 'VA',
        zip: process.env.SHIP_FROM_ZIP ?? '23114',
        country: 'US',
        phone: process.env.SHIP_FROM_PHONE ?? '8044648162',
      },
      parcel,
    })

    if (!shipment.rates || shipment.rates.length === 0) {
      return NextResponse.json({ error: 'No shipping rates available for this address.' }, { status: 422 })
    }

    // Auto-buy the cheapest rate
    const cheapest = shipment.rates.reduce((lo: any, r: any) =>
      parseFloat(r.rate) < parseFloat(lo.rate) ? r : lo
    )
    const bought = await api.Shipment.buy(shipment.id, cheapest)

    const trackingNumber = bought.tracking_code
    const labelUrl = bought.postage_label?.label_url
    const carrier = bought.selected_rate?.carrier
    const cost = bought.selected_rate?.rate

    // Persist + flip to shipped
    await db.from('orders').update({
      status: 'shipped',
      tracking_number: trackingNumber,
      carrier,
      label_url: labelUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', orderId)

    // Email the customer their tracking info
    await sendTrackingEmail(order.email, addr.name, trackingNumber, carrier, bought.tracker?.public_url)

    // Log to customer timeline
    if (order.email) {
      await logCustomerEvent(order.email, 'email',
        `Shipped via ${carrier} — tracking ${trackingNumber}`,
        { orderId, trackingNumber, carrier })
    }

    return NextResponse.json({ ok: true, labelUrl, trackingNumber, carrier, cost })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to purchase label' }, { status: 500 })
  }
}

async function sendTrackingEmail(email: string, name: string | undefined, tracking: string, carrier?: string, trackUrl?: string) {
  if (!process.env.SMTP_SERVER_HOST || process.env.SMTP_SERVER_HOST === 'REPLACE_WITH_LOCAL_VALUE') return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_SERVER_USERNAME, pass: process.env.SMTP_SERVER_PASSWORD },
  })

  await transporter.sendMail({
    from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'noreply@rogerandsally.com'}>`,
    to: email,
    subject: 'Your Roger & Sally order has shipped 📦',
    html: `
      <div style="font-family: Georgia, serif; max-width: 540px; margin: 0 auto; color: #2d241e; background: #f9f7f2; padding: 32px;">
        <h1 style="color: #a64b29;">It's on its way!</h1>
        <p style="color: #5a5a5a;">Hi ${name?.split(' ')[0] ?? 'there'}, your handcrafted order has shipped via ${carrier ?? 'carrier'}.</p>
        <div style="background: white; border: 1px solid #e6ded1; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 13px; color: #999;">Tracking number</div>
          <div style="font-size: 18px; font-weight: bold; color: #2d241e; font-family: monospace;">${tracking}</div>
        </div>
        ${trackUrl ? `<a href="${trackUrl}" style="display:inline-block;background:#a64b29;color:white;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:bold;">Track Your Package</a>` : ''}
        <p style="font-size: 12px; color: #999; margin-top: 32px;">Roger & Sally · Handcrafted Heritage Lock Wood Cutting Boards · Virginia</p>
      </div>
    `,
  }).catch(console.error)
}
