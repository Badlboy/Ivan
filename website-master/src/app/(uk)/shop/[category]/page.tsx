import TitleSection from '@/components/TitleSection'
import { CatalogBox, CatalogSubCategories } from '@/components/Catalog'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { ICategories } from '@/models/ICategories'
import { IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import categoryService from '@/services/categoryService'
import productsService from '@/services/productService'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../../public/translations/translations.json'
import { AllowedLangs } from '@/constants/lang'
import { SeoTags } from '@/models/response/soloResponse'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import SectionSeoText from '@/components/Section/SectionSeoText'

interface IPage {
    category: string | undefined | null
}

export async function generateMetadata({ searchParams, params }: { searchParams: { page: string, sales: string, sort: string }, params: IPage }) {
    const [blogData] = await Promise.all([fetchDataSEO(params.category)])
    const locale = AllowedLangs.UK
    const page = searchParams.page || '1'
    const sort = searchParams.sort || ''
    const sales = searchParams.sales || ''

    const propertyFilter = await fetchFilter(params.category);
    const productsData = await fetchData(page, params.category, [parseFloat(propertyFilter.min_price), parseFloat(propertyFilter.max_price)], sort, sales)

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}?page=${productsData.meta.current_page + 1}` })
    }

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

    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop/' + blogData.slug + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: `${SITE_URL}/shop/${blogData.slug}`,
                ru: `${SITE_URL}/ru/shop/${blogData.slug}`,
                en: `${SITE_URL}/en/shop/${blogData.slug}`,
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

const fetchDataSEO = async (slug: string | undefined | null): Promise<SeoTags> => {
    try {
        const { data } = await categoryService.fetchCategoryOne(slug, AllowedLangs.UK, 'seo')
        return data.data
    } catch (error) {
        console.error('Error fetching SEO data:', error)
        return {} as SeoTags
    }
}

const ShopCategoryPage = async ({ searchParams, params }: { searchParams: { page: string, sort: string, sales: string }, params: IPage }) => {
    const session = await getServerSession(authConfig)
    const { page = '1', sort = '', sales = '' } = searchParams
    const locale = AllowedLangs.UK
    const { translations } = useLang()

    const [info, propertyFilter, categories] = await Promise.all([
        fetchInfo(params.category),
        fetchFilter(params.category),
        fetchCategory(params.category)
    ])

    const productsData = await fetchData(page, params.category, [parseFloat(propertyFilter.min_price), parseFloat(propertyFilter.max_price)], sort, sales)

    if (!info.id) notFound()

    const breadcrumbList: IBreadcrumb[] = [
        { id: 1, title: translations[locale].breadcrumb.all_category, slug: 'shop' },
        ...(info.parent ? [{ id: info.parent.id, title: info.parent.title, slug: info.parent.slug }] : []),
    ]

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
            <TitleSection locale={locale} breadcrumbList={breadcrumbList} title={info.title + (sales == 'sales' ? ' (' + translations[locale].menu.sales + ')' : '')} />
            <article className="section-catalog-page catalog-sub-category">
                <div className="box-content">
                    <CatalogSubCategories locale={locale} categories={categories} />
                </div>
            </article>
            <article className="section-catalog-page box-content">
                <CatalogBox
                    locale={locale}
                    sort={sort}
                    page={page}
                    filterCountData={filterCountData}
                    category={params.category}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    favorites={session?.user?.favorites ?? ([] as number[])}
                    sales={sales == 'sales'}
                    urlPage={'/shop/' + params.category}
                    filterPrice={[parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]}
                />
            </article>
            {page == '1' ? (
                <SectionSeoText locale={locale} text={info.description} />
            ) : ''}
        </>
    )
}

const fetchData = async (page: string, category: string | null | undefined, price: [number, number], sort: string, sales: string): Promise<IProdustsList> => {
    try {
        const { data } = await productsService.fetchProducts(page, category, {}, price, 0, {}, AllowedLangs.UK, sort, 0, sales == 'sales')
        return data
    } catch (error) {
        console.error('Error fetching products data:', error)
        return {} as IProdustsList
    }
}

const fetchInfo = async (slug: string | undefined | null): Promise<ICategories> => {
    try {
        const { data } = await categoryService.fetchCategoryOne(slug)
        return data.data
    } catch (error) {
        console.error('Error fetching category info:', error)
        return {} as ICategories
    }
}

const fetchCategory = async (slug: string | undefined | null): Promise<ICategories[]> => {
    try {
        const { data } = await categoryService.fetchCategories(slug)
        return data.data
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

const fetchFilter = async (category: string | null | undefined): Promise<PropertiesListFilterData> => {
    try {
        const { data } = await productsService.fetchPropertyFilter(category)
        return data
    } catch (error) {
        console.error('Error fetching property filters:', error)
        return {} as PropertiesListFilterData
    }
}

export default ShopCategoryPage
