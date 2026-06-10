import Breadcrumb from '@/components/Breadcrumb'
import { notFound } from 'next/navigation'
import { IProdust, IProdustsList } from '@/models/IProduct'
import ProductPage from '@/template/Catalog/ProductPage'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import translationsJson from '../../../../../../public/translations/translations.json'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { SITE_URL } from '@/http/axiosConfig'
import GoogleAnaliticProduct from '@/components/GoogleAnaliticProduct'

interface IPage {
    product: string
    locale: AllowedLangs
}

export async function generateMetadata({ params }: { params: IPage }) {
    const locale = params.locale
    const [productSlug, productVariation] = params.product.split("-var-");
    const blogData = await fetchData(productSlug, locale)

    if (!blogData.title) {
        return ''
    }

    const variation = blogData?.variations[0]

    let title_seo = blogData.title_seo
    let description_seo = blogData.description_seo

    if (!title_seo || !description_seo) {
        const metaSeo = await fetchSEOTitleOrDescription({
            lang: locale, title: blogData.title, category: blogData.category.title, price: (parseFloat(variation?.discounted_price) > 0
                ? variation?.discounted_price
                : parseInt(variation?.price)).toString(), type: 'product'
        });
        if (!title_seo) {
            title_seo = metaSeo.title_seo ?? blogData.title +
                ' ' +
                translationsJson[locale].seo.product.price +
                ' ' +
                (parseFloat(variation?.discounted_price) > 0
                    ? variation?.discounted_price
                    : parseInt(variation?.price)) +
                ' ' +
                translationsJson[locale].seo.product.title;
        }
        if (!description_seo) {
            description_seo = metaSeo.description_seo ?? blogData.title +
                ' ' +
                translationsJson[locale].seo.product.price +
                ' ' +
                (parseFloat(variation?.discounted_price) > 0
                    ? variation?.discounted_price
                    : parseInt(variation?.price)) +
                ' ' +
                translationsJson[locale].seo.product.description +
                ' ' +
                blogData.category.title +
                ' ' +
                translationsJson[locale].seo.product.description2;
        }
    }

    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical:
                SITE_URL +
                getLangSlug(locale) +
                '/shop/' +
                blogData.category.slug +
                blogData.slug,
            languages: {
                uk:
                    SITE_URL +
                    '/shop/' +
                    blogData.category.slug +
                    blogData.slug,
                ru:
                    SITE_URL +
                    '/ru/shop/' +
                    blogData.category.slug +
                    blogData.slug,
                en:
                    SITE_URL +
                    '/en/shop/' +
                    blogData.category.slug +
                    blogData.slug,
            },
        },
    }
}

const ShopProductPage = async ({ searchParams, params }: { searchParams: { color: string; size: string }, params: IPage }) => {
    const { locale } = params
    const { translations } = useLang()
    const session = await getServerSession(authConfig)
    const [productSlug, productVariation] = params.product.split("-var-");
    const productData = await fetchData(productSlug, locale)
    if (!productData.id) {
        notFound()
    }

    const productsListData = await fetchDataProductDop(
        'all',
        productData.category.slug,
        locale
    )

    const breadcrumbList: IBreadcrumb[] = [
        {
            id: 1,
            title: translations[locale].breadcrumb.all_category,
            slug: 'shop',
        },
    ]
    if (productData.category) {
        breadcrumbList.push({
            id: productData.category.id,
            title: productData.category.title,
            slug: productData.category.slug,
        })
    }

    return (
        <>
            <GoogleAnaliticProduct variations={productData.variations} getVariation={productVariation} />
            <Breadcrumb
                locale={locale}
                breadcrumbList={breadcrumbList}
                thisTitle={productData.title}
            />
            <ProductPage
                locale={locale}
                productData={productData}
                favorites={session?.user?.favorites ?? ([] as number[])}
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
        const response = await productsService.fetchProducts(
            page,
            category,
            {},
            [],
            0,
            {},
            locale
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IProdustsList
}

const fetchData = async (
    slug: string | undefined | null,
    locale: AllowedLangs
): Promise<IProdust> => {
    try {
        const response = await productsService.fetchProductOne(slug, locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IProdust
}

export default ShopProductPage
