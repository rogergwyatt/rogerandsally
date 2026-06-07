import { Product, DropItem, ProductOption } from './types'

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
  const options: ProductOption[] = []

  // Juice groove add-on, unless the owner marked it N/A for this board.
  if (item.juice_groove_available !== false) {
    const price = Number(item.juice_groove_price ?? 0)
    options.push({
      name: 'Juice Groove',
      key: 'juice_groove',
      choices: [
        { label: 'No groove', priceModifier: 0 },
        { label: price > 0 ? 'Add juice groove' : 'Add juice groove (free)', priceModifier: price },
      ],
    })
  }

  if (item.allow_engraving) {
    options.push({ name: 'Personalization', key: 'personalization', type: 'text', placeholder: 'Enter text to engrave (optional)', priceModifier: 0 })
  }

  return {
    id: `drop:${item.id}`,
    slug: `drop-${item.id}`,
    name: item.name,
    tagline: 'Limited release',
    description: item.description ?? '',
    images,
    video: item.video_url || undefined,
    category: 'drop',
    options,
    basePrice: Number(item.price),
    weightLbs: item.weight_lbs ? Number(item.weight_lbs) : 3,
    dimensionsInches: {
      length: item.length_in != null ? Number(item.length_in) : 16,
      width: item.width_in != null ? Number(item.width_in) : 11,
      height: item.thickness_in != null ? Number(item.thickness_in) : 1.5,
    },
    featured: false,
    inStock: item.sold < item.quantity,
  }
}

// Pull the drop_item id back out of a cart item's product id ("drop:<uuid>").
export function dropItemIdFromProductId(productId: string): string | null {
  return productId.startsWith('drop:') ? productId.slice(5) : null
}
