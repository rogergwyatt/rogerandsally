'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderStatus } from '@/lib/types'
import { serif } from '@/controls/fonts'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersClient() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tracking, setTracking] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => {
        if (r.status === 401) { router.push('/admin/login'); return null }
        return r.json()
      })
      .then(d => {
        if (d) { setOrders(d.orders ?? []); setLoading(false) }
      })
  }, [router])

  async function updateOrder(id: string, status?: OrderStatus, trackingNumber?: string) {
    setSaving(id)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, trackingNumber }),
    })
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      ...(status ? { status } : {}),
      ...(trackingNumber !== undefined ? { trackingNumber } : {}),
    } : o))
    setSaving(null)
  }

  async function logout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    router.push('/admin/login')
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-parchment text-slate">Loading orders…</div>

  return (
    <main className="bg-parchment min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl text-walnut ${serif.className}`}>Orders</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate">{orders.length} total</span>
            <button onClick={logout} className="text-sm text-slate hover:text-cherry underline">Sign out</button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-sm capitalize transition-colors ${filter === s ? 'bg-cherry text-white' : 'bg-white border border-maple text-slate hover:border-cherry'}`}>
              {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate">No orders yet.</div>
        )}

        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white border border-maple rounded-lg overflow-hidden">
              {/* Row summary */}
              <button
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-parchment transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-walnut">{order.id.slice(0, 8)}…</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate mt-1">{order.email} · {new Date((order as any).created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-walnut">${order.total?.toFixed(2)}</div>
                  <div className="text-xs text-slate">{order.items?.length ?? 0} item(s)</div>
                </div>
                <span className="text-slate ml-2">{expanded === order.id ? '▲' : '▼'}</span>
              </button>

              {/* Expanded detail */}
              {expanded === order.id && (
                <div className="border-t border-maple px-5 py-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-walnut mb-2">Items</h3>
                      {order.items?.map((item, i) => (
                        <div key={i} className="text-sm text-slate mb-2 pl-2 border-l-2 border-maple">
                          <div>{item.product.name} × {item.quantity} — ${(item.unitPrice * item.quantity).toFixed(2)}</div>
                          {Object.entries(item.selectedOptions).map(([k, v]) =>
                            v ? <div key={k} className="text-xs">{k}: {v}</div> : null
                          )}
                        </div>
                      ))}
                      <div className="text-sm mt-2 space-y-0.5">
                        <div className="flex justify-between text-slate"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                        <div className="flex justify-between text-slate"><span>Shipping</span><span>${order.shipping?.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold text-walnut"><span>Total</span><span>${order.total?.toFixed(2)}</span></div>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div>
                      <h3 className="text-sm font-semibold text-walnut mb-2">Ship To</h3>
                      <div className="text-sm text-slate leading-6">
                        <div>{order.shippingAddress?.name}</div>
                        <div>{order.shippingAddress?.line1}</div>
                        {order.shippingAddress?.line2 && <div>{order.shippingAddress.line2}</div>}
                        <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 items-end pt-2 border-t border-maple">
                    <div>
                      <label className="block text-xs font-semibold text-walnut mb-1">Status</label>
                      <select
                        value={order.status}
                        onChange={e => updateOrder(order.id, e.target.value as OrderStatus)}
                        className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry"
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                    <div className="flex-1 min-w-48">
                      <label className="block text-xs font-semibold text-walnut mb-1">Tracking Number</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 9400111899220012345678"
                          value={tracking[order.id] ?? order.trackingNumber ?? ''}
                          onChange={e => setTracking(t => ({ ...t, [order.id]: e.target.value }))}
                          className="flex-1 border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry"
                        />
                        <button
                          onClick={() => updateOrder(order.id, undefined, tracking[order.id] ?? '')}
                          disabled={saving === order.id}
                          className="bg-forest text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {saving === order.id ? '…' : 'Save'}
                        </button>
                      </div>
                    </div>
                    <a
                      href={`mailto:${order.email}?subject=Your Roger %26 Sally Order`}
                      className="text-sm text-forest hover:underline"
                    >
                      Email customer
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
