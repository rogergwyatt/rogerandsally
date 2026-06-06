import { supabaseAdmin } from './supabase'
import { CustomerEvent, CustomerEventType } from './types'

export async function upsertCustomer({
  email,
  name,
  phone,
}: {
  email: string
  name?: string
  phone?: string
}) {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('customers')
    .upsert(
      { email: email.toLowerCase().trim(), name, phone, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    )
    .select('id')
    .single()

  if (error) console.error('upsertCustomer error:', error.message)
  return data?.id as string | undefined
}

export async function logCustomerEvent(
  email: string,
  type: CustomerEventType,
  text: string,
  metadata?: Record<string, unknown>
) {
  const db = supabaseAdmin()

  const event: CustomerEvent = {
    type,
    text,
    metadata,
    createdAt: new Date().toISOString(),
  }

  // Append event to the customer's events array
  const { data: customer } = await db
    .from('customers')
    .select('id, events')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!customer) {
    // Auto-create customer if they don't exist yet
    await upsertCustomer({ email })
    await logCustomerEvent(email, type, text, metadata)
    return
  }

  const events: CustomerEvent[] = [...(customer.events ?? []), event]
  await db.from('customers').update({ events, updated_at: new Date().toISOString() }).eq('id', customer.id)
}
