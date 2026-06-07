'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderStatus, RefundRecord } from '@/lib/types'
import { serif } from '@/controls/fonts'
import { splitOptions } from '@/lib/orderOptions'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  returned:   'bg-orange-100 text-orange-800',
}

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

export default function AdminOrdersClient() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tracking, setTracking] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [refundState, setRefundState] = useState<Record<string, { amount: string; reason: string; processing: boolean; error: string }>>({})
  const [showRefund, setShowRefund] = useState<string | null>(null)
  const [labelState, setLabelState] = useState<Record<string, { buying: boolean; error: string }>>({})

  async function buyLabel(orderId: string) {
    setLabelState(s => ({ ...s, [orderId]: { buying: true, error: '' } }))
    const res = await fetch('/api/admin/shipping-label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setLabelState(s => ({ ...s, [orderId]: { buying: false, error: data.error ?? 'Failed to buy label' } }))
      return
    }
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'shipped' as OrderStatus,
      trackingNumber: data.trackingNumber,
      ...({ carrier: data.carrier, label_url: data.labelUrl } as any),
    } : o))
    setLabelState(s => ({ ...s, [orderId]: { buying: false, error: '' } }))
  }

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

  async function processRefund(orderId: string, full: boolean, total: number) {
    const state = refundState[orderId] ?? { amount: '', reason: '', processing: false, error: '' }
    const amountCents = full ? undefined : Math.round(parseFloat(state.amount) * 100)
    if (!full && (!amountCents || amountCents <= 0 || amountCents > total * 100)) {
      setRefundState(r => ({ ...r, [orderId]: { ...state, error: `Enter a valid amount (max $${total.toFixed(2)})` } }))
      return
    }
    setRefundState(r => ({ ...r, [orderId]: { ...state, processing: true, error: '' } }))
    const res = await fetch('/api/admin/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, full, amountCents, reason: state.reason || 'Customer return' }),
    })
    const data = await res.json()
    if (!res.ok) {
      setRefundState(r => ({ ...r, [orderId]: { ...state, processing: false, error: data.error ?? 'Refund failed' } }))
      return
    }
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: data.newStatus,
      ...(data.refund ? { refunds: [...((o as any).refunds ?? []), data.refund] } : {}),
    } : o))
    setRefundState(r => ({ ...r, [orderId]: { amount: '', reason: '', processing: false, error: '' } }))
    setShowRefund(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading orders…</div>

  return (
    <div className="p-6 max-w-6xl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl text-walnut ${serif.className}`}>Orders</h1>
          <span className="text-sm text-slate">{orders.length} total</span>
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
                className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 sm:gap-4 hover:bg-parchment transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-mono text-sm text-walnut">{order.id.slice(0, 8)}…</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate mt-1 truncate">{order.email}</div>
                  <div className="text-xs text-slate">{new Date((order as any).created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-walnut whitespace-nowrap">${order.total?.toFixed(2)}</div>
                  <div className="text-xs text-slate whitespace-nowrap">{order.items?.length ?? 0} item(s)</div>
                </div>
                <span className="text-slate flex-shrink-0 mt-0.5">{expanded === order.id ? '▲' : '▼'}</span>
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
                          {splitOptions(item.selectedOptions).text.map(({ key, value }) => (
                            <div key={key} className="text-xs">{key}: {value}</div>
                          ))}
                          {splitOptions(item.selectedOptions).graphics.map((url, gi) => (
                            <div key={gi} className="text-xs">
                              graphic:{' '}
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-forest font-semibold hover:underline">
                                Download to engrave ↓
                              </a>
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="text-sm mt-2 space-y-0.5">
                        <div className="flex justify-between text-slate"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                        <div className="flex justify-between text-slate"><span>Shipping</span><span>${order.shipping?.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold text-walnut"><span>Total</span><span>${order.total?.toFixed(2)}</span></div>
                      </div>
                    </div>

                    {/* Shipping address — Supabase returns snake_case shipping_address */}
                    {(() => {
                      const ship = (order as any).shipping_address ?? order.shippingAddress ?? {}
                      return (
                        <div>
                          <h3 className="text-sm font-semibold text-walnut mb-2">Ship To</h3>
                          <div className="text-sm text-slate leading-6">
                            {ship.name || ship.line1 ? (
                              <>
                                <div>{ship.name}</div>
                                <div>{ship.line1}</div>
                                {ship.line2 && <div>{ship.line2}</div>}
                                <div>{ship.city}, {ship.state} {ship.zip}</div>
                              </>
                            ) : (
                              <span className="text-slate/60">No shipping address on file</span>
                            )}
                          </div>
                        </div>
                      )
                    })()}
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
                      <label className="block text-xs font-semibold text-walnut mb-1">Shipping</label>
                      {(order as any).label_url ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <a href={(order as any).label_url} target="_blank" rel="noopener noreferrer"
                            className="bg-forest text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90">
                            🏷️ Print Label
                          </a>
                          <span className="text-sm text-slate">
                            {(order as any).carrier} · <span className="font-mono">{order.trackingNumber}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center flex-wrap">
                          <button
                            type="button"
                            onClick={() => buyLabel(order.id)}
                            disabled={labelState[order.id]?.buying}
                            className="bg-cherry text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
                          >
                            {labelState[order.id]?.buying ? 'Buying…' : 'Buy Shipping Label'}
                          </button>
                          {/* Manual tracking fallback */}
                          <input
                            type="text"
                            placeholder="or enter tracking # manually"
                            value={tracking[order.id] ?? order.trackingNumber ?? ''}
                            onChange={e => setTracking(t => ({ ...t, [order.id]: e.target.value }))}
                            className="flex-1 min-w-40 border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry"
                          />
                          <button
                            onClick={() => updateOrder(order.id, undefined, tracking[order.id] ?? '')}
                            disabled={saving === order.id}
                            className="bg-forest text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90 disabled:opacity-50"
                          >
                            {saving === order.id ? '…' : 'Save'}
                          </button>
                        </div>
                      )}
                      {labelState[order.id]?.error && (
                        <p className="text-red-600 text-xs mt-1">{labelState[order.id].error}</p>
                      )}
                    </div>
                    <a
                      href={`mailto:${order.email}?subject=Your Roger %26 Sally Order`}
                      className="text-sm text-forest hover:underline"
                    >
                      Email customer
                    </a>
                    {['delivered', 'shipped', 'processing', 'returned'].includes(order.status) && (
                      <button
                        type="button"
                        onClick={() => setShowRefund(showRefund === order.id ? null : order.id)}
                        className="text-sm text-orange-600 hover:underline"
                      >
                        {showRefund === order.id ? 'Cancel refund' : 'Issue refund'}
                      </button>
                    )}
                  </div>

                  {/* Refund panel */}
                  {showRefund === order.id && (
                    <div className="mt-4 border-t border-maple pt-4">
                      <h4 className="text-sm font-semibold text-walnut mb-3">Issue Refund</h4>
                      <div className="flex flex-wrap gap-3 items-end">
                        <div>
                          <label className="block text-xs font-semibold text-walnut mb-1">Partial Amount ($)</label>
                          <input
                            type="number" min="0.01" step="0.01" max={order.total}
                            placeholder={`Max $${order.total?.toFixed(2)}`}
                            value={refundState[order.id]?.amount ?? ''}
                            onChange={e => setRefundState(r => ({ ...r, [order.id]: { ...r[order.id] ?? { amount: '', reason: '', processing: false, error: '' }, amount: e.target.value } }))}
                            className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry w-36"
                          />
                        </div>
                        <div className="flex-1 min-w-48">
                          <label className="block text-xs font-semibold text-walnut mb-1">Reason</label>
                          <input
                            type="text" placeholder="e.g. Damaged in shipping"
                            value={refundState[order.id]?.reason ?? ''}
                            onChange={e => setRefundState(r => ({ ...r, [order.id]: { ...r[order.id] ?? { amount: '', reason: '', processing: false, error: '' }, reason: e.target.value } }))}
                            className="w-full border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => processRefund(order.id, false, order.total)}
                          disabled={refundState[order.id]?.processing}
                          className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {refundState[order.id]?.processing ? '…' : 'Partial Refund'}
                        </button>
                        <button
                          type="button"
                          onClick={() => processRefund(order.id, true, order.total)}
                          disabled={refundState[order.id]?.processing}
                          className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {refundState[order.id]?.processing ? '…' : `Full Refund ($${order.total?.toFixed(2)})`}
                        </button>
                      </div>
                      {refundState[order.id]?.error && (
                        <p className="text-red-600 text-xs mt-2">{refundState[order.id].error}</p>
                      )}
                    </div>
                  )}

                  {/* Refund history */}
                  {((order as any).refunds ?? []).length > 0 && (
                    <div className="mt-4 border-t border-maple pt-4">
                      <h4 className="text-sm font-semibold text-walnut mb-2">Refund History</h4>
                      {((order as any).refunds as RefundRecord[]).map((r, i) => (
                        <div key={i} className="flex justify-between text-sm py-1 border-b border-maple last:border-0">
                          <div className="text-slate">
                            <span className="capitalize">{r.refundedBy}</span> refund · {r.reason}
                            <span className="text-xs ml-2 text-slate/60">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-orange-700 font-medium">−${r.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
