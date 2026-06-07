'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { serif } from '@/controls/fonts'
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/lib/types'

const STATUS_COLORS = ORDER_STATUS_COLORS

function StatCard({ label, value, sub, color = 'text-walnut' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-maple rounded-lg p-5">
      <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setData(d); setLoading(false) } })
  }, [router])

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  const { totalRevenue, todayRevenue, totalOrders, todayOrders, statusCounts, abandonedCarts, promoCodes, customerCount, newCustomOrders } = data

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-3xl text-walnut ${serif.className}`}>Dashboard</h1>
        <p className="text-slate text-sm mt-1">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Revenue Today" value={`$${todayRevenue.toFixed(2)}`} sub={`${todayOrders.length} order${todayOrders.length !== 1 ? 's' : ''}`} color="text-cherry" />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} sub={`${totalOrders} orders all time`} />
        <StatCard label="Abandoned Carts" value={abandonedCarts.length} sub="with email — eligible for recovery" color={abandonedCarts.length > 0 ? 'text-cherry' : 'text-walnut'} />
        <StatCard label="Active Promo Codes" value={promoCodes.length} sub="running now" />
        <StatCard label="Total Customers" value={customerCount} sub={<><a href="/admin/customers" className="text-forest hover:underline">view all →</a></>  as any} />
        <StatCard label="New Custom Orders" value={newCustomOrders} sub={<><a href="/admin/custom-orders" className="text-forest hover:underline">review →</a></> as any} color={newCustomOrders > 0 ? 'text-cherry' : 'text-walnut'} />
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {ORDER_STATUSES.map(s => (
          <Link key={s} href="/admin/orders"
            className="bg-white border border-maple rounded-lg p-3 text-center hover:border-cherry transition-colors">
            <p className="text-2xl font-bold text-walnut">{statusCounts[s] ?? 0}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s]}`}>{ORDER_STATUS_LABELS[s]}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's orders */}
        <div className="bg-white border border-maple rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg text-walnut ${serif.className}`}>Today's Orders</h2>
            <Link href="/admin/orders" className="text-xs text-forest hover:underline">View all →</Link>
          </div>
          {todayOrders.length === 0 ? (
            <p className="text-slate text-sm py-6 text-center">No orders today yet.</p>
          ) : (
            <div className="space-y-3">
              {todayOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-maple last:border-0">
                  <div>
                    <p className="text-sm font-medium text-walnut font-mono">{order.id.slice(0, 8)}…</p>
                    <p className="text-xs text-slate">{order.email} · {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-walnut">${Number(order.total).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status as OrderStatus] ?? ''}`}>{ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active promo codes */}
        <div className="bg-white border border-maple rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg text-walnut ${serif.className}`}>Active Promo Codes</h2>
            <Link href="/admin/promo" className="text-xs text-forest hover:underline">Manage →</Link>
          </div>
          {promoCodes.length === 0 ? (
            <p className="text-slate text-sm py-6 text-center">No active promo codes.</p>
          ) : (
            <div className="space-y-3">
              {promoCodes.map((code: any) => (
                <div key={code.id} className="flex items-center justify-between py-2 border-b border-maple last:border-0">
                  <div>
                    <p className="font-mono font-bold text-walnut">{code.code}</p>
                    <p className="text-xs text-slate">
                      {code.type === 'percent' ? `${code.value}%` : `$${code.value}`} off
                      {code.min_order > 0 && ` · min $${code.min_order}`}
                      {code.description && ` · ${code.description}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate">{code.uses} use{code.uses !== 1 ? 's' : ''}</p>
                    {code.max_uses && <p className="text-xs text-slate">{code.max_uses - code.uses} left</p>}
                    {code.expires_at && <p className="text-xs text-slate">exp {new Date(code.expires_at).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Abandoned carts */}
        <div className="bg-white border border-maple rounded-lg p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg text-walnut ${serif.className}`}>Abandoned Carts</h2>
            <span className="text-xs text-slate">Recovery emails send automatically after 24 hrs</span>
          </div>
          {abandonedCarts.length === 0 ? (
            <p className="text-slate text-sm py-6 text-center">No abandoned carts with contact info.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate border-b border-maple">
                    <th className="pb-2 font-semibold">Email</th>
                    <th className="pb-2 font-semibold">Items</th>
                    <th className="pb-2 font-semibold">Value</th>
                    <th className="pb-2 font-semibold">Abandoned</th>
                    <th className="pb-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.slice(0, 8).map((cart: any) => {
                    const items = cart.cart_data?.items ?? []
                    const value = items.reduce((s: number, i: any) => s + (i.unitPrice ?? 0) * (i.quantity ?? 1), 0)
                    return (
                      <tr key={cart.id} className="border-b border-maple last:border-0">
                        <td className="py-2 text-walnut">{cart.email}</td>
                        <td className="py-2 text-slate">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                        <td className="py-2 text-walnut font-medium">${value.toFixed(2)}</td>
                        <td className="py-2 text-slate">{new Date(cart.updated_at).toLocaleDateString()}</td>
                        <td className="py-2">
                          <a href={`mailto:${cart.email}?subject=Your Roger %26 Sally cart&body=Hi there — you left something in your cart!`}
                            className="text-forest hover:underline text-xs">Email</a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {abandonedCarts.length > 8 && (
                <p className="text-xs text-slate mt-2">+{abandonedCarts.length - 8} more</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
