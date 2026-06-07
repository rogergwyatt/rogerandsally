import Link from 'next/link'
import Image from 'next/image'
import { serif } from '@/controls/fonts'
import { supabaseAdmin } from '@/lib/supabase'
import { Drop, DropItem } from '@/lib/types'

// Server component: renders live, released drops above the standard catalog.
export default async function DropsSection() {
  const db = supabaseAdmin()
  const nowISO = new Date().toISOString()

  let drops: Drop[] = []
  try {
    const { data } = await db
      .from('drops')
      .select('*')
      .eq('status', 'live')
      .or(`release_at.is.null,release_at.lte.${nowISO}`)
      .order('created_at', { ascending: false })
    drops = (data as Drop[]) ?? []
    if (drops.length) {
      const ids = drops.map(d => d.id)
      const { data: items } = await db.from('drop_items').select('*').in('drop_id', ids).order('sort_order')
      drops = drops.map(d => ({ ...d, items: (items as DropItem[] ?? []).filter(i => i.drop_id === d.id) }))
    }
  } catch {
    return null // drops table not set up yet — render nothing
  }

  const visible = drops.filter(d => (d.items?.length ?? 0) > 0)
  if (visible.length === 0) return null

  return (
    <div className="mb-16">
      {visible.map(drop => (
        <section key={drop.id} className="mb-12">
          <div className="text-center mb-6">
            <span className="inline-block bg-cherry text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-2">
              Limited Release
            </span>
            <h2 className={`text-3xl lg:text-4xl text-walnut ${serif.className}`}>{drop.title}</h2>
            {drop.description && <p className="text-slate mt-2 max-w-2xl mx-auto">{drop.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drop.items!.map(item => {
              const soldOut = item.sold >= item.quantity
              const remaining = item.quantity - item.sold
              return (
                <Link
                  key={item.id}
                  href={`/shop/drop/${item.id}`}
                  className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border-2 ${soldOut ? 'border-maple opacity-70' : 'border-cherry'}`}
                >
                  <div className="relative h-64 bg-maple">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate text-sm">No image</div>
                    )}
                    {soldOut && (
                      <div className="absolute inset-0 bg-walnut/50 flex items-center justify-center">
                        <span className="bg-white text-walnut font-bold px-4 py-1 rounded-full text-sm">SOLD</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-xl text-walnut ${serif.className}`}>{item.name}</h3>
                      {!soldOut && item.quantity > 1 && (
                        <span className="text-xs text-cherry font-semibold whitespace-nowrap">{remaining} left</span>
                      )}
                      {!soldOut && item.quantity === 1 && (
                        <span className="text-xs text-cherry font-semibold whitespace-nowrap">1 of a kind</span>
                      )}
                    </div>
                    {item.description && <p className="text-slate text-sm mb-3 line-clamp-2">{item.description}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-cherry font-semibold text-lg">${Number(item.price).toFixed(2)}</span>
                      <span className="text-sm text-forest font-medium group-hover:underline">
                        {soldOut ? 'Sold' : 'View →'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
