import products from '@/data/products.json'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import ProductDetail from './ProductDetail'

export async function generateStaticParams() {
  return (products as Product[]).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = (products as Product[]).find(p => p.slug === params.slug)
  if (!product) return {}
  return { title: `${product.name} | Roger & Sally`, description: product.tagline }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = (products as Product[]).find(p => p.slug === params.slug)
  if (!product) notFound()
  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <ProductDetail product={product} />
      <FooterSection />
    </main>
  )
}
