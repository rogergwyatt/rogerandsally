import nodemailer from 'nodemailer'
import { OrderStatus } from './types'

// Statuses that notify the customer when an admin moves an order into them.
export const NOTIFY_STATUSES: OrderStatus[] = ['being_crafted', 'ready_to_ship', 'shipped', 'cancelled']

const LEAD_TIME = process.env.NEXT_PUBLIC_LEAD_TIME ?? '3–4 weeks'

function trackingUrl(carrier?: string, tracking?: string): string | null {
  if (!tracking) return null
  const c = (carrier ?? '').toLowerCase()
  if (c.includes('usps')) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`
  if (c.includes('ups')) return `https://www.ups.com/track?tracknum=${tracking}`
  if (c.includes('fedex')) return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`
  return `https://www.google.com/search?q=${encodeURIComponent(`${carrier ?? ''} tracking ${tracking}`)}`
}

function wrap(inner: string) {
  return `<div style="font-family: Georgia, serif; max-width: 540px; margin: 0 auto; color: #2d241e; background: #f9f7f2; padding: 32px;">
    ${inner}
    <p style="font-size: 12px; color: #999; margin-top: 32px;">Roger &amp; Sally · Handcrafted Heritage Lock Wood Cutting Boards · Virginia</p>
  </div>`
}

function template(order: any, status: OrderStatus): { subject: string; html: string } | null {
  const first = (order.shipping_address?.name ?? '').split(' ')[0] || 'there'
  const trackLink = `https://www.rogerandsally.com/order/${order.id}`
  const trackBtn = `<a href="${trackLink}" style="display:inline-block;background:#a64b29;color:white;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:bold;margin-top:8px;">Track Your Order</a>`

  switch (status) {
    case 'being_crafted':
      return {
        subject: 'Your Roger & Sally order is being crafted 🪵',
        html: wrap(`
          <h1 style="color:#a64b29;">It's in the workshop</h1>
          <p style="color:#5a5a5a;">Hi ${first}, good news — Roger has started handcrafting your order. Each piece is made to order, so this is where the magic happens.</p>
          <div style="background:#3e4d39;border-radius:6px;padding:16px;margin:20px 0;color:white;">
            <div style="font-size:13px;opacity:.8;">Estimated production time</div>
            <div style="font-size:18px;font-weight:bold;">${LEAD_TIME}</div>
          </div>
          ${trackBtn}
        `),
      }
    case 'ready_to_ship':
      return {
        subject: 'Your Roger & Sally order is ready to ship 📦',
        html: wrap(`
          <h1 style="color:#a64b29;">Finished &amp; ready to ship</h1>
          <p style="color:#5a5a5a;">Hi ${first}, your order is complete and packed up — it'll be on its way very soon. We'll send tracking as soon as it's handed to the carrier.</p>
          ${trackBtn}
        `),
      }
    case 'shipped': {
      const url = trackingUrl(order.carrier, order.tracking_number)
      return {
        subject: 'Your Roger & Sally order has shipped 📦',
        html: wrap(`
          <h1 style="color:#a64b29;">It's on its way!</h1>
          <p style="color:#5a5a5a;">Hi ${first}, your handcrafted order has shipped${order.carrier ? ` via ${order.carrier}` : ''}.</p>
          ${order.tracking_number ? `<div style="background:white;border:1px solid #e6ded1;border-radius:6px;padding:20px;margin:20px 0;">
            <div style="font-size:13px;color:#999;">Tracking number</div>
            <div style="font-size:18px;font-weight:bold;font-family:monospace;">${order.tracking_number}</div>
          </div>` : ''}
          ${url ? `<a href="${url}" style="display:inline-block;background:#a64b29;color:white;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:bold;">Track Your Package</a>` : trackBtn}
        `),
      }
    }
    case 'cancelled':
      return {
        subject: 'Your Roger & Sally order has been cancelled',
        html: wrap(`
          <h1 style="color:#a64b29;">Order cancelled</h1>
          <p style="color:#5a5a5a;">Hi ${first}, your order has been cancelled. If a payment was taken, any refund will follow separately. If you have any questions or this was a mistake, just reply to this email and we'll help.</p>
        `),
      }
    default:
      return null
  }
}

// Best-effort: never let an email failure affect the status update.
export async function sendStatusEmail(order: any, status: OrderStatus) {
  if (!process.env.SMTP_SERVER_HOST || process.env.SMTP_SERVER_HOST === 'REPLACE_WITH_LOCAL_VALUE') return
  if (!order?.email) return
  const tmpl = template(order, status)
  if (!tmpl) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_SERVER_USERNAME, pass: process.env.SMTP_SERVER_PASSWORD },
  })

  await transporter.sendMail({
    from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'sales@rogerandsally.com'}>`,
    to: order.email,
    subject: tmpl.subject,
    html: tmpl.html,
  }).catch(console.error)
}
