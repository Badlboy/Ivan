import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import TitleSection from '@/components/TitleSection'
import { CatalogBox } from '@/components/Catalog'
import { getBrandIds, IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../../../../public/translations/translations.json'
import { getIdMappings, getLangSlug, parseFilters, validateObject } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import { IBrand } from '@/models/IBrand'
import brandService from '@/services/brandService'
import { notFound } from 'next/navigation'
import { SeoTags } from '@/models/response/soloResponse'

interface IPage {
    brand: string | undefined | null;
    filter: string
}

export async function generateMetadata({
    searchParams,
    params,
}: {
    searchParams: { page: string; sales: string, sort: string }
    params: IPage
}) {
    const { page = '1', sort = '' } = searchParams
    const blogData = await fetchDataSEO(params.brand)
    const locale = AllowedLangs.UK

    const propertyFilter = await fetchFilter(blogData.id)
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
        sort,
        parseInt(minprice ? minprice : propertyFilter.min_price),
        parseInt(maxprice ? maxprice : propertyFilter.max_price),
        filterList,
        brandsIds,
        rating,
        blogData.id
    )

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/brands/${blogData.slug}${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/brands/${blogData.slug}${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page + 1}` })
    }

    const boolFilter = validateObject(filterList, brandsIds);
    return {
        title: blogData.title_seo
            ? blogData.title_seo
            : blogData.title + translationsJson[locale].seo.page.title,
        description: blogData.description_seo
            ? blogData.description_seo
            : blogData.title + translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/brands/' + blogData.slug + (filterUrl ? '/filter/' + filterUrl : '') + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/brands/' + blogData.slug,
                ru: SITE_URL + '/ru/brands/' + blogData.slug,
                en: SITE_URL + '/en/brands/' + blogData.slug,
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


const ShopPage = async ({ searchParams, params }: { searchParams: { page: string; sales: string, sort: string }, params: IPage }) => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK
    const { translations } = useLang()

    const { page = '1', sort = '' } = searchParams

    const info = await fetchInfo(params.brand)

    if (!info.id) {
        notFound()
    }

    const propertyFilter = await fetchFilter(info.id)

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
        sort,
        parseInt(minprice ? minprice : propertyFilter.min_price),
        parseInt(maxprice ? maxprice : propertyFilter.max_price),
        filterList,
        brandsIds,
        rating,
        info.id
    )

    const breadcrumbList: IBreadcrumb[] = [
        {
            id: 1,
            title: translations[locale].breadcrumb.brands,
            slug: 'brands',
        },
    ]

    const filterCountData: IFilterCountData = {
        category: '',
        onlySales: false,
        brand: info.id,
        filterList,
        brandsIds,
        rating,
        minprice: parseInt(minprice ? minprice : propertyFilter.min_price),
        maxprice: parseInt(maxprice ? maxprice : propertyFilter.max_price)
    }

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
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    page={page}
                    sort={sort}
                    activeBrandsPage={brandsIds}
                    activeRating={rating}
                    activeFiltersPage={filterList}
                    favorites={session?.user?.favorites ?? []}
                    sales={false}
                    isBrandPage={true}
                    filterCountData={filterCountData}
                    urlPage={'/brands/' + params.brand}
                    filterPrice={[parseInt(minprice ? minprice : propertyFilter.min_price), parseInt(maxprice ? maxprice : propertyFilter.max_price)]}
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
    filter: Record<number, number[]>,
    brandsIds: {
        id: number,
        name: string
        textUrl: string
    }[],
    rating: number,
    brand: number
): Promise<IProdustsList> => {
    const brandIds = brandsIds?.map(brand => brand.id);
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            filter,
            [priceMin, priceMax],
            brand,
            {},
            AllowedLangs.UK,
            sort,
            rating,
            false,
            brandIds
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return {} as IProdustsList
    }
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

export default ShopPage
