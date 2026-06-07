import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']
const MAX_BYTES = 25 * 1024 * 1024 // 25 MB

// Client-direct upload token endpoint. The browser uploads straight to Vercel
// Blob (bypassing the 4.5 MB serverless body limit); this route only issues a
// scoped token and validates the file type/size.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({}),
      }),
      // Required by the SDK; nothing to persist here — the client gets the URL
      // back and attaches it to the cart item / custom-order request.
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
