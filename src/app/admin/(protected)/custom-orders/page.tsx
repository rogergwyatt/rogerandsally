'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { serif } from '@/controls/fonts'

type COStatus = 'new' | 'quoted' | 'accepted' | 'declined'

const STATUSES: COStatus[] = ['new', 'quoted', 'accepted', 'declined']
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
}

export default function CustomOrdersPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<COStatus | 'all'>('all')
  const [draft, setDraft] = useState<Record<string, { quote: string; notes: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [sendingQuote, setSendingQuote] = useState<string | null>(null)
  const [quoteMsg, setQuoteMsg] = useState<Record<string, string>>({})

  function load() {
    fetch('/api/admin/custom-orders')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setItems(d.customOrders ?? []); setLoading(false) } })
  }
  useEffect(() => { load() }, [])

  async function update(id: string, patch: { status?: string; quoteAmount?: string; notes?: string }) {
    setSaving(id)
    await fetch('/api/admin/custom-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    })
    setItems(prev => prev.map(o => o.id === id ? {
      ...o,
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.quoteAmount !== undefined ? { quote_amount: patch.quoteAmount === '' ? null : Number(patch.quoteAmount) } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    } : o))
    setSaving(null)
  }

  async function sendQuote(id: string, quote: string, message: string) {
    if (!quote) { alert('Enter a quote amount first.'); return }
    setSendingQuote(id)
    const res = await fetch('/api/admin/custom-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quoteAmount: quote, message }),
    })
    const data = await res.json()
    setSendingQuote(null)
    if (!res.ok) { alert(data.error ?? 'Failed to send quote'); return }
    setItems(prev => prev.map(o => o.id === id ? { ...o, quote_amount: Number(quote), status: 'quoted' } : o))
    alert('Quote emailed to the customer.')
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  const filtered = filter === 'all' ? items : items.filter(o => o.status === filter)

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl text-walnut ${serif.className}`}>Custom Orders</h1>
        <span className="text-sm text-slate">{items.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded text-sm capitalize transition-colors ${filter === s ? 'bg-cherry text-white' : 'bg-white border border-maple text-slate hover:border-cherry'}`}>
            {s} {s !== 'all' && `(${items.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-16 text-slate">No custom orders.</div>}

      <div className="space-y-3">
        {filtered.map(co => {
          const d = draft[co.id] ?? { quote: co.quote_amount ?? '', notes: co.notes ?? '' }
          return (
            <div key={co.id} className="bg-white border border-maple rounded-lg overflow-hidden">
              <button
                className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 hover:bg-parchment transition-colors"
                onClick={() => setExpanded(expanded === co.id ? null : co.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-walnut">{co.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[co.status] ?? ''}`}>{co.status}</span>
                  </div>
                  <div className="text-sm text-slate mt-1 truncate">{co.email}</div>
                  <div className="text-xs text-slate">{new Date(co.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  {co.quote_amount != null && <div className="font-semibold text-walnut whitespace-nowrap">${Number(co.quote_amount).toFixed(2)}</div>}
                  <div className="text-xs text-slate">{co.budget || '—'}</div>
                </div>
                <span className="text-slate flex-shrink-0 mt-0.5">{expanded === co.id ? '▲' : '▼'}</span>
              </button>

              {expanded === co.id && (
                <div className="border-t border-maple px-5 py-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <div><span className="text-slate">Phone:</span> <span className="text-walnut">{co.phone || '—'}</span></div>
                    {co.wood_preference && <div><span className="text-slate">Wood:</span> <span className="text-walnut">{co.wood_preference}</span></div>}
                    {co.dimensions && <div><span className="text-slate">Dimensions:</span> <span className="text-walnut">{co.dimensions}</span></div>}
                    {co.timeline && <div><span className="text-slate">Timeline:</span> <span className="text-walnut">{co.timeline}</span></div>}
                    {co.budget && <div><span className="text-slate">Budget:</span> <span className="text-walnut">{co.budget}</span></div>}
                  </div>

                  {co.ai_specs && ([
                    ['wood', 'Wood'], ['dimensions', 'Dimensions'], ['thickness', 'Thickness'],
                    ['juiceGroove', 'Juice groove'], ['engraving', 'Engraving'], ['budget', 'Budget'],
                  ] as [string, string][]).some(([k]) => co.ai_specs[k]) && (
                    <div>
                      <p className="text-xs font-semibold text-walnut mb-1">Specifications</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        {([
                          ['wood', 'Wood'], ['dimensions', 'Dimensions'], ['thickness', 'Thickness'],
                          ['juiceGroove', 'Juice groove'], ['engraving', 'Engraving'], ['budget', 'Budget'],
                        ] as [string, string][])
                          .filter(([k]) => co.ai_specs[k])
                          .map(([k, label]) => (
                            <div key={k}><span className="text-slate">{label}:</span> <span className="text-walnut">{co.ai_specs[k]}</span></div>
                          ))}
                      </div>
                    </div>
                  )}

                  {co.ai_image_url && (
                    <div>
                      <p className="text-xs font-semibold text-walnut mb-1">Generated preview</p>
                      <a href={co.ai_image_url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={co.ai_image_url} alt="Generated preview" className="max-w-xs rounded border border-maple hover:border-cherry" />
                      </a>
                    </div>
                  )}

                  {Array.isArray(co.chat_transcript) && co.chat_transcript.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold text-walnut mb-1">Conversation</p>
                      <div className="space-y-2 bg-parchment border border-maple rounded p-3">
                        {co.chat_transcript.map((m: any, i: number) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${m.role === 'user' ? 'bg-cherry text-white' : 'bg-maple text-walnut'}`}>
                              {m.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-walnut mb-1">Description</p>
                      <p className="text-sm text-slate whitespace-pre-line">{co.description}</p>
                    </div>
                  )}

                  {Array.isArray(co.reference_images) && co.reference_images.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-walnut mb-1">Reference images</p>
                      <div className="flex gap-2 flex-wrap">
                        {co.reference_images.map((url: string, i: number) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt={`ref ${i + 1}`} className="h-24 w-24 object-cover rounded border border-maple hover:border-cherry" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 items-end pt-2 border-t border-maple">
                    <div>
                      <label className="block text-xs font-semibold text-walnut mb-1">Status</label>
                      <select value={co.status} onChange={e => update(co.id, { status: e.target.value })}
                        className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry capitalize">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-walnut mb-1">Quote ($)</label>
                      <input type="number" min="0" step="0.01" value={d.quote}
                        onChange={e => setDraft(p => ({ ...p, [co.id]: { ...d, quote: e.target.value } }))}
                        className="w-28 border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
                    </div>
                    <div className="flex-1 min-w-48">
                      <label className="block text-xs font-semibold text-walnut mb-1">Notes</label>
                      <input type="text" value={d.notes}
                        onChange={e => setDraft(p => ({ ...p, [co.id]: { ...d, notes: e.target.value } }))}
                        className="w-full border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
                    </div>
                    <button onClick={() => update(co.id, { quoteAmount: d.quote, notes: d.notes })}
                      disabled={saving === co.id}
                      className="bg-forest text-white px-3 py-1.5 rounded text-sm hover:bg-opacity-90 disabled:opacity-50">
                      {saving === co.id ? '…' : 'Save'}
                    </button>
                    <a href={`mailto:${co.email}?subject=Your Roger %26 Sally custom order`} className="text-sm text-forest hover:underline">Email</a>
                  </div>

                  {/* Send quote */}
                  <div className="pt-3 border-t border-maple">
                    <label className="block text-xs font-semibold text-walnut mb-1">Quote message to customer (optional)</label>
                    <textarea rows={2}
                      value={quoteMsg[co.id] ?? ''}
                      onChange={e => setQuoteMsg(p => ({ ...p, [co.id]: e.target.value }))}
                      placeholder="A note to include with the quote email…"
                      className="w-full border border-maple rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-cherry resize-none mb-2" />
                    <button onClick={() => sendQuote(co.id, d.quote, quoteMsg[co.id] ?? '')}
                      disabled={sendingQuote === co.id}
                      className="bg-cherry text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
                      {sendingQuote === co.id ? 'Sending…' : `Email Quote${d.quote ? ` ($${Number(d.quote).toFixed(2)})` : ''}`}
                    </button>
                    <span className="text-xs text-slate ml-3">Emails the customer the quote above and marks this “quoted”.</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
