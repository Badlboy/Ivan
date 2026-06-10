import { MetadataRoute } from 'next'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL_API
const SITE_URL = process.env.SITE_URL || 'https://footballshop.com.ua'

// Оновлювати sitemap раз на добу
export const revalidate = 86400

interface CategoryNode {
    slug: string
    children?: CategoryNode[]
}

const flattenCategories = (categories: CategoryNode[]): string[] =>
    categories.flatMap((c) => [
        c.slug,
        ...flattenCategories(c.children ?? []),
    ])

const safeGet = async <T>(url: string, fallback: T): Promise<T> => {
    try {
        const { data } = await axios.get(url, { timeout: 30000 })
        return data
    } catch (error) {
        console.error('Sitemap: error fetching', url, error)
        return fallback
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = []
    const now = new Date()

    const addUrl = (
        path: string,
        priority: number,
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'
    ) => {
        entries.push({
            url: SITE_URL + path,
            lastModified: now,
            changeFrequency,
            priority,
        })
    }

    // Статичні сторінки (укр. версія — без префікса, ru/en — з префіксом)
    const staticPages: [string, number][] = [
        ['/', 1],
        ['/shop', 0.9],
        ['/shop/sales', 0.8],
        ['/brands', 0.7],
        ['/blogs', 0.7],
        ['/about-us', 0.5],
        ['/contact', 0.5],
        ['/delivery-payment', 0.5],
        ['/exchange-and-return', 0.5],
        ['/dropshippings', 0.5],
        ['/career', 0.3],
    ]
    for (const [path, priority] of staticPages) {
        addUrl(path === '/' ? '' : path, priority)
        addUrl('/ru' + (path === '/' ? '' : path), priority * 0.8)
        addUrl('/en' + (path === '/' ? '' : path), priority * 0.8)
    }

    // Категорії (включно з підкатегоріями)
    const categoriesResponse = await safeGet<{ data: CategoryNode[] }>(
        `${API_URL}/categories?type=little&lang=uk`,
        { data: [] }
    )
    for (const slug of flattenCategories(categoriesResponse.data)) {
        addUrl(`/shop/${slug}`, 0.8, 'daily')
        addUrl(`/ru/shop/${slug}`, 0.6, 'daily')
        addUrl(`/en/shop/${slug}`, 0.6, 'daily')
    }

    // Бренди
    const brandsResponse = await safeGet<{ data: { slug: string }[] }>(
        `${API_URL}/brands?lang=uk`,
        { data: [] }
    )
    for (const brand of brandsResponse.data) {
        addUrl(`/brands/${brand.slug}`, 0.6)
    }

    // Блог
    const firstBlogPage = await safeGet<{
        data: { slug: string; updated_at: string }[]
        meta?: { last_page: number }
    }>(`${API_URL}/blogs?page=1&lang=uk`, { data: [] })
    let blogs = firstBlogPage.data
    const blogLastPage = Math.min(firstBlogPage.meta?.last_page ?? 1, 50)
    for (let page = 2; page <= blogLastPage; page++) {
        const blogPage = await safeGet<{ data: { slug: string; updated_at: string }[] }>(
            `${API_URL}/blogs?page=${page}&lang=uk`,
            { data: [] }
        )
        blogs = blogs.concat(blogPage.data)
    }
    for (const blog of blogs) {
        entries.push({
            url: `${SITE_URL}/blogs/${blog.slug}`,
            lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
            changeFrequency: 'monthly',
            priority: 0.5,
        })
    }

    // Товари (посторінково, ліміт 300 сторінок як запобіжник)
    interface ProductItem {
        slug: string
        updated_at: string
        category?: { slug: string }
    }
    const firstProductPage = await safeGet<{
        data: ProductItem[]
        meta?: { last_page: number }
    }>(`${API_URL}/products?page=1&lang=uk`, { data: [] })

    let products = firstProductPage.data
    const productLastPage = Math.min(firstProductPage.meta?.last_page ?? 1, 300)

    const BATCH_SIZE = 10
    for (let start = 2; start <= productLastPage; start += BATCH_SIZE) {
        const batch = []
        for (
            let page = start;
            page < start + BATCH_SIZE && page <= productLastPage;
            page++
        ) {
            batch.push(
                safeGet<{ data: ProductItem[] }>(
                    `${API_URL}/products?page=${page}&lang=uk`,
                    { data: [] }
                )
            )
        }
        const results = await Promise.all(batch)
        for (const result of results) {
            products = products.concat(result.data)
        }
    }

    for (const product of products) {
        if (!product.category?.slug) continue
        entries.push({
            url: `${SITE_URL}/shop/${product.category.slug}/${product.slug}`,
            lastModified: product.updated_at
                ? new Date(product.updated_at)
                : now,
            changeFrequency: 'weekly',
            priority: 0.7,
        })
    }

    return entries
}
