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
    sales: string,
    sort: string
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: IPage
}) {
    const locale = AllowedLangs.UK
    const { page = '1', sort = '' } = searchParams
    const productsData = await fetchData(page, sort)

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

const ShopPage = async ({ searchParams }: { searchParams: IPage }) => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK
    const { translations } = useLang()

    const { page = '1', sort = '', sales = '' } = searchParams
    const productsData = await fetchData(page, sort)
    const propertyFilter = await fetchFilter('')

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
                    favorites={session?.user?.favorites ?? ([] as number[])}
                    sort={sort}
                    filterCountData={filterCountData}
                    urlPage={'/shop/sales'}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                />
            </article>
        </>
    )
}

const fetchData = async (page: string, sort: string): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            {},
            [],
            0,
            {},
            AllowedLangs.UK,
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

const fetchFilter = async (category: string | null | undefined): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter(category, AllowedLangs.UK, true)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as PropertiesListFilterData
}

export default ShopPage
