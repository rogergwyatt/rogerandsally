import Anthropic from '@anthropic-ai/sdk'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'

// Guards against abusive payloads on public endpoints.
export const MAX_MESSAGES = 30
export const MAX_CONTENT_CHARS = 4000

function anthropic(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const CONCIERGE_SYSTEM = `You are the design assistant for Roger & Sally, a Virginia maker of handcrafted Heritage Lock hardwood cutting and charcuterie boards. Brand voice: warm, understated, expert; the wood is the star, not flashy glue-up patterns.

Your job: help the customer describe the board they want for a custom order. Ask about, ONE topic at a time, in a natural order: intended use/occasion, wood species (we work in Walnut, Cherry, Maple), approximate size, thickness, juice groove, engraving (text or graphic), budget, and timeline. Keep every reply short (1-3 sentences). Do not invent prices or commit to anything. When you have enough to picture the board, gently suggest they click "Generate preview".`

// Sanitize and clamp an incoming message list.
export function clampMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_CHARS) }))
}

// A single conversational reply from the concierge.
export async function chatReply(messages: ChatMessage[]): Promise<string> {
  const res = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 400,
    system: CONCIERGE_SYSTEM,
    messages: clampMessages(messages),
  })
  const text = res.content.find(b => b.type === 'text')
  return text && 'text' in text ? text.text : ''
}

export type PreviewSpec = { summary: string; imagePrompt: string }

// Ask Claude to summarize the conversation and craft an image prompt.
// Robust to non-JSON: falls back to using the raw text as the summary.
export async function buildPreviewSpec(messages: ChatMessage[]): Promise<PreviewSpec> {
  const res = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: `Summarize the customer's desired cutting/charcuterie board from the conversation. Respond ONLY with minified JSON of the form {"summary": string, "imagePrompt": string}. "summary" is a tidy 2-4 sentence description of the board (wood, size, thickness, juice groove, engraving, intended use). "imagePrompt" describes a single photorealistic product photo of THAT board resting on a neutral light kitchen counter, soft daylight, no text overlay, no people — include wood species, shape, dimensions, and any engraving.`,
    messages: clampMessages(messages),
  })
  const block = res.content.find(b => b.type === 'text')
  const raw = block && 'text' in block ? block.text.trim() : ''
  try {
    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}')
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
    if (parsed.summary && parsed.imagePrompt) {
      return { summary: String(parsed.summary), imagePrompt: String(parsed.imagePrompt) }
    }
  } catch {
    // fall through
  }
  return {
    summary: raw || 'Custom board (see conversation).',
    imagePrompt: `A photorealistic handcrafted hardwood cutting board on a neutral light kitchen counter, soft daylight, no text. ${raw.slice(0, 500)}`,
  }
}

// Render an image via the Gemini Imagen REST API; returns a base64 PNG (no data: prefix).
// Throws on failure so the caller can degrade gracefully.
export async function generateImageBase64(imagePrompt: string): Promise<string> {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY ?? '',
    },
    body: JSON.stringify({
      instances: [{ prompt: imagePrompt }],
      parameters: { sampleCount: 1, aspectRatio: '4:3' },
    }),
  })
  if (!res.ok) {
    throw new Error(`Imagen error ${res.status}: ${await res.text()}`)
  }
  const data = await res.json()
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('Imagen returned no image')
  return b64
}
