import { getProducts } from '@/lib/products'
import Link from 'next/link'
import Image from 'next/image'
import TopSection from '@/controls/topSection'
import FooterSection from '@/controls/footerSection'
import { serif } from '@/controls/fonts'
import DropsSection from '@/controls/DropsSection'

export const metadata = {
  title: 'Shop | Roger & Sally',
  description: 'Hand-crafted Heritage Lock cutting boards, charcuterie boards, and coasters.',
}

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await getProducts()
  return (
    <main className="bg-parchment min-h-screen flex flex-col">
      <TopSection />
      <div className="max-w-6xl mx-auto w-full px-4 py-12 flex-1">
        <h1 className={`text-4xl lg:text-5xl text-walnut text-center mb-4 ${serif.className}`}>
          Our Shop
        </h1>
        <p className="text-slate text-center mb-6 text-lg max-w-2xl mx-auto">
          Every piece is hand-crafted in Virginia using our signature Heritage Lock joinery.
          Built to last a lifetime — or longer.
        </p>
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="bg-forest text-white text-sm px-5 py-2 rounded-full font-medium">
            🕐 Currently booking {process.env.NEXT_PUBLIC_LEAD_TIME ?? '3–4 weeks'} out
          </div>
          <a href="/custom-order" className="text-sm text-cherry hover:underline font-medium">
            Need something custom? →
          </a>
        </div>
        <DropsSection />

        <h2 className={`text-2xl lg:text-3xl text-walnut text-center mb-6 ${serif.className}`}>Made-To-Order Boards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-maple"
            >
              <div className="relative h-64 bg-maple">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate text-sm">No image yet</div>
                )}
              </div>
              <div className="p-5">
                {product.salePrice && (
                  <span className="inline-block bg-cherry text-white text-xs font-bold px-2 py-0.5 rounded mb-2">SALE</span>
                )}
                <h2 className={`text-xl text-walnut mb-1 ${serif.className}`}>{product.name}</h2>
                <p className="text-slate text-sm mb-3">{product.tagline}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-2">
                    <span className="text-cherry font-semibold text-lg">
                      From ${product.salePrice ?? product.basePrice}
                    </span>
                    {product.salePrice && (
                      <span className="text-slate line-through text-sm">${product.basePrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-forest font-medium group-hover:underline">
                    View Options →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
