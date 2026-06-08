'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { serif } from '@/controls/fonts'
import GraphicUpload from '@/controls/GraphicUpload'
import VideoUpload from '@/controls/VideoUpload'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  live: 'bg-green-100 text-green-800',
  ended: 'bg-red-100 text-red-800',
}

function toLocalInput(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

// Map a stored drop item into an editable draft.
function itemToDraft(item: any) {
  return {
    name: item.name ?? '',
    price: item.price ?? '',
    description: item.description ?? '',
    quantity: item.quantity ?? 1,
    allow_engraving: item.allow_engraving ?? true,
    length_in: item.length_in ?? '',
    width_in: item.width_in ?? '',
    thickness_in: item.thickness_in ?? '',
    juice_groove_available: item.juice_groove_available ?? true,
    juice_groove_price: item.juice_groove_price ?? '',
    image_urls: item.image_urls?.length ? item.image_urls : item.image_url ? [item.image_url] : [],
    video_url: item.video_url ?? undefined,
  }
}

// Shared field set used for both adding a new board and editing an existing one.
function ItemFields({
  draft,
  set,
  setMediaBusy,
}: {
  draft: any
  set: (patch: any) => void
  setMediaBusy: (b: boolean) => void
}) {
  const photos: string[] = draft.image_urls ?? []
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input placeholder="Name" value={draft.name ?? ''} onChange={e => set({ name: e.target.value })}
          className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
        <input type="number" min="0" step="0.01" placeholder="Price" value={draft.price ?? ''} onChange={e => set({ price: e.target.value })}
          className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
      </div>
      <input placeholder="Description (optional)" value={draft.description ?? ''} onChange={e => set({ description: e.target.value })}
        className="w-full border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
      <div className="grid grid-cols-2 gap-2 items-center">
        <input type="number" min="1" placeholder="Quantity (1 = one-of-a-kind)" value={draft.quantity ?? ''} onChange={e => set({ quantity: e.target.value })}
          className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
        <label className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" checked={draft.allow_engraving ?? true} onChange={e => set({ allow_engraving: e.target.checked })} className="accent-cherry" />
          Allow engraving
        </label>
      </div>

      {/* Dimensions (inches) */}
      <div>
        <p className="text-xs font-semibold text-walnut mb-1">Dimensions (inches)</p>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" min="0" step="0.25" placeholder="Length" value={draft.length_in ?? ''} onChange={e => set({ length_in: e.target.value })}
            className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          <input type="number" min="0" step="0.25" placeholder="Width" value={draft.width_in ?? ''} onChange={e => set({ width_in: e.target.value })}
            className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
          <input type="number" min="0" step="0.125" placeholder="Thickness" value={draft.thickness_in ?? ''} onChange={e => set({ thickness_in: e.target.value })}
            className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
        </div>
      </div>

      {/* Juice groove */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" checked={draft.juice_groove_available ?? true} onChange={e => set({ juice_groove_available: e.target.checked })} className="accent-cherry" />
          Offer juice groove
        </label>
        {(draft.juice_groove_available ?? true) && (
          <div className="flex items-center gap-1 text-sm text-slate">
            <span>Upcharge $</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={draft.juice_groove_price ?? ''} onChange={e => set({ juice_groove_price: e.target.value })}
              className="w-24 border border-maple rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-cherry" />
            <span className="text-xs text-slate">(0 = free)</span>
          </div>
        )}
      </div>

      {/* Photos (multiple) */}
      <div>
        <p className="text-xs font-semibold text-walnut mb-1">Board photos</p>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {photos.map((url, i) => (
              <div key={i} className="relative h-16 w-16 rounded overflow-hidden border border-maple">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button onClick={() => set({ image_urls: photos.filter((_, idx) => idx !== i) })}
                  className="absolute top-0 right-0 bg-walnut/80 text-white text-xs w-5 h-5 leading-5 text-center">×</button>
                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-cherry text-white text-[9px] text-center">cover</span>}
              </div>
            ))}
          </div>
        )}
        <GraphicUpload label="Add a photo" value={undefined}
          onUploadingChange={setMediaBusy}
          onChange={url => { if (url) set({ image_urls: [...photos, url] }) }} />
      </div>

      {/* Video */}
      <VideoUpload label="Board video (optional)" value={draft.video_url}
        onUploadingChange={setMediaBusy}
        onChange={url => set({ video_url: url })} />
    </div>
  )
}

export default function DropsAdminPage() {
  const router = useRouter()
  const [drops, setDrops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [itemDraft, setItemDraft] = useState<Record<string, any>>({})
  const [mediaBusy, setMediaBusy] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Record<string, any>>({})

  function load() {
    fetch('/api/admin/drops')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null } return r.json() })
      .then(d => { if (d) { setDrops(d.drops ?? []); setLoading(false) } })
  }
  useEffect(() => { load() }, [])

  async function createDrop(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const res = await fetch('/api/admin/drops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'drop', title: newTitle, description: newDesc }) })
    const d = await res.json()
    if (res.ok) { setDrops(p => [d.drop, ...p]); setNewTitle(''); setNewDesc('') }
  }

  async function updateDrop(id: string, patch: any) {
    await fetch('/api/admin/drops', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'drop', id, ...patch }) })
    setDrops(p => p.map(d => d.id === id ? { ...d, ...patch } : d))
  }

  async function deleteDrop(id: string) {
    if (!confirm('Delete this drop and all its items?')) return
    await fetch('/api/admin/drops', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'drop', id }) })
    setDrops(p => p.filter(d => d.id !== id))
  }

  async function addItem(dropId: string) {
    const d = itemDraft[dropId] ?? {}
    if (!d.name || !d.price) { alert('Item needs a name and price.'); return }
    const res = await fetch('/api/admin/drops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'item', drop_id: dropId, ...d, allow_engraving: d.allow_engraving ?? true, quantity: d.quantity || 1 }) })
    const r = await res.json()
    if (res.ok) {
      setDrops(p => p.map(dr => dr.id === dropId ? { ...dr, items: [...(dr.items ?? []), r.item] } : dr))
      setItemDraft(s => ({ ...s, [dropId]: {} }))
    } else alert(r.error)
  }

  function startEdit(item: any) {
    setEditing(item.id)
    setEditDraft(s => ({ ...s, [item.id]: itemToDraft(item) }))
  }

  async function saveItem(dropId: string, itemId: string) {
    const d = editDraft[itemId] ?? {}
    if (!d.name || d.price === '' || d.price == null) { alert('Item needs a name and price.'); return }
    const res = await fetch('/api/admin/drops', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'item', id: itemId, ...d, quantity: d.quantity || 1 }),
    })
    const r = await res.json()
    if (!res.ok) { alert(r.error); return }
    // Reflect the saved values locally (image_url cover = first photo).
    const cover = (d.image_urls ?? [])[0] ?? null
    setDrops(p => p.map(dr => dr.id === dropId ? {
      ...dr,
      items: dr.items.map((it: any) => it.id === itemId ? { ...it, ...d, image_url: cover } : it),
    } : dr))
    setEditing(null)
  }

  async function deleteItem(dropId: string, itemId: string) {
    await fetch('/api/admin/drops', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'item', id: itemId }) })
    setDrops(p => p.map(dr => dr.id === dropId ? { ...dr, items: dr.items.filter((i: any) => i.id !== itemId) } : dr))
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-slate">Loading…</div>

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl text-walnut ${serif.className}`}>Drops</h1>
        <a href="/shop" target="_blank" className="text-sm text-forest hover:underline">View shop →</a>
      </div>

      {/* Create drop */}
      <form onSubmit={createDrop} className="bg-white border border-maple rounded-lg p-5 mb-8 space-y-3">
        <h2 className={`text-lg text-walnut ${serif.className}`}>New Drop</h2>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Drop title (e.g. June Spalted Maple Release)"
          className="w-full border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
        <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description (optional)"
          className="w-full border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
        <button type="submit" className="bg-cherry text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90">Create Drop</button>
      </form>

      {drops.length === 0 && <p className="text-slate text-center py-8">No drops yet.</p>}

      <div className="space-y-6">
        {drops.map(drop => (
          <div key={drop.id} className="bg-white border border-maple rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-xl text-walnut ${serif.className}`}>{drop.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[drop.status]}`}>{drop.status}</span>
                </div>
                {drop.description && <p className="text-sm text-slate">{drop.description}</p>}
              </div>
              <button onClick={() => deleteDrop(drop.id)} className="text-xs text-slate hover:text-cherry">Delete drop</button>
            </div>

            {/* Status + schedule */}
            <div className="flex flex-wrap gap-4 items-end mb-4 pb-4 border-b border-maple">
              <div>
                <label className="block text-xs font-semibold text-walnut mb-1">Status</label>
                <select value={drop.status} onChange={e => updateDrop(drop.id, { status: e.target.value })}
                  className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry capitalize">
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-walnut mb-1">Release at (blank = now)</label>
                <input type="datetime-local" defaultValue={toLocalInput(drop.release_at)}
                  onChange={e => updateDrop(drop.id, { release_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="border border-maple rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-cherry" />
              </div>
              <span className="text-xs text-slate">Live + release in the future = scheduled (hidden until then).</span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {(drop.items ?? []).map((item: any) => (
                editing === item.id ? (
                  <div key={item.id} className="border border-cherry rounded-lg p-4 bg-parchment space-y-2">
                    <p className="text-xs font-semibold text-walnut">Editing board</p>
                    <ItemFields
                      draft={editDraft[item.id] ?? {}}
                      set={patch => setEditDraft(s => ({ ...s, [item.id]: { ...s[item.id], ...patch } }))}
                      setMediaBusy={setMediaBusy}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveItem(drop.id, item.id)} disabled={mediaBusy}
                        className="bg-forest text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
                        {mediaBusy ? 'Uploading…' : 'Save Changes'}
                      </button>
                      <button onClick={() => setEditing(null)} className="px-4 py-1.5 rounded text-sm text-slate hover:text-cherry">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="flex items-center gap-3 text-sm border border-maple rounded px-3 py-2">
                    {item.image_url && <img src={item.image_url} alt="" className="h-12 w-12 object-cover rounded flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-walnut">{item.name} — ${Number(item.price).toFixed(2)}</div>
                      <div className="text-xs text-slate">{item.sold}/{item.quantity} sold{item.allow_engraving ? ' · engraving on' : ''}</div>
                    </div>
                    <button onClick={() => startEdit(item)} className="text-xs text-forest hover:underline flex-shrink-0">Edit</button>
                    <button onClick={() => deleteItem(drop.id, item.id)} className="text-xs text-slate hover:text-cherry flex-shrink-0">Remove</button>
                  </div>
                )
              ))}
            </div>

            {/* Add item */}
            <div className="bg-parchment border border-maple rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-walnut">Add a board to this drop</p>
              <ItemFields
                draft={itemDraft[drop.id] ?? {}}
                set={patch => setItemDraft(s => ({ ...s, [drop.id]: { ...s[drop.id], ...patch } }))}
                setMediaBusy={setMediaBusy}
              />
              <button onClick={() => addItem(drop.id)} disabled={mediaBusy}
                className="bg-forest text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
                {mediaBusy ? 'Uploading…' : 'Add Board'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
