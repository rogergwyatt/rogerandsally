// Splits a cart item's selectedOptions into displayable text options, uploaded
// graphic URLs, and engraving placement notes. Graphic keys are suffixed with
// "_graphic" (Vercel Blob URL); the engraving notes live under "engraving_notes".
// Empty values are dropped so summaries stay clean.
export function splitOptions(selectedOptions?: Record<string, string>) {
  const text: { key: string; value: string }[] = []
  const graphics: string[] = []
  let notes = ''
  for (const [k, v] of Object.entries(selectedOptions ?? {})) {
    if (!v) continue
    if (k.endsWith('_graphic')) graphics.push(v)
    else if (k === 'engraving_notes' || k.endsWith('_notes')) notes = v
    else text.push({ key: k, value: v })
  }
  return { text, graphics, notes }
}
