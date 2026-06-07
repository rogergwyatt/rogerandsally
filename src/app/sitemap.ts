import { MetadataRoute } from 'next'
import products from '@/data/products.json'

const BASE = 'https://www.rogerandsally.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/custom-order`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/order/lookup`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const productPages: MetadataRoute.Sitemap = (products as { slug: string }[]).map(p => ({
    url: `${BASE}/shop/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
