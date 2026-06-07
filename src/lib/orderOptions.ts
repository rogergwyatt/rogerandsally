// Splits a cart item's selectedOptions into displayable text options and
// uploaded graphic URLs. Graphic keys are suffixed with "_graphic" and hold a
// Vercel Blob URL; empty values are dropped so summaries stay clean.
export function splitOptions(selectedOptions?: Record<string, string>) {
  const text: { key: string; value: string }[] = []
  const graphics: string[] = []
  for (const [k, v] of Object.entries(selectedOptions ?? {})) {
    if (!v) continue
    if (k.endsWith('_graphic')) graphics.push(v)
    else text.push({ key: k, value: v })
  }
  return { text, graphics }
}
