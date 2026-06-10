import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import TitleSection from '@/components/TitleSection'
import { CatalogBox, CatalogSubСategories, CatalogСategories } from '@/components/Catalog'
import { ICategories } from '@/models/ICategories'
import { getBrandIds, IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import categoryService from '@/services/categoryService'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../../../../public/translations/translations.json'
import { fetchSEOTitleOrDescription, getIdMappings, getLangSlug, parseFilters, validateObject } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import SectionSeoText from '@/components/Section/SectionSeoText'
import { notFound } from 'next/navigation'
import { SeoTags } from '@/models/response/soloResponse'

interface IPage {
    category: string | undefined | null,
    filter: string,
    locale: AllowedLangs
}

export async function generateMetadata({ searchParams, params }: { searchParams: { page: string, sales: string, sort: string }, params: IPage }) {
    const locale = params.locale
    const [blogData] = await Promise.all([fetchDataSEO(params.category, locale)])
    const { page = '1', sort = '', sales = '' } = searchParams

    const propertyFilter = await fetchFilter(params.category, locale)
    const filterUrl = decodeURIComponent(params.filter);

    const paramsPage = filterUrl.split('&');
    let brands = '', minprice = '', maxprice = '', rating = 0;
    let otherParams: string[] = [];

    paramsPage.forEach(param => {
        const [key, value] = param.split('=');
        if (key === 'brands') {
            brands = value;
        } else if (key === 'minprice') {
            minprice = value;
        } else if (key === 'maxprice') {
            maxprice = value;
        } else if (key === 'rating') {
            rating = parseInt(value);
        } else {
            otherParams.push(param);
        }
    });

    const otherParamsString = otherParams.join('');
    const decodedFilter = parseFilters(otherParamsString);


    const brandsIds = getBrandIds(propertyFilter.brands, brands);
    const filterList = getIdMappings(propertyFilter.data, decodedFilter);

    const productsData = await fetchData(
        page,
        params.category,
        sort,
        parseInt(minprice ? minprice : propertyFilter.min_price),
        parseInt(maxprice ? maxprice : propertyFilter.max_price),
        filterList,
        brandsIds,
        rating,
        locale,
        sales
    )

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

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop/${blogData.slug}${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page + 1}` })
    }

    const boolFilter = validateObject(filterList, brandsIds);
    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop/' + blogData.slug + (filterUrl ? '/filter/' + filterUrl : '') + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: `${SITE_URL}/shop/${blogData.slug}`,
                ru: `${SITE_URL}/ru/shop/${blogData.slug}`,
                en: `${SITE_URL}/en/shop/${blogData.slug}`,
            },
        },
        robots: {
            index: (productsData?.meta?.current_page && productsData.meta.current_page > 1 ? false : true) && sort == '' && boolFilter,
            follow: (productsData?.meta?.current_page && productsData.meta.current_page > 1 ? false : true) && sort == '' && boolFilter,
        },
        icons: {
            other: arrayLink
        }
    }
}
const ShopCategoryPage = async ({ searchParams, params }: { searchParams: { page: string, sales: string, sort: string }, params: IPage }) => {
    const session = await getServerSession(authConfig)
    const locale = params.locale
    const { translations } = useLang()

    const { page = '1', sort = '', sales = '' } = searchParams

    const [info, categories, propertyFilter] = await Promise.all([
        fetchInfo(params.category, locale),
        fetchCategory(params.category, locale),
        fetchFilter(params.category, locale),
    ])

    const paramsPage = decodeURIComponent(params.filter).split('&');
    let brands = '', minprice = '', maxprice = '', rating = 0;
    let otherParams: string[] = [];

    paramsPage.forEach(param => {
        const [key, value] = param.split('=');
        if (key === 'brands') {
            brands = value;
        } else if (key === 'minprice') {
            minprice = value;
        } else if (key === 'maxprice') {
            maxprice = value;
        } else if (key === 'rating') {
            rating = parseInt(value);
        } else {
            otherParams.push(param);
        }
    });

    const otherParamsString = otherParams.join('');
    const decodedFilter = parseFilters(otherParamsString);


    const brandsIds = getBrandIds(propertyFilter.brands, brands);
    const filterList = getIdMappings(propertyFilter.data, decodedFilter);

    const productsData = await fetchData(
        page,
        params.category,
        sort,
        parseInt(minprice ? minprice : propertyFilter.min_price),
        parseInt(maxprice ? maxprice : propertyFilter.max_price),
        filterList,
        brandsIds,
        rating,
        locale,
        sales
    )

    if (!info.id) notFound()

    const breadcrumbList: IBreadcrumb[] = [
        { id: 1, title: translations[locale].breadcrumb.all_category, slug: 'shop' },
        ...(info.parent ? [{ id: info.parent.id, title: info.parent.title, slug: info.parent.slug }] : []),
    ]

    const filterCountData: IFilterCountData = {
        category: params?.category ?? '',
        onlySales: sales == 'sales',
        brand: 0,
        filterList,
        brandsIds,
        rating,
        minprice: parseInt(minprice ? minprice : propertyFilter.min_price),
        maxprice: parseInt(maxprice ? maxprice : propertyFilter.max_price)
    }

    return (
        <>
            <TitleSection locale={locale} breadcrumbList={breadcrumbList} title={info.title + (sales == 'sales' ? ' (' + translations[locale].menu.sales + ')' : '')} />
            <article className="section-catalog-page catalog-sub-category">
                <div className="box-content">
                    <CatalogSubСategories locale={locale} categories={categories} />
                </div>
            </article>
            <article className="section-catalog-page box-content">
                <CatalogBox
                    locale={locale}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    page={page}
                    sort={sort}
                    activeBrandsPage={brandsIds}
                    activeRating={rating}
                    activeFiltersPage={filterList}
                    favorites={session?.user?.favorites ?? []}
                    sales={sales == 'sales'}
                    filterCountData={filterCountData}
                    urlPage={getLangSlug(locale) + '/shop/' + params.category}
                    category={params.category}
                    filterPrice={[parseInt(minprice ? minprice : propertyFilter.min_price), parseInt(maxprice ? maxprice : propertyFilter.max_price)]}
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
    sort: string,
    priceMin: number,
    priceMax: number,
    filter: Record<number, number[]>,
    brandsIds: {
        id: number,
        name: string
        textUrl: string
    }[],
    rating: number,
    locale: AllowedLangs,
    sales: string
): Promise<IProdustsList> => {
    const brandIds = brandsIds?.map(brand => brand.id);
    try {
        const response = await productsService.fetchProducts(
            page,
            category,
            filter,
            [priceMin, priceMax],
            0,
            {},
            locale,
            sort,
            rating,
            sales == 'sales',
            brandIds
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return {} as IProdustsList
    }
}
const fetchInfo = async (slug: string | undefined | null, locale: AllowedLangs): Promise<ICategories> => {
    try {
        const { data } = await categoryService.fetchCategoryOne(slug, locale)
        return data.data
    } catch (error) {
        console.error('Error fetching category info:', error)
        return {} as ICategories
    }
}

const fetchCategory = async (slug: string | undefined | null, locale: AllowedLangs): Promise<ICategories[]> => {
    try {
        const { data } = await categoryService.fetchCategories(slug, '', locale)
        return data.data
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

const fetchFilter = async (category: string | null | undefined, locale: AllowedLangs): Promise<PropertiesListFilterData> => {
    try {
        const { data } = await productsService.fetchPropertyFilter(category, locale)
        return data
    } catch (error) {
        console.error('Error fetching property filters:', error)
        return {} as PropertiesListFilterData
    }
}

const fetchDataSEO = async (slug: string | undefined | null, locale: AllowedLangs): Promise<SeoTags> => {
    try {
        const { data } = await categoryService.fetchCategoryOne(slug, locale, 'seo')
        return data.data
    } catch (error) {
        console.error('Error fetching SEO data:', error)
        return {} as SeoTags
    }
}

export default ShopCategoryPage
