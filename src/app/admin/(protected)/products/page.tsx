'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { serif } from '@/controls/fonts'
import GraphicUpload from '@/controls/GraphicUpload'
import VideoUpload from '@/controls/VideoUpload'

type Choice = { label: string; priceModifier: number }
type Opt = { name: string; key: string; type?: 'text'; placeholder?: string; priceModifier?: number; choices?: Choice[] }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Map a DB row to the editable draft used by the form.
function rowToDraft(r: any) {
  return {
    id: r.id,
    slug: r.slug ?? '',
    name: r.name ?? '',
    tagline: r.tagline ?? '',
    description: r.description ?? '',
    category: r.category ?? '',
    images: Array.isArray(r.images) ? r.images : [],
    video_url: r.video_url ?? undefined,
    options: (Array.isArray(r.options) ? r.options : []) as Opt[],
    base_price: r.base_price ?? '',
    sale_price: r.sale_price ?? '',
    weight_lbs: r.weight_lbs ?? '',
    length_in: r.length_in ?? '',
    width_in: r.width_in ?? '',
    height_in: r.height_in ?? '',
    featured: !!r.featured,
    in_stock: r.in_stock ?? true,
  }
}

const blankDraft = () => rowToDraft({ in_stock: true, options: [], images: [] })

export default function ProductsAdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null) // product id, or 'new', or null
  const [draft, setDraft] = useState<any>(blankDraft())
  const [mediaBusy, setMediaBusy] = useState(false)
  const [saving, setSaving] = useState(false)

  function load() {
    fetch('/api/admin/products')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setProducts(d.products ?? []); setLoading(false) } })
  }
  useEffect(() => { load() }, [])

  function startNew() { setDraft(blankDraft()); setEditing('new') }
  function startEdit(p: any) { setDraft(rowToDraft(p)); setEditing(p.id) }
  function cancel() { setEditing(null) }

  function set(patch: any) { setDraft((d: any) => ({ ...d, ...patch })) }

  // Options helpers
  function addOption() { set({ options: [...draft.options, { name: '', key: '', choices: [{ label: '', priceModifier: 0 }] }] }) }
  function removeOption(i: number) { set({ options: draft.options.filter((_: Opt, idx: number) => idx !== i) }) }
  function updateOption(i: number, patch: Partial<Opt>) {
    set({ options: draft.options.map((o: Opt, idx: number) => idx === i ? { ...o, ...patch } : o) })
  }
  function setOptionName(i: number, name: string) { updateOption(i, { name, key: slugify(name) }) }
  function setOptionType(i: number, type: 'choices' | 'text') {
    if (type === 'text') updateOption(i, { type: 'text', priceModifier: draft.options[i].priceModifier ?? 0, placeholder: draft.options[i].placeholder ?? '', choices: undefined })
    else updateOption(i, { type: undefined, placeholder: undefined, priceModifier: undefined, choices: draft.options[i].choices ?? [{ label: '', priceModifier: 0 }] })
  }
  function addChoice(i: number) { updateOption(i, { choices: [...(draft.options[i].choices ?? []), { label: '', priceModifier: 0 }] }) }
  function removeChoice(i: number, ci: number) { updateOption(i, { choices: (draft.options[i].choices ?? []).filter((_: Choice, idx: number) => idx !== ci) }) }
  function updateChoice(i: number, ci: number, patch: Partial<Choice>) {
    updateOption(i, { choices: (draft.options[i].choices ?? []).map((c: Choice, idx: number) => idx === ci ? { ...c, ...patch } : c) })
  }

  async function save() {
    if (!draft.name || !draft.slug || draft.base_price === '' || draft.base_price == null) {
      alert('Name, slug, and base price are required.'); return
    }
    setSaving(true)
    const payload = { ...draft }
    const isNew = editing === 'new'
    const res = await fetch('/api/admin/products', {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { alert(data.error || 'Save failed'); return }
    setEditing(null)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setProducts(p => p.filter(x => x.id !== id))
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir
    if (j < 0 || j >= products.length) return
    const reordered = [...products]
    ;[reordered[index], reordered[j]] = [reordered[j], reordered[index]]
    setProducts(reordered)
    await Promise.all(reordered.map((p, i) =>
      fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, sort_order: i }) })
    ))
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  const photos: string[] = draft.images ?? []

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl text-walnut ${serif.className}`}>Products</h1>
        {editing === null && (
          <button onClick={startNew} className="bg-cherry text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90">+ New Product</button>
        )}
      </div>

      {editing !== null ? (
        <div className="bg-white border border-maple rounded-lg p-5 space-y-3">
          <h2 className={`text-lg text-walnut ${serif.className}`}>{editing === 'new' ? 'New product' : 'Edit product'}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => set({ name: e.target.value, slug: draft.slug || slugify(e.target.value) })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input placeholder="Slug (url)" value={draft.slug} onChange={e => set({ slug: slugify(e.target.value) })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          </div>
          <input placeholder="Tagline" value={draft.tagline} onChange={e => set({ tagline: e.target.value })}
            className="w-full border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          <textarea placeholder="Description" rows={3} value={draft.description} onChange={e => set({ description: e.target.value })}
            className="w-full border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input placeholder="Category" value={draft.category} onChange={e => set({ category: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input type="number" step="0.01" placeholder="Base price" value={draft.base_price} onChange={e => set({ base_price: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input type="number" step="0.01" placeholder="Sale price (optional)" value={draft.sale_price} onChange={e => set({ sale_price: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input type="number" step="0.01" placeholder="Weight (lbs)" value={draft.weight_lbs} onChange={e => set({ weight_lbs: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" step="0.25" placeholder="Length in" value={draft.length_in} onChange={e => set({ length_in: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input type="number" step="0.25" placeholder="Width in" value={draft.width_in} onChange={e => set({ width_in: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
            <input type="number" step="0.125" placeholder="Height in" value={draft.height_in} onChange={e => set({ height_in: e.target.value })}
              className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          </div>
          <div className="flex gap-6 text-sm text-slate">
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.featured} onChange={e => set({ featured: e.target.checked })} className="accent-cherry" /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.in_stock} onChange={e => set({ in_stock: e.target.checked })} className="accent-cherry" /> In stock</label>
          </div>

          {/* Photos */}
          <div>
            <p className="text-xs font-semibold text-walnut mb-1">Photos</p>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {photos.map((url, i) => (
                  <div key={i} className="relative h-16 w-16 rounded overflow-hidden border border-maple">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => set({ images: photos.filter((_, idx) => idx !== i) })} className="absolute top-0 right-0 bg-walnut/80 text-white text-xs w-5 h-5 leading-5 text-center">×</button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-cherry text-white text-[9px] text-center">primary</span>}
                  </div>
                ))}
              </div>
            )}
            <GraphicUpload label="Add a photo" value={undefined} onUploadingChange={setMediaBusy}
              onChange={url => { if (url) set({ images: [...photos, url] }) }} />
          </div>

          {/* Video */}
          <VideoUpload label="Product video (optional)" value={draft.video_url} onUploadingChange={setMediaBusy}
            onChange={url => set({ video_url: url })} />

          {/* Options */}
          <div className="border-t border-maple pt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-walnut">Options</p>
              <button onClick={addOption} className="text-xs text-forest hover:underline">+ Add option</button>
            </div>
            <div className="space-y-3">
              {draft.options.map((opt: Opt, i: number) => (
                <div key={i} className="border border-maple rounded p-3 bg-parchment">
                  <div className="flex gap-2 items-center mb-2">
                    <input placeholder="Option name (e.g. Wood Type)" value={opt.name} onChange={e => setOptionName(i, e.target.value)}
                      className="flex-1 border border-maple rounded px-2 py-1 text-sm bg-white" />
                    <select value={opt.type === 'text' ? 'text' : 'choices'} onChange={e => setOptionType(i, e.target.value as 'choices' | 'text')}
                      className="border border-maple rounded px-2 py-1 text-sm bg-white">
                      <option value="choices">Choices</option>
                      <option value="text">Text (engraving)</option>
                    </select>
                    <button onClick={() => removeOption(i)} className="text-xs text-slate hover:text-cherry">Remove</button>
                  </div>
                  {opt.type === 'text' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Placeholder text" value={opt.placeholder ?? ''} onChange={e => updateOption(i, { placeholder: e.target.value })}
                        className="border border-maple rounded px-2 py-1 text-sm bg-white" />
                      <input type="number" step="0.01" placeholder="Price modifier" value={opt.priceModifier ?? 0} onChange={e => updateOption(i, { priceModifier: Number(e.target.value) })}
                        className="border border-maple rounded px-2 py-1 text-sm bg-white" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(opt.choices ?? []).map((c: Choice, ci: number) => (
                        <div key={ci} className="flex gap-2 items-center">
                          <input placeholder="Choice label" value={c.label} onChange={e => updateChoice(i, ci, { label: e.target.value })}
                            className="flex-1 border border-maple rounded px-2 py-1 text-sm bg-white" />
                          <input type="number" step="0.01" placeholder="+$" value={c.priceModifier} onChange={e => updateChoice(i, ci, { priceModifier: Number(e.target.value) })}
                            className="w-24 border border-maple rounded px-2 py-1 text-sm bg-white" />
                          <button onClick={() => removeChoice(i, ci)} className="text-xs text-slate hover:text-cherry">×</button>
                        </div>
                      ))}
                      <button onClick={() => addChoice(i)} className="text-xs text-forest hover:underline">+ Add choice</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving || mediaBusy} className="bg-forest text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
              {mediaBusy ? 'Uploading…' : saving ? 'Saving…' : 'Save Product'}
            </button>
            <button onClick={cancel} className="px-4 py-2 rounded text-sm text-slate hover:text-cherry">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {products.length === 0 && <p className="text-slate text-center py-8">No products yet.</p>}
          {products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 text-sm border border-maple rounded px-3 py-2 bg-white">
              <div className="flex flex-col flex-shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate hover:text-cherry disabled:opacity-25 leading-none text-xs">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === products.length - 1} className="text-slate hover:text-cherry disabled:opacity-25 leading-none text-xs">▼</button>
              </div>
              {Array.isArray(p.images) && p.images[0] && <img src={p.images[0]} alt="" className="h-12 w-12 object-cover rounded flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-walnut">{p.name} — ${Number(p.base_price).toFixed(2)}</div>
                <div className="text-xs text-slate">/{p.slug}{p.featured ? ' · featured' : ''}{p.in_stock ? '' : ' · out of stock'}</div>
              </div>
              <button onClick={() => startEdit(p)} className="text-xs text-forest hover:underline flex-shrink-0">Edit</button>
              <button onClick={() => remove(p.id)} className="text-xs text-slate hover:text-cherry flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
