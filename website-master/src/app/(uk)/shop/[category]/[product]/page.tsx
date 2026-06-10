import Breadcrumb from '@/components/Breadcrumb'
import { notFound } from 'next/navigation'
import { IProdust, IProdustsList } from '@/models/IProduct'
import ProductPage from '@/template/Catalog/ProductPage'
import translationsJson from '../../../../../../public/translations/translations.json'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { API_URL_IMAGE, SITE_URL } from '@/http/axiosConfig'
import { Suspense } from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import GoogleAnaliticProduct from '@/components/GoogleAnaliticProduct'
import ProductJsonLd from '@/components/ProductJsonLd'

interface IPage {
    product: string
    category: string | undefined | null
}

export async function generateMetadata({ params }: { params: IPage }) {
    const [productSlug, productVariation] = params.product.split("-var-");
    const blogData = await fetchData(productSlug)
    const locale = AllowedLangs.UK

    if (!blogData || !blogData.variations?.length) return { title: 'Product Not Found' }

    const variation = blogData.variations[0]
    const price = parseFloat(variation?.discounted_price) > 0
        ? variation?.discounted_price
        : parseInt(variation?.price)

    let title_seo = blogData.title_seo
    let description_seo = blogData.description_seo

    if (!title_seo || !description_seo) {
        const metaSeo = await fetchSEOTitleOrDescription({
            lang: locale, title: blogData.title, category: blogData?.category?.title ?? '', price: (price.toString()), type: 'product'
        });
        if (!title_seo) {
            title_seo = metaSeo.title_seo ?? `${blogData.title} ${translationsJson[locale].seo.product.price} ${price} ${translationsJson[locale].seo.product.title}`;
        }
        if (!description_seo) {
            description_seo = metaSeo.description_seo ?? `${blogData.title} ${translationsJson[locale].seo.product.price} ${price} ${translationsJson[locale].seo.product.description} ${blogData.category?.title} ${translationsJson[locale].seo.product.description2}`;
        }
    }

    const productPath = `/shop/${blogData.category?.slug}/${blogData.slug}`
    const productImages = blogData.picture?.length
        ? blogData.picture.map((p) => ({
              url: p.url.startsWith('http') ? p.url : (API_URL_IMAGE ?? '') + p.url,
          }))
        : [{ url: `${SITE_URL}/image/Logo.png` }]

    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: `${SITE_URL}${getLangSlug(locale)}${productPath}`,
            languages: {
                uk: `${SITE_URL}${productPath}`,
                ru: `${SITE_URL}/ru${productPath}`,
                en: `${SITE_URL}/en${productPath}`,
            }
        },
        openGraph: {
            title: title_seo,
            description: description_seo,
            url: `${SITE_URL}${getLangSlug(locale)}${productPath}`,
            siteName: 'FOOTBALLSHOP',
            images: productImages,
            locale: 'uk_UA',
            type: 'website',
        }
    }
}

const ShopProductPage = async ({ searchParams, params }: { searchParams: { color: string; size: string }, params: IPage }) => {
    const locale = AllowedLangs.UK
    const session = await getServerSession(authConfig)
    const [productSlug, productVariation] = params.product.split("-var-");

    const [productData, productsListData] = await Promise.all([
        fetchData(productSlug),
        fetchDataProductDop('all', params.category, locale)
    ])

    if (!productData?.id) notFound()

    const breadcrumbList: IBreadcrumb[] = [
        { id: 1, title: translationsJson[locale].breadcrumb.all_category, slug: 'shop' }
    ]

    if (productData.category) {
        breadcrumbList.push({
            id: productData.category.id,
            title: productData.category.title,
            slug: productData.category.slug
        })
    }

    return (
        <>
            <ProductJsonLd
                product={productData}
                productUrl={`${SITE_URL}/shop/${productData.category?.slug}/${productData.slug}`}
            />
            <GoogleAnaliticProduct variations={productData.variations} getVariation={productVariation} />
            <Breadcrumb locale={locale} breadcrumbList={breadcrumbList} thisTitle={productData.title} />
            <ProductPage
                locale={locale}
                productData={productData}
                favorites={session?.user?.favorites ?? []}
                products_like={productsListData.data}
                getVariation={productVariation}
            />
        </>
    )
}

const fetchDataProductDop = async (
    page: string,
    category: string | null | undefined,
    locale: AllowedLangs
): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(page, category, {}, [], 0, {}, locale)
        return response.data
    } catch (error) {
        console.error('Error fetching product dop data:', error)
    }
    return {} as IProdustsList
}

const fetchData = async (slug: string | undefined | null): Promise<IProdust> => {
    if (!slug) return {} as IProdust

    try {
        const response = await productsService.fetchProductOne(slug)
        return response.data.data
    } catch (error) {
        console.error('Error fetching product data:', error)
    }
    return {} as IProdust
}

export default ShopProductPage
