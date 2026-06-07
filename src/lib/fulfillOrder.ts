import { supabaseAdmin } from './supabase'
import { upsertCustomer, logCustomerEvent } from './customers'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { splitOptions } from './orderOptions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_REPLACE_ME')

/**
 * Idempotently finalize a paid order. Safe to call from both the Stripe
 * webhook and the confirmation page — an atomic pending→processing update
 * ensures the side effects (email, customer capture, timeline event) run
 * exactly once, whichever caller wins the race.
 *
 * Returns { fulfilled: true } if this call performed the work, or
 * { fulfilled: false } if the order was already processed or not found.
 */
export async function fulfillOrder(paymentIntentId: string, cartSessionId?: string, taxCalculationId?: string) {
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
  await sendOwnerNotification(order)

  const addr = (order.shipping_address ?? {}) as { name?: string }
  await upsertCustomer({ email: order.email, name: addr.name })
  await logCustomerEvent(
    order.email,
    'order',
    `Order placed — $${order.total} (${order.items?.length ?? 0} item${order.items?.length !== 1 ? 's' : ''})`,
    { orderId: order.id, total: order.total }
  )

  // Record the Stripe Tax transaction from the calculation (for tax reporting).
  // Best-effort: never let a reporting hiccup affect order fulfillment.
  if (taxCalculationId) {
    try {
      await stripe.tax.transactions.createFromCalculation({
        calculation: taxCalculationId,
        reference: order.id,
      })
    } catch (taxErr: any) {
      console.error('Stripe Tax transaction recording failed:', taxErr.message)
    }
  }

  // Mark abandoned-cart session as recovered
  if (cartSessionId) {
    await db.from('cart_sessions').update({ recovered: true }).eq('session_id', cartSessionId)
  }

  return { fulfilled: true, order }
}

// Notify the shop (sales@) of a new paid order, with per-item personalization
// and — importantly — the customer's engraving placement notes.
async function sendOwnerNotification(order: any) {
  if (!process.env.SMTP_SERVER_HOST || process.env.SMTP_SERVER_HOST === 'REPLACE_WITH_LOCAL_VALUE') return
  const to = process.env.SITE_MAIL_RECIEVER || process.env.EMAIL_FROM
  if (!to) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_SERVER_USERNAME, pass: process.env.SMTP_SERVER_PASSWORD },
  })

  const addr = order.shipping_address ?? {}
  const itemBlocks = (order.items ?? []).map((item: any) => {
    const { text, graphics, notes } = splitOptions(item.selectedOptions)
    return `
      <div style="border-left:3px solid #a64b29;padding-left:12px;margin:10px 0;">
        <div style="font-weight:bold;color:#2d241e;">${item.product?.name ?? 'Item'} × ${item.quantity} — $${((item.unitPrice ?? 0) * (item.quantity ?? 1)).toFixed(2)}</div>
        <div style="font-size:13px;color:#5a5a5a;">${text.map(o => `${o.key}: ${o.value}`).join(' · ')}</div>
        ${graphics.map(u => `<div style="font-size:13px;"><a href="${u}" style="color:#a64b29;font-weight:bold;">⬇ Download engraving graphic</a></div>`).join('')}
        ${notes ? `<div style="font-size:13px;margin-top:4px;background:#fff7ed;border:1px solid #fed7aa;border-radius:4px;padding:6px 8px;"><strong>Engraving placement:</strong> ${notes}</div>` : ''}
      </div>`
  }).join('')

  await transporter.sendMail({
    from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'sales@rogerandsally.com'}>`,
    to,
    replyTo: order.email,
    subject: `New order — $${order.total} from ${addr.name ?? order.email}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2d241e;">
        <h2 style="color:#a64b29;">New Order Received</h2>
        <p><strong>Order:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${addr.name ?? ''} &lt;${order.email}&gt;</p>
        <p><strong>Ship to:</strong> ${addr.line1 ?? ''}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city ?? ''}, ${addr.state ?? ''} ${addr.zip ?? ''}</p>
        <h3 style="color:#2d241e;">Items</h3>
        ${itemBlocks}
        <p style="margin-top:16px;"><strong>Subtotal:</strong> $${(order.subtotal ?? 0).toFixed(2)} · <strong>Shipping:</strong> $${(order.shipping ?? 0).toFixed(2)} · <strong>Total:</strong> $${(order.total ?? 0).toFixed(2)}</p>
        <p><a href="https://www.rogerandsally.com/admin/orders" style="color:#a64b29;">Open in Admin →</a></p>
      </div>
    `,
  }).catch(console.error)
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
            ${splitOptions(item.selectedOptions).text.map(o => `${o.key}: ${o.value}`).join(' · ')}
            ${splitOptions(item.selectedOptions).graphics.map(u => ` · <a href="${u}" style="color:#a64b29;">engraving graphic</a>`).join('')}
            ${splitOptions(item.selectedOptions).notes ? `<div style="margin-top:2px;"><strong>Engraving placement:</strong> ${splitOptions(item.selectedOptions).notes}</div>` : ''}
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
