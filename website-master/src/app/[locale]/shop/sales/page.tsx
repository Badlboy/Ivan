import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import TitleSection from '@/components/TitleSection'
import { CatalogBox } from '@/components/Catalog'
import { IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../../public/translations/translations.json'
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

    const { page = '1', sort = '' } = searchParams
    const productsData = await fetchData(page, locale, sort)

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop/sales?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop/sales?page=${productsData.meta.current_page + 1}` })
    }

    return {
        title:
            translationsJson[locale].menu.sales +
            ' ' +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].menu.sales +
            ' ' +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop/sales' + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/shop/sales',
                ru: SITE_URL + '/ru/shop/sales',
                en: SITE_URL + '/en/shop/sales',
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
    const locale = params.locale
    const { translations } = useLang()

    const { page = '1', sort = '' } = searchParams
    const productsData = await fetchData(page, locale, sort)
    const propertyFilter = await fetchFilter(locale)

    const breadcrumbList: IBreadcrumb[] = []

    const filterCountData: IFilterCountData = {
        onlySales: true,
    } as IFilterCountData

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={translations[locale].menu.sales}
            />
            <article className="section-catalog-page box-content">
                <CatalogBox
                    sales={true}
                    locale={locale}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    page={page}
                    sort={sort}
                    filterCountData={filterCountData}
                    urlPage={getLangSlug(locale) + '/shop/sales'}
                    favorites={session?.user?.favorites ?? ([] as number[])}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                />
            </article>
        </>
    )
}

const fetchData = async (
    page: string,
    locale: AllowedLangs,
    sort: string
): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            {},
            [],
            0,
            {},
            locale,
            sort,
            0,
            true
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IProdustsList
}

const fetchFilter = async (
    locale: AllowedLangs
): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter('', locale, true)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as PropertiesListFilterData
}

export default ShopPage
