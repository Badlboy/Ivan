import TitleSection from '@/components/TitleSection'
import { CatalogBox, CatalogSubСategories } from '@/components/Catalog'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { ICategories } from '@/models/ICategories'
import { IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import categoryService from '@/services/categoryService'
import productsService from '@/services/productService'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { SeoTags } from '@/models/response/soloResponse'
import translationsJson from '../../../../../public/translations/translations.json'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import SectionSeoText from '@/components/Section/SectionSeoText'

interface IPage {
    category: string | undefined | null
    locale: AllowedLangs,
}

export async function generateMetadata({
    searchParams,
    params,
}: {
    searchParams: { page: string, sales: string, sort: string }
    params: IPage
}) {
    const locale = params.locale
    const blogData = await fetchDataSEO(params.category, locale)
    const page = searchParams.page || '1'
    const sort = searchParams.sort || ''
    const sales = searchParams.sales || ''

    let title_seo = blogData.title_seo
    let description_seo = blogData.description_seo

    if (!title_seo || !description_seo) {
        const metaSeo = await fetchSEOTitleOrDescription({ lang: locale, title: blogData.title, type: 'catalog' });
        if (!title_seo) {
            title_seo = metaSeo.title_seo ?? blogData.title + ' ' + translationsJson[locale].seo.catalog.title;
        }
        if (!description_seo) {
            description_seo = metaSeo.description_seo ?? blogData.title + ' ' + translationsJson[locale].seo.catalog.description;
        }
    }

    const productsData = await fetchData(page, params.category, locale, sort, sales)

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}?page=${productsData.meta.current_page + 1}` })
    }

    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop/' + blogData.slug + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/shop/' + blogData.slug,
                ru: SITE_URL + '/ru/shop/' + blogData.slug,
                en: SITE_URL + '/en/shop/' + blogData.slug,
            },
        },
        robots: {
            index: (productsData?.meta?.current_page && productsData.meta.current_page > 1 ? false : true) && sort == '',
            follow: (productsData?.meta?.current_page && productsData.meta.current_page > 1 ? false : true) && sort == '',
        },
        icons: {
            other: arrayLink
        }
    }
}

const fetchDataSEO = async (
    slug: string | undefined | null,
    locale: AllowedLangs
): Promise<SeoTags> => {
    try {
        const response = await categoryService.fetchCategoryOne(
            slug,
            locale,
            'seo'
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const ShopCategoryPage = async ({
    searchParams,
    params,
}: {
    searchParams: { page: string; sales: string, sort: string }
    params: IPage
}) => {
    const { locale } = params
    const { translations } = useLang()
    const session = await getServerSession(authConfig)
    const { page = '1', sort = '', sales = '' } = searchParams
    const info = await fetchInfo(params.category, locale)

    if (!info.id) {
        notFound()
    }

    const productsData = await fetchData(page, params.category, locale, sort, sales)
    const categories = await fetchCategory(params.category, locale)
    const propertyFilter = await fetchFilter(params.category, locale)

    const breadcrumbList: IBreadcrumb[] = [
        {
            id: 1,
            title: translations[locale].breadcrumb.all_category,
            slug: 'shop',
        },
    ]

    if (info.parent) {
        breadcrumbList.push({
            id: info.parent.id,
            title: info.parent.title,
            slug: info.parent.slug,
        })
    }

    const filterCountData: IFilterCountData = {
        category: params?.category ?? '',
        onlySales: sales == 'sales',
        brand: 0,
        filterList: {},
        brandsIds: [],
        rating: 0,
        minprice: parseInt(propertyFilter.min_price),
        maxprice: parseInt(propertyFilter.max_price)
    }

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={info.title + (sales == 'sales' ? ' (' + translations[locale].menu.sales + ')' : '')}
            />
            <article className="section-catalog-page box-content">
                <CatalogSubСategories locale={locale} categories={categories} />
                <CatalogBox
                    locale={locale}
                    page={page}
                    category={params.category}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    filterCountData={filterCountData}
                    favorites={session?.user?.favorites ?? ([] as number[])}
                    sales={sales == 'sales'}
                    sort={sort}
                    urlPage={getLangSlug(locale) + '/shop/' + params.category}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                />
            </article>
            {page == '1' ? (
                <SectionSeoText locale={locale} text={info.description} />
            ) : ''}
        </>
    )
}

const fetchData = async (
    page: string,
    category: string | null | undefined,
    locale: AllowedLangs,
    sort: string,
    sales: string
): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(
            page,
            category,
            {},
            [],
            0,
            {},
            locale,
            sort,
            0,
            sales == 'sales'
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IProdustsList
}

const fetchInfo = async (
    slug: string | undefined | null,
    locale: AllowedLangs
): Promise<ICategories> => {
    try {
        const response = await categoryService.fetchCategoryOne(slug, locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as ICategories
}

const fetchCategory = async (
    slug: string | undefined | null,
    locale: AllowedLangs
): Promise<ICategories[]> => {
    try {
        const response = await categoryService.fetchCategories(slug, '', locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchFilter = async (
    category: string | null | undefined,
    locale: AllowedLangs
): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter(category, locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as PropertiesListFilterData
}

export default ShopCategoryPage
