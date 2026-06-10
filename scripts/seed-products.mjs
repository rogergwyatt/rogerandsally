// One-off: seed the products table from src/data/products.json.
// Run AFTER creating the products table in Supabase:  node scripts/seed-products.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] })
)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const products = JSON.parse(readFileSync('src/data/products.json', 'utf8'))

let order = 0
for (const p of products) {
  const row = {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? null,
    description: p.description ?? null,
    images: p.images ?? [],
    video_url: p.video ?? null,
    category: p.category ?? null,
    options: p.options ?? [],
    base_price: p.basePrice,
    sale_price: p.salePrice ?? null,
    weight_lbs: p.weightLbs ?? 3,
    length_in: p.dimensionsInches?.length ?? null,
    width_in: p.dimensionsInches?.width ?? null,
    height_in: p.dimensionsInches?.height ?? null,
    featured: !!p.featured,
    in_stock: p.inStock !== false,
    sort_order: order++,
  }
  // Upsert on slug so re-running is safe.
  const { error } = await db.from('products').upsert(row, { onConflict: 'slug' })
  console.log(error ? `ERROR ${p.slug}: ${error.message}` : `seeded ${p.slug}`)
}
console.log('done')
