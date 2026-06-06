'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { serif } from '@/controls/fonts'

interface PromoCode {
  id: string
  code: string
  description: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number
  max_uses: number | null
  uses: number
  active: boolean
  expires_at: string | null
  created_at: string
}

type FormState = { code: string; description: string; type: 'percent' | 'fixed'; value: number; min_order: number; max_uses: string; expires_at: string }
const empty: FormState = { code: '', description: '', type: 'percent', value: 10, min_order: 0, max_uses: '', expires_at: '' }

export default function PromoAdminPage() {
  const router = useRouter()
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/promo')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setCodes(d.codes ?? []); setLoading(false) } })
  }, [router])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        code: form.code.toUpperCase(),
        max_uses: form.max_uses === '' ? null : Number(form.max_uses),
        expires_at: form.expires_at || null,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to create code'); setSaving(false); return }
    setCodes(prev => [data.code, ...prev])
    setForm(empty)
    setSaving(false)
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch('/api/admin/promo', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !active }) })
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c))
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  return (
    <div className="p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className={`text-3xl text-walnut ${serif.className}`}>Promo Codes</h1>
        </div>

        {/* Create form */}
        <form onSubmit={handleCreate} className="bg-white border border-maple rounded-lg p-6 mb-8 space-y-4">
          <h2 className={`text-xl text-walnut ${serif.className}`}>Create New Code</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Code *</label>
              <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE10" className="w-full border border-maple rounded px-3 py-2 font-mono uppercase focus:outline-none focus:border-cherry bg-parchment" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Summer sale" className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Discount Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))}
                className="w-full border border-maple rounded px-3 py-2 bg-parchment focus:outline-none focus:border-cherry">
                <option value="percent">Percent off (%)</option>
                <option value="fixed">Fixed amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">
                Value ({form.type === 'percent' ? '%' : '$'}) *
              </label>
              <input required type="number" min="0.01" step="0.01" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Min. Order ($)</label>
              <input type="number" min="0" step="0.01" value={form.min_order}
                onChange={e => setForm(f => ({ ...f, min_order: Number(e.target.value) }))}
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Max Uses (blank = unlimited)</label>
              <input type="number" min="1" value={form.max_uses}
                onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                placeholder="unlimited" className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-walnut mb-1">Expires (blank = never)</label>
              <input type="date" value={form.expires_at}
                onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={saving}
            className="bg-cherry text-white px-6 py-2 rounded font-semibold hover:bg-opacity-90 disabled:opacity-50">
            {saving ? 'Creating…' : 'Create Code'}
          </button>
        </form>

        {/* Existing codes */}
        <div className="space-y-3">
          {codes.length === 0 && <p className="text-slate text-center py-8">No promo codes yet.</p>}
          {codes.map(c => (
            <div key={c.id} className={`bg-white border rounded-lg p-4 flex items-center justify-between gap-4 ${c.active ? 'border-maple' : 'border-gray-200 opacity-60'}`}>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-walnut text-lg">{c.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {c.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-sm text-slate mt-1">
                  {c.type === 'percent' ? `${c.value}% off` : `$${c.value} off`}
                  {c.min_order > 0 && ` · min $${c.min_order}`}
                  {c.max_uses !== null && ` · ${c.uses}/${c.max_uses} uses`}
                  {c.max_uses === null && ` · ${c.uses} uses`}
                  {c.expires_at && ` · expires ${new Date(c.expires_at).toLocaleDateString()}`}
                  {c.description && ` · ${c.description}`}
                </div>
              </div>
              <button onClick={() => toggleActive(c.id, c.active)}
                className={`text-sm px-3 py-1 rounded border ${c.active ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                {c.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
