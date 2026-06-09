'use client'
import { useState, useRef, useEffect } from 'react'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'
import { toast } from 'sonner'

type Msg = { role: 'user' | 'assistant'; content: string }

const MAX_IMAGE_GENS = 3

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Hi! I'm the Roger & Sally design assistant. Tell me about the board you have in mind — who it's for, the occasion, or any look you're after — and we'll shape it together.",
}

export default function CustomOrderPage() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageGens, setImageGens] = useState(0)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, chatLoading])

  const userTurns = messages.filter(m => m.role === 'user').length
  const canPreview = userTurns >= 1 && !chatLoading && !previewLoading

  async function send() {
    const text = input.trim()
    if (!text || chatLoading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/custom-order/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chat failed')
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch (err: any) {
      toast.error(err.message ?? 'Chat failed. Please try again.')
    } finally {
      setChatLoading(false)
    }
  }

  async function generatePreview() {
    if (imageGens >= MAX_IMAGE_GENS) {
      toast.error(`You've reached the ${MAX_IMAGE_GENS}-preview limit for this session.`)
      return
    }
    setPreviewLoading(true)
    try {
      const res = await fetch('/api/custom-order/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Preview failed')
      setSummary(data.summary)
      setImageUrl(data.imageUrl)
      setImageGens(n => n + 1)
      if (data.imageError) toast.message("Summary ready — the image couldn't be generated this time.")
    } catch (err: any) {
      toast.error(err.message ?? 'Preview failed. Please try again.')
    } finally {
      setPreviewLoading(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.name || !contact.email) {
      toast.error('Please add your name and email.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/custom-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          description: '',
          aiSummary: summary,
          aiImageUrl: imageUrl,
          chatTranscript: messages,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submit failed')
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err.message ?? 'Submit failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="bg-parchment min-h-screen flex flex-col">
        <TopSection />
        <div className="max-w-2xl mx-auto w-full px-4 py-20 flex-1 text-center">
          <h1 className={`text-4xl text-walnut mb-4 ${serif.className}`}>We got it!</h1>
          <p className="text-slate text-lg">
            Thanks, {contact.name.split(' ')[0]}. We&apos;ve received your custom request and will be in
            touch within 2 business days with a quote. Check your inbox for a confirmation.
          </p>
          <a href="/shop" className="inline-block mt-8 text-cherry hover:underline">Browse the shop →</a>
        </div>
        <FooterSection />
      </main>
    )
  }

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <div className="max-w-3xl mx-auto w-full px-4 py-10 flex-1">
        <h1 className={`text-4xl lg:text-5xl text-walnut text-center mb-2 ${serif.className}`}>
          Design Your Custom Board
        </h1>
        <p className="text-slate text-center mb-8">
          Chat with our design assistant, generate a preview, and send us your idea.
        </p>

        {/* Chat */}
        <div className="bg-white border border-maple rounded-lg overflow-hidden">
          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-cherry text-white' : 'bg-maple text-walnut'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && <div className="text-xs text-slate">Assistant is typing…</div>}
          </div>
          <div className="border-t border-maple p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
              placeholder="Describe your board…"
              className="flex-1 border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment"
            />
            <button onClick={send} disabled={chatLoading || !input.trim()}
              className="bg-forest text-white px-4 py-2 rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50">
              Send
            </button>
          </div>
        </div>

        {/* Generate preview */}
        <div className="text-center my-6">
          <button onClick={generatePreview} disabled={!canPreview || imageGens >= MAX_IMAGE_GENS}
            className="bg-cherry text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 disabled:opacity-50">
            {previewLoading ? 'Generating…' : summary ? 'Regenerate preview' : 'Generate preview'}
          </button>
          <p className="text-xs text-slate mt-2">
            {imageGens > 0 ? `${MAX_IMAGE_GENS - imageGens} preview${MAX_IMAGE_GENS - imageGens === 1 ? '' : 's'} left` : 'Describe your board first, then generate a preview.'}
          </p>
        </div>

        {/* Preview result */}
        {(summary || imageUrl) && (
          <div className="bg-white border border-maple rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={imageUrl} alt="Generated board preview" className="w-full rounded border border-maple" />
            )}
            {summary && (
              <div>
                <p className="text-xs font-semibold text-walnut mb-1">Your board, as we understood it</p>
                <p className="text-slate text-sm whitespace-pre-line">{summary}</p>
                <p className="text-xs text-slate mt-3 italic">This preview is an AI impression to help us picture your idea — your handcrafted board will be uniquely made.</p>
              </div>
            )}
          </div>
        )}

        {/* Contact + submit */}
        <form onSubmit={submit} className="bg-white border border-maple rounded-lg p-5 space-y-3">
          <h2 className={`text-lg text-walnut ${serif.className}`}>Send us your request</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input required placeholder="Name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
              className="border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
            <input required type="email" placeholder="Email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
              className="border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
            <input placeholder="Phone (optional)" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
              className="border border-maple rounded px-3 py-2 text-sm focus:outline-none focus:border-cherry bg-parchment" />
          </div>
          <button type="submit" disabled={submitting}
            className="bg-cherry text-white px-6 py-2.5 rounded font-semibold hover:bg-opacity-90 disabled:opacity-50">
            {submitting ? 'Sending…' : 'Send My Request'}
          </button>
          <p className="text-xs text-slate">We&apos;ll reply within 2 business days with a quote. No payment is taken now.</p>
        </form>
      </div>
      <FooterSection />
    </main>
  )
}
