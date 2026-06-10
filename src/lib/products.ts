import { supabaseAdmin } from './supabase'
import { Product } from './types'

// Map a products table row (snake_case) to the camelCase Product type.
export function dbRowToProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? '',
    description: r.description ?? '',
    images: Array.isArray(r.images) ? r.images : [],
    video: r.video_url ?? undefined,
    category: r.category ?? '',
    options: Array.isArray(r.options) ? r.options : [],
    basePrice: Number(r.base_price),
    salePrice: r.sale_price != null ? Number(r.sale_price) : undefined,
    weightLbs: r.weight_lbs != null ? Number(r.weight_lbs) : 3,
    dimensionsInches: {
      length: r.length_in != null ? Number(r.length_in) : 0,
      width: r.width_in != null ? Number(r.width_in) : 0,
      height: r.height_in != null ? Number(r.height_in) : 0,
    },
    featured: !!r.featured,
    inStock: !!r.in_stock,
  }
}

// All products, catalog order. Returns [] on any failure.
export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await supabaseAdmin()
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    return (data ?? []).map(dbRowToProduct)
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await supabaseAdmin().from('products').select('*').eq('slug', slug).single()
    return data ? dbRowToProduct(data) : null
  } catch {
    return null
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data } = await supabaseAdmin().from('products').select('*').eq('id', id).single()
    return data ? dbRowToProduct(data) : null
  } catch {
    return null
  }
}
