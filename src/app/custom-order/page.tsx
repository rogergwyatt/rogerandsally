'use client'
import { useState } from 'react'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'
import { toast } from 'sonner'
import GraphicUpload from '@/controls/GraphicUpload'

const WOOD_OPTIONS = ['Walnut', 'Cherry', 'Maple', 'Mixed / Surprise me', 'Not sure yet']
const BUDGET_OPTIONS = ['Under $100', '$100–$200', '$200–$400', '$400+', 'Not sure — give me a quote']
const TIMELINE_OPTIONS = ['ASAP', '2–4 weeks', '1–2 months', 'No rush', "For a specific date (I'll explain below)"]

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    description: '',
    woodPreference: '',
    dimensions: '',
    budget: '',
    timeline: '',
    engravingText: '',
    engravingNotes: '',
  })
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/custom-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, referenceImages }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      toast.error('Something went wrong. Please try again or email us directly.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <main className="bg-parchment min-h-screen flex flex-col">
        <TopSection />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="text-5xl mb-6">🪵</div>
          <h1 className={`text-4xl text-walnut mb-4 ${serif.className}`}>Request Received</h1>
          <p className="text-slate text-lg max-w-md">
            Thank you! We'll review your request and send you a quote within 2 business days.
            Check your inbox for a confirmation.
          </p>
          <a href="/shop" className="mt-8 text-forest hover:underline text-sm">Browse standard products →</a>
        </div>
        <FooterSection />
      </main>
    )
  }

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <div className="max-w-2xl mx-auto w-full px-4 py-12 flex-1">
        <h1 className={`text-4xl lg:text-5xl text-walnut mb-3 ${serif.className}`}>Custom Order</h1>
        <p className="text-slate mb-8 text-lg">
          Every piece we make is built to order — but sometimes you have something specific in mind.
          Tell us what you're dreaming of and we'll make it happen.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact */}
          <div className="bg-white border border-maple rounded-lg p-6 space-y-4">
            <h2 className={`text-xl text-walnut ${serif.className}`}>About You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-walnut mb-1">Name *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)}
                  className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-walnut mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-walnut mb-1">Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>
          </div>

          {/* The piece */}
          <div className="bg-white border border-maple rounded-lg p-6 space-y-5">
            <h2 className={`text-xl text-walnut ${serif.className}`}>Tell Us About the Piece</h2>

            <div>
              <label className="block text-sm font-semibold text-walnut mb-2">Describe what you want *</label>
              <textarea required rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="E.g. A large end-grain cutting board with a walnut border, maple center, and our family name engraved. We'd like handles and a juice groove. It's a wedding gift…"
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-walnut mb-2">Wood preference</label>
              <div className="flex flex-wrap gap-2">
                {WOOD_OPTIONS.map(w => (
                  <button type="button" key={w} onClick={() => set('woodPreference', w)}
                    className={`px-3 py-1.5 rounded border text-sm transition-colors ${form.woodPreference === w ? 'bg-cherry text-white border-cherry' : 'bg-parchment text-slate border-maple hover:border-cherry'}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-walnut mb-1">Approximate dimensions</label>
              <input value={form.dimensions} onChange={e => set('dimensions', e.target.value)}
                placeholder='e.g. "12" × 18"" or "about the size of a laptop"'
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-walnut mb-1">Engraving text (optional)</label>
              <input value={form.engravingText} onChange={e => set('engravingText', e.target.value)}
                placeholder="Text you'd like engraved"
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-walnut mb-1">Engraving placement notes (optional)</label>
              <textarea rows={2} value={form.engravingNotes} onChange={e => set('engravingNotes', e.target.value)}
                placeholder="Where should it go? e.g. center of the board, bottom-right corner, on the handle…"
                className="w-full border border-maple rounded px-3 py-2 focus:outline-none focus:border-cherry bg-parchment resize-none" />
            </div>

            <div className="space-y-2">
              <GraphicUpload
                label="Reference image or graphic to engrave (optional)"
                value={referenceImages[0]}
                onChange={url => setReferenceImages(url ? [url] : [])}
                onUploadingChange={setUploading}
              />
            </div>
          </div>

          {/* Budget & timeline */}
          <div className="bg-white border border-maple rounded-lg p-6 space-y-5">
            <h2 className={`text-xl text-walnut ${serif.className}`}>Budget & Timeline</h2>
            <div>
              <label className="block text-sm font-semibold text-walnut mb-2">Budget range</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map(b => (
                  <button type="button" key={b} onClick={() => set('budget', b)}
                    className={`px-3 py-1.5 rounded border text-sm transition-colors ${form.budget === b ? 'bg-cherry text-white border-cherry' : 'bg-parchment text-slate border-maple hover:border-cherry'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-walnut mb-2">When do you need it?</label>
              <div className="flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map(t => (
                  <button type="button" key={t} onClick={() => set('timeline', t)}
                    className={`px-3 py-1.5 rounded border text-sm transition-colors ${form.timeline === t ? 'bg-cherry text-white border-cherry' : 'bg-parchment text-slate border-maple hover:border-cherry'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || uploading}
            className="w-full bg-cherry text-white py-3 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 text-lg">
            {uploading ? 'Waiting for upload…' : loading ? 'Sending…' : 'Send My Request'}
          </button>
          <p className="text-xs text-slate text-center">We'll respond within 2 business days with a quote. No payment required now.</p>
        </form>
      </div>
      <FooterSection />
    </main>
  )
}
