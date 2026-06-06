import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, description, woodPreference, dimensions, budget, timeline, referenceImages } = body

    const db = supabaseAdmin()
    const { data, error } = await db.from('custom_orders').insert({
      name, email, phone,
      description,
      wood_preference: woodPreference,
      dimensions,
      budget,
      timeline,
      reference_images: referenceImages ?? [],
      status: 'new',
      created_at: new Date().toISOString(),
    }).select('id').single()

    if (error) throw error

    // Notify site owner
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER_HOST,
      port: 465,
      secure: true,
      auth: { user: process.env.SMTP_SERVER_USERNAME, pass: process.env.SMTP_SERVER_PASSWORD },
    })

    await transporter.sendMail({
      from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'noreply@rogerandsally.com'}>`,
      to: process.env.SITE_MAIL_RECIEVER,
      subject: `New Custom Order Request — ${name}`,
      html: `
        <h2>New Custom Order Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || 'not provided'}</p>
        <p><strong>Wood Preference:</strong> ${woodPreference || 'not specified'}</p>
        <p><strong>Dimensions:</strong> ${dimensions || 'not specified'}</p>
        <p><strong>Budget:</strong> ${budget || 'not specified'}</p>
        <p><strong>Timeline:</strong> ${timeline || 'not specified'}</p>
        <p><strong>Description:</strong></p>
        <blockquote style="border-left: 3px solid #a64b29; padding-left: 16px; color: #5a5a5a;">${description}</blockquote>
        <p><a href="https://www.rogerandsally.com/admin/orders">View Admin Dashboard</a></p>
      `,
    }).catch(console.error)

    // Confirm to customer
    await transporter.sendMail({
      from: `Roger & Sally <${process.env.EMAIL_FROM ?? 'noreply@rogerandsally.com'}>`,
      to: email,
      subject: 'We received your custom order request',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2d241e; background: #f9f7f2; padding: 32px;">
          <h1 style="color: #a64b29;">We got it!</h1>
          <p>Hi ${name.split(' ')[0]}, thank you for reaching out. We've received your custom order request and will be in touch within 2 business days with a quote.</p>
          <div style="background: white; border: 1px solid #e6ded1; border-radius: 6px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #2d241e;">Your request summary:</p>
            <p style="color: #5a5a5a; margin: 0; line-height: 1.6;">${description}</p>
          </div>
          <p style="color: #5a5a5a;">In the meantime, feel free to browse our <a href="https://www.rogerandsally.com/shop" style="color: #a64b29;">standard offerings</a> or reply to this email with any additional details or photos.</p>
          <p style="font-size: 12px; color: #999; margin-top: 32px;">Roger & Sally · Handcrafted Heritage Lock Wood Cutting Boards · Virginia</p>
        </div>
      `,
    }).catch(console.error)

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
