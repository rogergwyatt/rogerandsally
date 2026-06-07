import { Product, DropItem } from './types'

// Convert a drop item into a Product so it flows through the existing cart and
// checkout. The id is prefixed "drop:" so order fulfillment can recognize it
// and decrement inventory.
export function dropItemToProduct(item: DropItem): Product {
  const images =
    item.image_urls && item.image_urls.length
      ? item.image_urls
      : item.image_url
        ? [item.image_url]
        : []
  return {
    id: `drop:${item.id}`,
    slug: `drop-${item.id}`,
    name: item.name,
    tagline: 'Limited release',
    description: item.description ?? '',
    images,
    video: item.video_url || undefined,
    category: 'drop',
    options: item.allow_engraving
      ? [{ name: 'Personalization', key: 'personalization', type: 'text', placeholder: 'Enter text to engrave (optional)', priceModifier: 0 }]
      : [],
    basePrice: Number(item.price),
    weightLbs: item.weight_lbs ? Number(item.weight_lbs) : 3,
    dimensionsInches: { length: 16, width: 11, height: 1.5 },
    featured: false,
    inStock: item.sold < item.quantity,
  }
}

// Pull the drop_item id back out of a cart item's product id ("drop:<uuid>").
export function dropItemIdFromProductId(productId: string): string | null {
  return productId.startsWith('drop:') ? productId.slice(5) : null
}
