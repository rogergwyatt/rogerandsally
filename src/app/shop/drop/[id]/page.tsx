import { supabaseAdmin } from '@/lib/supabase'
import { DropItem } from '@/lib/types'
import { dropItemToProduct } from '@/lib/dropProduct'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import ProductDetail from '../../[slug]/ProductDetail'

export const dynamic = 'force-dynamic'

const BASE = 'https://www.rogerandsally.com'

async function getItem(id: string): Promise<DropItem | null> {
  const db = supabaseAdmin()
  const { data } = await db.from('drop_items').select('*').eq('id', id).single()
  return (data as DropItem) ?? null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getItem(params.id)
  if (!item) return {}
  const image = item.image_url ?? `${BASE}/images/IMG_3668.jpeg`
  const title = `${item.name} | Limited Release | Roger & Sally`
  return {
    title,
    description: item.description ?? 'A one-of-a-kind handcrafted board from our latest drop.',
    alternates: { canonical: `${BASE}/shop/drop/${item.id}` },
    openGraph: { title, description: item.description ?? '', images: [{ url: image, alt: item.name }] },
  }
}

export default async function DropItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)
  if (!item) notFound()

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <ProductDetail product={dropItemToProduct(item)} isDrop />
      <FooterSection />
    </main>
  )
}
