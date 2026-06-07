import products from '@/data/products.json'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import ProductDetail from './ProductDetail'

const BASE = 'https://www.rogerandsally.com'

export async function generateStaticParams() {
  return (products as Product[]).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = (products as Product[]).find(p => p.slug === params.slug)
  if (!product) return {}
  const url = `${BASE}/shop/${product.slug}`
  const image = product.images?.[0] ? `${BASE}${product.images[0]}` : `${BASE}/images/IMG_3668.jpeg`
  const title = `${product.name} | Roger & Sally`
  const description = `${product.tagline} ${product.description}`.slice(0, 300)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Roger & Sally',
      title,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = (products as Product[]).find(p => p.slug === params.slug)
  if (!product) notFound()

  const url = `${BASE}/shop/${product.slug}`
  const salePrice = product.salePrice ?? product.basePrice

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: (product.images ?? []).map(i => `${BASE}${i}`),
    brand: { '@type': 'Brand', name: 'Roger & Sally' },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: salePrice.toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Roger & Sally' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE}/shop` },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }

  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TopSection />
      <ProductDetail product={product} />
      <FooterSection />
    </main>
  )
}
