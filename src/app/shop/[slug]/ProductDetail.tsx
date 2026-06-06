'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product, ProductOption } from '@/lib/types'
import { useCart } from '@/context/CartContext'
import { serif } from '@/controls/fonts'
import { toast } from 'sonner'

function computePrice(product: Product, selected: Record<string, string>): number {
  let price = product.basePrice
  for (const opt of product.options) {
    if (opt.type === 'text') {
      if (selected[opt.key] && selected[opt.key].trim()) price += opt.priceModifier ?? 0
    } else {
      const choice = opt.choices?.find(c => c.label === selected[opt.key])
      if (choice) price += choice.priceModifier
    }
  }
  return price
}

function defaultSelections(product: Product): Record<string, string> {
  const sel: Record<string, string> = {}
  for (const opt of product.options) {
    if (opt.type === 'text') sel[opt.key] = ''
    else if (opt.choices?.length) sel[opt.key] = opt.choices[0].label
  }
  return sel
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [selected, setSelected] = useState<Record<string, string>>(defaultSelections(product))
  const [activeImage, setActiveImage] = useState(0)

  const price = computePrice(product, selected)

  function handleOption(key: string, value: string) {
    setSelected(prev => ({ ...prev, [key]: value }))
  }

  function handleAddToCart() {
    addItem(product, { ...selected }, price)
    toast.success(`${product.name} added to cart!`, {
      action: { label: 'View Cart', onClick: () => router.push('/cart') }
    })
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative h-96 bg-maple rounded-lg overflow-hidden mb-3">
            {product.images[activeImage] ? (
              <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate">No image yet</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 rounded overflow-hidden border-2 ${i === activeImage ? 'border-cherry' : 'border-maple'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Options */}
        <div>
          <h1 className={`text-3xl lg:text-4xl text-walnut mb-2 ${serif.className}`}>{product.name}</h1>
          <p className="text-slate mb-4">{product.description}</p>

          {product.options.map((opt: ProductOption) => (
            <div key={opt.key} className="mb-5">
              <label className="block text-walnut font-semibold mb-2">{opt.name}</label>
              {opt.type === 'text' ? (
                <input
                  type="text"
                  placeholder={opt.placeholder}
                  value={selected[opt.key] ?? ''}
                  onChange={e => handleOption(opt.key, e.target.value)}
                  className="w-full border border-maple rounded px-3 py-2 text-slate focus:outline-none focus:border-cherry bg-white"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {opt.choices?.map(choice => (
                    <button
                      type="button"
                      key={choice.label}
                      onClick={() => handleOption(opt.key, choice.label)}
                      className={`px-4 py-2 rounded border text-sm transition-colors ${
                        selected[opt.key] === choice.label
                          ? 'bg-cherry text-white border-cherry'
                          : 'bg-white text-slate border-maple hover:border-cherry'
                      }`}
                    >
                      {choice.label}
                      {choice.priceModifier > 0 && ` (+$${choice.priceModifier})`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-8 flex items-center gap-6">
            <span className={`text-3xl text-cherry font-bold ${serif.className}`}>${price}</span>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-cherry text-white py-3 px-6 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="mt-6 bg-maple rounded-lg px-4 py-3 text-sm text-walnut flex items-center gap-2">
            <span>🕐</span>
            <span>Made to order — currently booking <strong>{process.env.NEXT_PUBLIC_LEAD_TIME ?? '3–4 weeks'}</strong> out.</span>
          </div>
          <a href="/shop" className="inline-block mt-4 text-sm text-forest hover:underline">← Back to Shop</a>
        </div>
      </div>
    </div>
  )
}
