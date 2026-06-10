import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import TitleSection from '@/components/TitleSection'
import { CatalogBox, CatalogСategories } from '@/components/Catalog'
import { ICategories, ICategorySEO } from '@/models/ICategories'
import { IFilterCountData, getBrandIds, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import categoryService from '@/services/categoryService'
import productsService from '@/services/productService'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../../../public/translations/translations.json'
import { getIdMappings, getLangSlug, parseFilters, validateObject } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

interface IPage {
    page: string
    sales: string
    sort: string
}

export async function generateMetadata({ searchParams, params }: { searchParams: IPage, params: { filter: string } }) {
    const { page = '1', sort = '', sales = '' } = searchParams
    const locale = AllowedLangs.UK

    const pageData = await fetchDataSEO(locale)

    const title = pageData?.data?.title_seo ?? `${translationsJson[locale].page_name.catalog} ${translationsJson[locale].seo.page.title}`
    const description = pageData?.data?.description_seo ?? `${translationsJson[locale].page_name.catalog} ${translationsJson[locale].seo.page.description}`

    const propertyFilter = await fetchFilter();
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
    if (productsData?.meta?.current_page && productsData?.meta?.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/shop${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData?.meta?.current_page - 1}` })
    }
    if (productsData?.meta?.current_page && productsData?.meta?.current_page < productsData?.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/shop${filterUrl ? '/filter/' + filterUrl : ''}?page=${productsData?.meta?.current_page + 1}` })
    }

    const boolFilter = validateObject(filterList, brandsIds);
    return {
        title,
        description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/shop' + (filterUrl ? '/filter/' + filterUrl : '') + (productsData?.meta?.current_page && productsData.meta.current_page != 1 ? '?page=' + productsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/shop',
                ru: SITE_URL + '/ru/shop',
                en: SITE_URL + '/en/shop',
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

    const [categories, propertyFilter] = await Promise.all([
        fetchCategory(),
        fetchFilter(),
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
        sort,
        parseInt(minprice ? minprice : propertyFilter.min_price),
        parseInt(maxprice ? maxprice : propertyFilter.max_price),
        filterList,
        brandsIds,
        rating
    )

    const breadcrumbList: IBreadcrumb[] = []
    const title = getTitle(sort, translations[locale])

    const filterCountData: IFilterCountData = {
        category: '',
        onlySales: false,
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
                title={title}
            />
            <article className="section-catalog-page box-content">
                <CatalogСategories locale={locale} categories={categories} />
                <CatalogBox
                    locale={locale}
                    propertyFilter={propertyFilter}
                    productsData={productsData}
                    page={page}
                    sort={sort}
                    filterCountData={filterCountData}
                    activeBrandsPage={brandsIds}
                    activeRating={rating}
                    activeFiltersPage={filterList}
                    favorites={session?.user?.favorites ?? []}
                    sales={false}
                    urlPage={'/shop'}
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
            false,
            brandIds
        )
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return {} as IProdustsList
    }
}

// Оптимизация получения категорий
const fetchCategory = async (): Promise<ICategories[]> => {
    try {
        const response = await categoryService.fetchCategories()
        return response.data.data
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

// Оптимизация получения фильтров
const fetchFilter = async (): Promise<PropertiesListFilterData> => {
    try {
        const response = await productsService.fetchPropertyFilter('')
        return response.data
    } catch (error) {
        console.error('Error fetching filters:', error)
        return {} as PropertiesListFilterData
    }
}

// Вспомогательная функция для получения заголовка
const getTitle = (sort: string, translations: any) => {
    switch (sort) {
        case 'newest':
            return translations.menu.news
        case 'hits':
            return translations.main.title_hit
        default:
            return translations.breadcrumb.all_category
    }
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
