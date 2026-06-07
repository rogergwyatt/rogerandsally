'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { serif } from '@/controls/fonts'
import { Customer, CustomerEvent, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'

const EVENT_ICONS: Record<string, string> = {
  order: '📦',
  custom_order: '🪵',
  refund: '↩️',
  email: '✉️',
  note: '📝',
}

const EVENT_COLORS: Record<string, string> = {
  order: 'border-blue-200 bg-blue-50',
  custom_order: 'border-orange-200 bg-orange-50',
  refund: 'border-red-200 bg-red-50',
  email: 'border-purple-200 bg-purple-50',
  note: 'border-maple bg-parchment',
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  function load() {
    fetch(`/api/admin/customers/${params.id}`)
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => {
        if (d) {
          setData(d)
          setEditName(d.customer.name ?? '')
          setEditPhone(d.customer.phone ?? '')
          setLoading(false)
        }
      })
  }

  useEffect(() => { load() }, [])

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setSaving(true)
    await fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.id, note }),
    })
    setNote('')
    setSaving(false)
    load()
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.id, name: editName, phone: editPhone }),
    })
    setEditing(false)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  const { customer, orders, customOrders, totalSpend } = data
  const events: CustomerEvent[] = [...(customer.events ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm text-forest hover:underline">← All Customers</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-maple rounded-lg p-5">
            {editing ? (
              <form onSubmit={saveProfile} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-walnut block mb-1">Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-walnut block mb-1">Phone</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                    className="w-full border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-cherry text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90">Save</button>
                  <button type="button" onClick={() => setEditing(false)} className="text-sm text-slate hover:underline">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className={`text-xl text-walnut ${serif.className}`}>{customer.name || 'Unknown'}</h2>
                    <p className="text-slate text-sm">{customer.email}</p>
                    {customer.phone && <p className="text-slate text-sm">{customer.phone}</p>}
                  </div>
                  <button type="button" onClick={() => setEditing(true)} className="text-xs text-forest hover:underline">Edit</button>
                </div>
                <p className="text-xs text-slate">Customer since {new Date(customer.created_at).toLocaleDateString()}</p>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white border border-maple rounded-lg p-5 space-y-3">
            <h3 className={`text-sm font-semibold text-walnut ${serif.className}`}>Stats</h3>
            <div className="flex justify-between text-sm"><span className="text-slate">Orders</span><span className="font-semibold text-walnut">{orders.length}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate">Total Spend</span><span className="font-semibold text-cherry">${totalSpend.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate">Avg. Order</span><span className="font-semibold text-walnut">${orders.length ? (totalSpend / orders.filter((o: any) => o.status !== 'cancelled').length || 0).toFixed(2) : '0.00'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate">Custom Requests</span><span className="font-semibold text-walnut">{customOrders.length}</span></div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-maple rounded-lg p-5">
            <h3 className={`text-sm font-semibold text-walnut mb-3 ${serif.className}`}>Actions</h3>
            <div className="space-y-2">
              <a href={`mailto:${customer.email}`} className="block text-sm text-forest hover:underline">✉️ Send email</a>
              <Link href={`/admin/orders`} className="block text-sm text-forest hover:underline">📦 View all orders</Link>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add note */}
          <div className="bg-white border border-maple rounded-lg p-5">
            <h3 className={`text-lg text-walnut mb-3 ${serif.className}`}>Add Note</h3>
            <form onSubmit={addNote} className="flex gap-2">
              <input
                type="text" value={note} onChange={e => setNote(e.target.value)}
                placeholder="e.g. Prefers walnut, mentioned anniversary gift…"
                className="flex-1 border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment"
              />
              <button type="submit" disabled={saving || !note.trim()}
                className="bg-cherry text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
                {saving ? '…' : 'Add'}
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-maple rounded-lg p-5">
            <h3 className={`text-lg text-walnut mb-4 ${serif.className}`}>Interaction Timeline</h3>
            {events.length === 0 ? (
              <p className="text-slate text-sm">No interactions yet.</p>
            ) : (
              <div className="space-y-3">
                {events.map((ev, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg border ${EVENT_COLORS[ev.type] ?? 'border-maple bg-white'}`}>
                    <span className="text-lg flex-shrink-0">{EVENT_ICONS[ev.type] ?? '•'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-walnut">{ev.text}</p>
                      <p className="text-xs text-slate mt-0.5">{new Date(ev.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order history */}
          {orders.length > 0 && (
            <div className="bg-white border border-maple rounded-lg p-5">
              <h3 className={`text-lg text-walnut mb-4 ${serif.className}`}>Order History</h3>
              <div className="space-y-2">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b border-maple last:border-0 text-sm">
                    <div>
                      <span className="font-mono text-walnut">{order.id.slice(0, 8)}…</span>
                      <span className="text-slate ml-3">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-walnut">${Number(order.total).toFixed(2)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status as OrderStatus] ?? 'bg-blue-100 text-blue-800'}`}>
                        {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom order history */}
          {customOrders.length > 0 && (
            <div className="bg-white border border-maple rounded-lg p-5">
              <h3 className={`text-lg text-walnut mb-4 ${serif.className}`}>Custom Order Requests</h3>
              <div className="space-y-3">
                {customOrders.map((co: any) => (
                  <div key={co.id} className="py-2 border-b border-maple last:border-0 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate text-xs">{new Date(co.created_at).toLocaleDateString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        co.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        co.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{co.status}</span>
                    </div>
                    <p className="text-walnut whitespace-pre-line">{co.description}</p>
                    {co.wood_preference && <p className="text-slate text-xs mt-1">Wood: {co.wood_preference} · Budget: {co.budget ?? 'TBD'}</p>}
                    {Array.isArray(co.reference_images) && co.reference_images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {co.reference_images.map((url: string, ri: number) => (
                          <a key={ri} href={url} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={url} alt={`reference ${ri + 1}`} className="h-20 w-20 object-cover rounded border border-maple hover:border-cherry" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
