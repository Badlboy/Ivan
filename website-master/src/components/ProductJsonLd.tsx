import React from 'react'
import { IProdust } from '@/models/IProduct'
import { API_URL_IMAGE } from '@/http/axiosConfig'

const stripHtml = (html: string): string =>
    (html || '').replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim()

const imageUrl = (url: string): string =>
    url.startsWith('http') ? url : (API_URL_IMAGE ?? '') + url

// JSON-LD розмітка товару для розширених результатів Google
// (ціна, наявність, рейтинг у сніпеті пошуку)
const ProductJsonLd = ({
    product,
    productUrl,
}: {
    product: IProdust
    productUrl: string
}) => {
    const variation = product.variations?.[0]
    if (!variation) return null

    const price =
        parseFloat(variation.discounted_price) > 0
            ? parseFloat(variation.discounted_price)
            : parseFloat(variation.price)

    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        url: productUrl,
        description: stripHtml(product.description),
        image: product.picture?.map((p) => imageUrl(p.url)) ?? [],
        offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'UAH',
            price: price,
            availability:
                variation.quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    }

    if (variation.article_number) {
        schema.sku = variation.article_number
    }
    if (product.brand?.title) {
        schema.brand = { '@type': 'Brand', name: product.brand.title }
    }
    if (product.reviews?.length > 0 && product.average_rating > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.reviews.length,
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export default ProductJsonLd
