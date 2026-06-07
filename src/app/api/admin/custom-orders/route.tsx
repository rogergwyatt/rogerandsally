import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { logCustomerEvent } from '@/lib/customers'

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customOrders: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status, quoteAmount, notes } = await req.json()
  const db = supabaseAdmin()

  const update: Record<string, unknown> = {}
  if (status !== undefined) update.status = status
  if (quoteAmount !== undefined) update.quote_amount = quoteAmount === '' ? null : Number(quoteAmount)
  if (notes !== undefined) update.notes = notes

  const { data, error } = await db.from('custom_orders').update(update).eq('id', id).select('email').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log status changes to the customer timeline
  if (status && data?.email) {
    await logCustomerEvent(data.email, 'custom_order', `Custom order marked "${status}"`, { customOrderId: id })
  }

  return NextResponse.json({ ok: true })
}
