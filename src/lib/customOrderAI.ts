import Anthropic from '@anthropic-ai/sdk'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'

// Guards against abusive payloads on public endpoints.
// MAX_MESSAGES: how many recent turns we send to the model (context/cost cap).
// MAX_PAYLOAD_MESSAGES: hard reject threshold for an incoming request (abuse cap),
// set well above a normal conversation so long legitimate chats still work.
export const MAX_MESSAGES = 30
export const MAX_PAYLOAD_MESSAGES = 100
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

export type WoodKey = 'walnut' | 'cherry' | 'maple' | 'other'
export type PreviewSpec = { summary: string; imagePrompt: string; wood: WoodKey }

// Ask Claude to summarize the conversation and craft an image prompt.
// Robust to non-JSON: falls back to using the raw text as the summary.
export async function buildPreviewSpec(messages: ChatMessage[]): Promise<PreviewSpec> {
  const res = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system: `Summarize the customer's desired cutting/charcuterie board from the conversation. Respond ONLY with minified JSON of the form {"summary": string, "imagePrompt": string, "wood": string}.
- "summary": a tidy 2-4 sentence description of the board (wood, size, thickness, juice groove, engraving, intended use).
- "wood": the primary wood species, exactly one of "walnut", "cherry", "maple", or "other".
- "imagePrompt": a concise factual description of ONLY the board to depict — wood species, overall shape and approximate dimensions, thickness, whether it has a juice groove, and any engraving text and its placement. Do NOT describe backgrounds, lighting, or camera; do NOT mention mosaic, checkerboard, chevron, or end-grain patterns (our boards are simple single-species edge-grain).`,
    messages: clampMessages(messages),
  })
  const block = res.content.find(b => b.type === 'text')
  const raw = block && 'text' in block ? block.text.trim() : ''
  try {
    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}')
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
    if (parsed.summary && parsed.imagePrompt) {
      return {
        summary: String(parsed.summary),
        imagePrompt: String(parsed.imagePrompt),
        wood: normalizeWood(parsed.wood),
      }
    }
  } catch {
    // fall through
  }
  return {
    summary: raw || 'Custom board (see conversation).',
    imagePrompt: raw.slice(0, 500) || 'a handcrafted hardwood cutting board',
    wood: 'other',
  }
}

function normalizeWood(w: unknown): WoodKey {
  const s = String(w ?? '').toLowerCase()
  if (s.includes('walnut')) return 'walnut'
  if (s.includes('cherry')) return 'cherry'
  if (s.includes('maple')) return 'maple'
  return 'other'
}

// Gemini image model that accepts a reference photo as input (multimodal).
const GEMINI_IMAGE_MODEL = 'gemini-3-pro-image'

// A real Roger & Sally board photo per wood species, used as the style /
// craftsmanship reference so generated previews resemble our actual work
// (correct wood, single-species edge grain, Heritage Lock dowels, brass feet).
// Paths are public assets served by the deployment.
const WOOD_REFERENCES: Record<WoodKey, string> = {
  walnut: '/images/products/Walnut Charcuterie Board/IMG_3827.jpeg',
  cherry: '/images/CherryWithGrooveNoText.jpg',
  maple: '/images/products/MapleSignatureBoard/IMG_3807.jpeg',
  // No distinct "other" reference — fall back to walnut for authentic style.
  other: '/images/products/Walnut Charcuterie Board/IMG_3827.jpeg',
}

export function referenceForWood(wood: WoodKey): string {
  return WOOD_REFERENCES[wood] ?? WOOD_REFERENCES.other
}

// Wrap the board description in fixed craftsmanship constraints so every
// generation matches our aesthetic regardless of how the customer phrased it.
export function boardPrompt(imagePrompt: string): string {
  return `Using the attached photo of one of our actual handcrafted Roger & Sally boards as the exact reference for wood species, color, grain, finish, and craftsmanship, generate ONE photorealistic product photo of the board described below.

Requirements: a single-species EDGE-GRAIN board (never end-grain; no mosaic, checkerboard, chevron, herringbone, or parquet patterns); a simple clean rectangle with gently rounded corners; our signature contrasting hardwood dowel pegs visible along the edge (the "Heritage Lock"); include a juice groove and/or small brass feet only if described; rest it on a neutral, uncluttered light surface in soft natural daylight; no text overlays, no watermarks, no people or hands. Match the realism, proportions, and finish of the reference photo.

Board to depict: ${imagePrompt}`
}

// Generate a board image with Gemini, optionally conditioned on a reference
// photo (inline base64). Returns a base64 image (no data: prefix). Throws on
// failure so the caller can degrade gracefully.
export async function generateBoardImage(
  prompt: string,
  reference?: { data: string; mimeType: string },
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set — image generation is unconfigured')
  }
  const parts: Record<string, unknown>[] = [{ text: prompt }]
  if (reference) {
    parts.push({ inline_data: { mime_type: reference.mimeType, data: reference.data } })
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY ?? '',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    },
  )
  if (!res.ok) {
    throw new Error(`Gemini image error ${res.status}: ${await res.text()}`)
  }
  const data = await res.json()
  const outParts: any[] = data?.candidates?.[0]?.content?.parts ?? []
  const imgPart = outParts.find(p => p?.inlineData?.data || p?.inline_data?.data)
  const b64 = imgPart?.inlineData?.data ?? imgPart?.inline_data?.data
  if (!b64) throw new Error('Gemini returned no image')
  return b64
}
