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

// Render a conversation as plain text for use as embedded data (not as an
// active chat the model would try to continue).
function transcriptOf(messages: ChatMessage[]): string {
  return clampMessages(messages)
    .map(m => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
    .join('\n')
}

// Run an extraction prompt that returns JSON. The conversation is embedded as
// reference data in a single user turn, and the assistant reply is prefilled
// with "{" so the model is forced to emit JSON instead of continuing the chat.
// Returns the parsed object, or null on failure.
async function jsonExtract(system: string, messages: ChatMessage[], maxTokens: number): Promise<any | null> {
  const res = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [
      { role: 'user', content: `Here is the conversation to analyze:\n\n${transcriptOf(messages)}` },
      { role: 'assistant', content: '{' },
    ],
  })
  const block = res.content.find(b => b.type === 'text')
  const text = block && 'text' in block ? block.text : ''
  const raw = '{' + text
  try {
    return JSON.parse(raw.slice(0, raw.lastIndexOf('}') + 1))
  } catch {
    return null
  }
}

// Summarize the conversation and craft an image prompt + detect the wood.
export async function buildPreviewSpec(messages: ChatMessage[]): Promise<PreviewSpec> {
  const parsed = await jsonExtract(
    `You are analyzing a custom cutting/charcuterie board conversation. Output ONLY minified JSON: {"summary": string, "imagePrompt": string, "wood": string}.
- "summary": a tidy 2-4 sentence description of the board (wood, size, thickness, juice groove, engraving, intended use).
- "wood": the primary wood species the customer chose, exactly one of "walnut", "cherry", "maple", or "other".
- "imagePrompt": a concise factual description of ONLY the board to depict — wood species, overall shape and approximate dimensions, thickness, whether it has a juice groove, and any engraving text and its placement. Do NOT describe backgrounds, lighting, or camera; do NOT mention mosaic, checkerboard, chevron, or end-grain patterns (our boards are simple single-species edge-grain).`,
    messages,
    600,
  )
  if (parsed && parsed.summary && parsed.imagePrompt) {
    return {
      summary: String(parsed.summary),
      imagePrompt: String(parsed.imagePrompt),
      wood: normalizeWood(parsed.wood),
    }
  }
  return {
    summary: 'Custom board — see the conversation for details.',
    imagePrompt: 'a handcrafted single-species edge-grain hardwood cutting board',
    wood: 'other',
  }
}

// Structured specifications pulled from the conversation for the order record.
export type BoardSpecs = {
  wood: string | null
  dimensions: string | null
  thickness: string | null
  juiceGroove: string | null
  engraving: string | null
  budget: string | null
}

const EMPTY_SPECS: BoardSpecs = {
  wood: null, dimensions: null, thickness: null, juiceGroove: null, engraving: null, budget: null,
}

// Extract the customer's board specifications from the conversation. Returns
// nulls for anything not mentioned; never throws (returns empty specs on error).
export async function extractSpecs(messages: ChatMessage[]): Promise<BoardSpecs> {
  try {
    const parsed = await jsonExtract(
      `Extract the customer's cutting/charcuterie board specifications from the conversation. Output ONLY minified JSON: {"wood": string|null, "dimensions": string|null, "thickness": string|null, "juiceGroove": string|null, "engraving": string|null, "budget": string|null}. Use null for anything not clearly stated. Formatting: "dimensions" like "16 x 11 in"; "thickness" like "1.5 in"; "juiceGroove" exactly "Yes" or "No"; "engraving" the requested text and placement (or null); "budget" the stated amount or range (or null). Do not guess.`,
      messages,
      400,
    )
    if (!parsed) return { ...EMPTY_SPECS }
    const clean = (v: unknown) => {
      const s = v == null ? null : String(v).trim()
      return s && s.toLowerCase() !== 'null' ? s : null
    }
    return {
      wood: clean(parsed.wood),
      dimensions: clean(parsed.dimensions),
      thickness: clean(parsed.thickness),
      juiceGroove: clean(parsed.juiceGroove),
      engraving: clean(parsed.engraving),
      budget: clean(parsed.budget),
    }
  } catch {
    return { ...EMPTY_SPECS }
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

const WOOD_NAMES: Record<WoodKey, string> = {
  walnut: 'walnut (dark chocolate-brown)',
  cherry: 'cherry (warm reddish-brown)',
  maple: 'maple (pale creamy blond)',
  other: '',
}

// Wrap the board description in fixed constraints so every generation matches
// our aesthetic. Wood species is the #1 directive (the model otherwise drifts
// to a default walnut look), then size/thickness, then craftsmanship details.
export function boardPrompt(wood: WoodKey, imagePrompt: string): string {
  const speciesDirective =
    wood === 'other'
      ? 'Use exactly the wood species named in the board description below — render that species\' true color and grain. Do NOT substitute a different wood.'
      : `The board MUST be made of ${WOOD_NAMES[wood]}. Render authentic ${wood} color and grain. This is the single most important attribute — do NOT default to walnut or any other species. The attached reference photo is also ${wood}; match its wood tone.`

  return `Use the attached photo of one of our actual handcrafted Roger & Sally boards as the reference for craftsmanship, finish, and proportions. Generate ONE photorealistic product photo of the board described below.

TOP PRIORITY — WOOD SPECIES: ${speciesDirective}

SECOND PRIORITY — SIZE & THICKNESS: Honor the stated dimensions, and especially the thickness — render a substantial, chunky board shot from a low 3/4 angle so the full thick edge/side profile is clearly visible (a thick slab, not a thin panel).

Other requirements:
- A single-species EDGE-GRAIN board (never end-grain; no mosaic, checkerboard, chevron, herringbone, or parquet patterns).
- A simple clean rectangle with gently rounded corners.
- Our signature contrasting hardwood dowel pegs visible along the edge (the "Heritage Lock").
- If a juice groove is specified, it MUST be clearly visible as a recessed channel routed in a rectangle around the top perimeter.
- Include small brass feet only if described.
- Rest it on a neutral, uncluttered surface in soft natural daylight; no text overlays, no watermarks, no people or hands.

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
