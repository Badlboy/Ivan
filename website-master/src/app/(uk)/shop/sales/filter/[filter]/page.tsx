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

interface IPage {
    page: string,
    sales: string,
    sort: string
}

export async function generateMetadata({
    searchParams,
    params
}: {
    searchParams: IPage,
    params: { filter: string }
}) {
    const locale = AllowedLangs.UK
    const { page = '1', sort = '', sales = '' } = searchParams

    const propertyFilter = await fetchFilter('')
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
        rating
    )

    let arrayLink = [];
    if (productsData?.meta?.current_page && productsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop/sales${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData.meta.current_page < productsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop/sales${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData.meta.current_page + 1}` })
    }

    const boolFilter = validateObject(filterList, brandsIds);
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
            canonical: SITE_URL + getLangSlug(locale) + '/shop/sales' + (filterUrl ? '/filter/' + filterUrl : '') + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/shop/sales',
                ru: SITE_URL + '/ru/shop/sales',
                en: SITE_URL + '/en/shop/sales',
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

const ShopPage = async ({ searchParams, params }: { searchParams: IPage, params: { filter: string } }) => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK
    const { translations } = useLang()

    const { page = '1', sort = '', sales = '' } = searchParams

    const propertyFilter = await fetchFilter('')

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
        rating
    )

    const breadcrumbList: IBreadcrumb[] = []

    const filterCountData: IFilterCountData = {
        category: '',
        onlySales: true,
        brand: 0,
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
                title={translations[locale].menu.sales}
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
                    sales={true}
                    filterCountData={filterCountData}
                    urlPage={'/shop/sales'}
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
    rating: number
): Promise<IProdustsList> => {
    const brandIds = brandsIds?.map(brand => brand.id);
    try {
        const response = await productsService.fetchProducts(
            page,
            '',
            filter,
            [priceMin, priceMax],
            0,
            {},
            AllowedLangs.UK,
            sort,
            rating,
            true,
            brandIds
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return {} as IProdustsList
    }
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
