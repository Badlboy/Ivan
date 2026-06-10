import TitleSection from '@/components/TitleSection'
import { CatalogBox } from '@/components/Catalog'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import productsService from '@/services/productService'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import brandService from '@/services/brandService'
import { IBrand } from '@/models/IBrand'
import SectionSeoText from '@/components/Section/SectionSeoText'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../../public/translations/translations.json'
import { useLang } from '@/hooks/useLang'
import { SeoTags } from '@/models/response/soloResponse'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

interface IPage {
    brand: string | undefined | null
}

export async function generateMetadata({
    searchParams,
    params,
}: {
    searchParams: { page: string; sales: string, sort: string }
    params: IPage
}) {
    const blogData = await fetchDataSEO(params.brand)
    const locale = AllowedLangs.UK
    const { page = '1', sort = '', sales = '' } = searchParams

    const productsData = await fetchData(page, blogData.id, sort)

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/brands/${blogData.slug}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/brands/${blogData.slug}?page=${productsData.meta.current_page + 1}` })
    }

    return {
        title: blogData.title_seo
            ? blogData.title_seo
            : blogData.title + translationsJson[locale].seo.page.title,
        description: blogData.description_seo
            ? blogData.description_seo
            : blogData.title + translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/brands/' + blogData.slug + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/brands/' + blogData.slug,
                ru: SITE_URL + '/ru/brands/' + blogData.slug,
                en: SITE_URL + '/en/brands/' + blogData.slug,
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
    slug: string | undefined | null
): Promise<SeoTags> => {
    try {
        const response = await brandService.fetchBrandOne(
            slug,
            AllowedLangs.UK,
            'seo'
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const Page = async ({
    searchParams,
    params,
}: {
    searchParams: { page: string; sales: string, sort: string }
    params: IPage
}) => {
    const locale = AllowedLangs.UK
    const { translations } = useLang()
    const session = await getServerSession(authConfig)
    const { page = '1', sort = '', sales = '' } = searchParams
    const info = await fetchInfo(params.brand)

    if (!info.id) {
        notFound()
    }

    const productsData = await fetchData(page, info.id, sort)
    const propertyFilter = await fetchFilter(info.id)

    const breadcrumbList: IBreadcrumb[] = [
        {
            id: 1,
            title: translations[locale].breadcrumb.brands,
            slug: 'brands',
        },
    ]

    const filterCountData: IFilterCountData = {
        brand: info.id,
    } as IFilterCountData

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={info.name}
            />
            <article className="section-catalog-page box-content">
                <CatalogBox
                    locale={locale}
                    brand={info.id}
                    page={page}
                    category={''}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    favorites={session?.user?.favorites ?? ([] as number[])}
                    sales={false}
                    isBrandPage={true}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                    sort={sort}
                    filterCountData={filterCountData}
                    urlPage={'/brands/' + params.brand}
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
    brand: number,
    sort: string
): Promise<IProdustsList> => {
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            {},
            [],
            brand,
            {},
            AllowedLangs.UK,
            sort
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IProdustsList
}

const fetchInfo = async (slug: string | undefined | null): Promise<IBrand> => {
    try {
        const response = await brandService.fetchBrandOne(slug)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IBrand
}

const fetchFilter = async (brand: number): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter('', AllowedLangs.UK, false, brand)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as PropertiesListFilterData
}

export default Page
