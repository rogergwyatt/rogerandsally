'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { serif } from '@/controls/fonts'
import { Customer } from '@/lib/types'

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  function load(q = '') {
    fetch(`/api/admin/customers${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setCustomers(d.customers ?? []); setLoading(false) } })
  }

  useEffect(() => { load() }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    load(search)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl text-walnut ${serif.className}`}>Customers</h1>
        <span className="text-sm text-slate">{customers.length} total</span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text" placeholder="Search by email…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-white"
        />
        <button type="submit" className="bg-forest text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90">Search</button>
        {search && <button type="button" onClick={() => { setSearch(''); load() }} className="text-sm text-slate hover:underline">Clear</button>}
      </form>

      {customers.length === 0 ? (
        <p className="text-slate text-center py-16">No customers yet. They'll appear here after their first order.</p>
      ) : (
        <div className="bg-white border border-maple rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-parchment border-b border-maple">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase">Customer</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate uppercase">Orders</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate uppercase">Total Spend</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase hidden md:table-cell">Last Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate uppercase hidden md:table-cell">Since</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-maple">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-parchment transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-walnut">{c.name || '—'}</div>
                    <div className="text-slate text-xs">{c.email}</div>
                    {c.phone && <div className="text-slate text-xs">{c.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-walnut">{(c as any).orderCount ?? 0}</td>
                  <td className="px-4 py-3 text-right font-semibold text-cherry">${((c as any).totalSpend ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate hidden md:table-cell">
                    {(c as any).lastOrderAt ? new Date((c as any).lastOrderAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate hidden md:table-cell">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="text-forest text-xs hover:underline whitespace-nowrap">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
