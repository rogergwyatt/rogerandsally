import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import {
  buildPreviewSpec,
  generateImageBase64,
  MAX_PAYLOAD_MESSAGES,
  type ChatMessage,
} from '@/lib/customOrderAI'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] }
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages' }, { status: 400 })
    }
    if (messages.length > MAX_PAYLOAD_MESSAGES) {
      return NextResponse.json({ error: 'Conversation too long' }, { status: 400 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Preview is not configured.' }, { status: 503 })
    }

    const spec = await buildPreviewSpec(messages)

    // Image is best-effort: never block the summary on a render failure.
    let imageUrl: string | null = null
    let imageError = false
    try {
      const b64 = await generateImageBase64(spec.imagePrompt)
      const bytes = Buffer.from(b64, 'base64')
      const blob = await put(`custom-order-preview-${Date.now()}.png`, bytes, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/png',
      })
      imageUrl = blob.url
    } catch (imgErr: any) {
      console.error('preview image error:', imgErr.message)
      imageError = true
    }

    return NextResponse.json({ summary: spec.summary, imageUrl, imageError })
  } catch (err: any) {
    console.error('custom-order preview error:', err.message)
    return NextResponse.json({ error: 'Preview failed. Please try again.' }, { status: 500 })
  }
}
