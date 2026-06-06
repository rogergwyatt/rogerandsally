import { supabaseAdmin } from './supabase'
import { upsertCustomer, logCustomerEvent } from './customers'
import nodemailer from 'nodemailer'

/**
 * Idempotently finalize a paid order. Safe to call from both the Stripe
 * webhook and the confirmation page — an atomic pending→processing update
 * ensures the side effects (email, customer capture, timeline event) run
 * exactly once, whichever caller wins the race.
 *
 * Returns { fulfilled: true } if this call performed the work, or
 * { fulfilled: false } if the order was already processed or not found.
 */
export async function fulfillOrder(paymentIntentId: string, cartSessionId?: string) {
  const db = supabaseAdmin()

  // Atomic claim: flip pending → processing only if still pending.
  // The returned rows tell us whether THIS caller won the race.
  const { data: claimed } = await db
    .from('orders')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .eq('status', 'pending')
    .select('id, email, items, subtotal, shipping, total, shipping_address')

  if (!claimed || claimed.length === 0) {
    return { fulfilled: false }
  }

  const order = claimed[0]

  // Side effects — run once, by the winner of the atomic claim.
  await sendConfirmationEmail(order)

  const addr = (order.shipping_address ?? {}) as { name?: string }
  await upsertCustomer({ email: order.email, name: addr.name })
  await logCustomerEvent(
    order.email,
    'order',
    `Order placed — $${order.total} (${order.items?.length ?? 0} item${order.items?.length !== 1 ? 's' : ''})`,
    { orderId: order.id, total: order.total }
  )

  // Mark abandoned-cart session as recovered
  if (cartSessionId) {
    await db.from('cart_sessions').update({ recovered: true }).eq('session_id', cartSessionId)
  }

  return { fulfilled: true, order }
}

async function sendConfirmationEmail(order: any) {
  if (!process.env.SMTP_SERVER_HOST || process.env.SMTP_SERVER_HOST === 'REPLACE_WITH_LOCAL_VALUE') {
    return // SMTP not configured (e.g. local dev) — skip silently
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_SERVER_USERNAME, pass: process.env.SMTP_SERVER_PASSWORD },
  })

  const itemRows = (order.items ?? [])
    .map((item: any) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e6ded1; color: #5a5a5a;">
          ${item.product?.name ?? 'Item'} × ${item.quantity}
          <div style="font-size: 12px; color: #999; margin-top: 2px;">
            ${Object.entries(item.selectedOptions ?? {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · ')}
          </div>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e6ded1; text-align: right; color: #2d241e; font-weight: 600;">
          $${((item.unitPrice ?? 0) * (item.quantity ?? 1)).toFixed(2)}
        </td>
      </tr>
    `).join('')

  const addr = order.shipping_address ?? {}
  const trackingUrl = `https://www.rogerandsally.com/order/${order.id}`

  await transporter.sendMail({
    from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'noreply@rogerandsally.com'}>`,
    to: order.email,
    subject: 'Your Roger & Sally order is confirmed ✓',
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2d241e; background: #f9f7f2; padding: 32px;">
        <h1 style="color: #a64b29; font-size: 28px; margin-bottom: 4px;">Order Confirmed</h1>
        <p style="color: #5a5a5a; margin-top: 0;">Thank you, ${addr.name?.split(' ')[0] ?? 'there'}! We're already thinking about your board.</p>

        <div style="background: white; border: 1px solid #e6ded1; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            ${itemRows}
            <tr>
              <td style="padding: 8px 0; color: #5a5a5a;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right; color: #5a5a5a;">$${(order.subtotal ?? 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #5a5a5a;">Shipping</td>
              <td style="padding: 8px 0; text-align: right; color: #5a5a5a;">$${(order.shipping ?? 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 0; font-weight: bold; font-size: 16px; color: #2d241e;">Total</td>
              <td style="padding: 10px 0 0; text-align: right; font-weight: bold; font-size: 16px; color: #a64b29;">$${(order.total ?? 0).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background: white; border: 1px solid #e6ded1; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #2d241e;">Shipping to</div>
          <div style="color: #5a5a5a; line-height: 1.6;">
            ${addr.name ?? ''}<br/>
            ${addr.line1 ?? ''}${addr.line2 ? '<br/>' + addr.line2 : ''}<br/>
            ${addr.city ?? ''}, ${addr.state ?? ''} ${addr.zip ?? ''}
          </div>
        </div>

        <div style="background: #3e4d39; border-radius: 6px; padding: 16px; margin-bottom: 24px; color: white;">
          <div style="font-size: 13px; opacity: 0.8; margin-bottom: 4px;">Estimated production time</div>
          <div style="font-size: 18px; font-weight: bold;">${process.env.NEXT_PUBLIC_LEAD_TIME ?? '3–4 weeks'}</div>
          <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">We'll email you with tracking once it ships.</div>
        </div>

        <a href="${trackingUrl}"
           style="display: inline-block; background: #a64b29; color: white; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 15px;">
          Track Your Order
        </a>

        <p style="font-size: 12px; color: #999; margin-top: 32px;">
          Roger & Sally · Handcrafted Heritage Lock Wood Cutting Boards · Virginia<br/>
          Questions? Reply to this email or visit <a href="https://www.rogerandsally.com/#contactform" style="color: #a64b29;">our site</a>.
        </p>
      </div>
    `,
  }).catch(console.error)
}
