import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import TitleSection from '@/components/TitleSection'
import { CatalogBox, CatalogCategories } from '@/components/Catalog'
import { ICategories, ICategorySEO } from '@/models/ICategories'
import { IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import categoryService from '@/services/categoryService'
import translationsJson from '../../../../public/translations/translations.json'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

interface IPage {
    page: string
    sales: string
    sort: string
}

export async function generateMetadata({
    searchParams,
    params,
}: {
    searchParams: IPage
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    const sort = searchParams.sort || ''
    const page = searchParams.page || '1'

    const propertyFilter = await fetchFilter(locale)

    const pageData = await fetchDataSEO(locale)

    const productsData = await fetchData(
        page,
        sort,
        parseInt(propertyFilter.min_price),
        parseInt(propertyFilter.max_price),
        locale
    )

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop?page=${productsData.meta.current_page + 1}` })
    }

    const title_seo = pageData.data?.title_seo ?? translationsJson[locale].page_name.catalog +
        ' ' +
        translationsJson[locale].seo.page.title;

    const description_seo = pageData.data?.description_seo ?? translationsJson[locale].page_name.catalog +
        ' ' +
        translationsJson[locale].seo.page.description;
    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop' + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/shop',
                ru: SITE_URL + '/ru/shop',
                en: SITE_URL + '/en/shop',
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

const ShopPage = async ({
    searchParams,
    params,
}: {
    searchParams: IPage
    params: { locale: AllowedLangs }
}) => {
    const session = await getServerSession(authConfig)
    const { locale } = params
    const sort = searchParams.sort || ''
    const { translations } = useLang()

    const page = searchParams.page || '1'
    const categories = await fetchCategory(locale)
    const propertyFilter = await fetchFilter(locale)

    const productsData = await fetchData(
        page,
        sort,
        parseInt(propertyFilter.min_price),
        parseInt(propertyFilter.max_price),
        locale
    )

    const breadcrumbList: IBreadcrumb[] = []

    let title = ''

    switch (sort) {
        case 'newest':
            title = translations[locale].menu.news
            break
        case 'hits':
            title = translations[locale].main.title_hit
            break
        default:
            title = translations[locale].breadcrumb.all_category
            break
    }

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={title}
            />
            <article className="section-catalog-page box-content">
                <CatalogCategories locale={locale} categories={categories} />
                <CatalogBox
                    locale={locale}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    page={page}
                    sort={sort}
                    favorites={session?.user?.favorites ?? []}
                    sales={false}
                    urlPage={getLangSlug(locale) + '/shop'}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                />
            </article>
        </>
    )
}

const fetchData = async (
    page: string,
    sort: string,
    priceMin: number,
    priceMax: number,
    locale: AllowedLangs,
): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            {},
            [priceMin, priceMax],
            0,
            {},
            locale,
            sort
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return {} as IProdustsList
    }
}

const fetchCategory = async (locale: AllowedLangs): Promise<ICategories[]> => {
    try {
        const response = await categoryService.fetchCategories('', '', locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchFilter = async (
    locale: AllowedLangs
): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter('', locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as PropertiesListFilterData
}

const fetchDataSEO = async (locale: AllowedLangs): Promise<ICategorySEO> => {
    try {
        const response = await categoryService.fetchCategorySEO(locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as ICategorySEO
}


export default ShopPage
