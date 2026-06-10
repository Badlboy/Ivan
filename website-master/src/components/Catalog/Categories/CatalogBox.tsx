'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { IFilterCountData, IProdustsList, PropertiesListFilterData } from '@/models/IProduct'
import ProductCard from '@/components/Card/ProductCard'
import FilterCatalog from './Filter'
import SortCatalog from './Sort'
import PaginationCatalog from './Pagination'
import Loader from '@/components/Loader'
import productsService from '@/services/productService'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { reverseGetIdMappings, stringifyFilters } from '@/utils/function'
import { useRouter, useSearchParams } from 'next/navigation'

const CatalogBox = ({
    sort,
    category,
    page,
    productsData,
    propertyFilter,
    favorites,
    brand = 0,
    locale,
    sales = false,
    isBrandPage = false,
    activeFiltersPage = {},
    activeBrandsPage = [],
    activeRating = 0,
    urlPage = '/shop',
    filterPrice = [0, 0],
    filterCountData = {} as IFilterCountData
}: {
    sort: string
    page: string
    category?: string | null | undefined
    productsData: IProdustsList
    propertyFilter: PropertiesListFilterData
    favorites: number[]
    brand?: number
    locale: AllowedLangs
    sales: boolean
    isBrandPage?: boolean
    activeFiltersPage?: {
        [key: number]: number[]
    },
    activeBrandsPage?: {
        id: number
        name: string
        textUrl: string
    }[]
    activeRating?: number,
    urlPage?: string | null | undefined,
    filterPrice: [number, number],
    filterCountData?: IFilterCountData,
}) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
    useEffect(() => {
        setIsOpenFilter(window.innerWidth > 1000)
    }, [])

    const { translations } = useLang()
    const [loadMore, setLoadMore] = useState<number>(0)
    const [loadMoreNo, setLoadMoreNo] = useState<boolean>(false)

    const [activeFilters, setActiveFilters] = useState<{
        [key: number]: number[]
    }>(activeFiltersPage)
    const [activeBrands, setActiveBrands] = useState<{
        id: number,
        name: string
        textUrl: string
    }[]>(activeBrandsPage)
    const [productData, setProductData] = useState<IProdustsList>(productsData)

    useEffect(() => {
        setProductData(productsData)
    }, [productsData]);

    const fetchProduct = async (
        activeFilters: { [key: number]: number[] },
        priceRange: [number, number] | [],
        signal?: AbortSignal,
        rating?: number,
        activeBrands?: {
            id: number,
            name: string
            textUrl: string
        }[],
        load_more?: number
    ): Promise<IProdustsList> => {
        try {
            const brandIds = activeBrands?.map(brand => brand.id);
            if (load_more) {
                page = load_more.toString();
            }
            let filterUrl = stringifyFilters(reverseGetIdMappings(propertyFilter.data, activeFilters));
            const brandsUrls = activeBrands?.map(brand => brand.textUrl).join(',');
            let newUrl = '';

            if (brandsUrls) {
                filterUrl = 'brands=' + brandsUrls + (filterUrl ? '&' + filterUrl : '');
            }
            if (priceRange) {
                filterUrl = 'minprice=' + priceRange[0] + '&maxprice=' + priceRange[1] + (filterUrl ? '&' + filterUrl : '');
            }
            if (rating) {
                filterUrl = 'rating=' + rating + (filterUrl ? '&' + filterUrl : '');
            }

            if (filterUrl) {
                newUrl = `${urlPage}/filter/${filterUrl}`;
            } else if (urlPage) {
                newUrl = urlPage;
            } else {
                newUrl = '/shop';
            }
            if (sort) {
                newUrl = newUrl + '?sort=' + sort;

                if (sales) {
                    newUrl = newUrl + '&sales=sales';
                }
            } else if (sales) {
                newUrl = newUrl + '?sales=sales';
            }


            if (load_more && load_more > 0) {
                startTransition(async () => {
                    const response = await productsService.fetchProducts(
                        page,
                        category,
                        activeFilters,
                        priceRange,
                        brand,
                        { signal },
                        locale,
                        sort,
                        rating,
                        sales,
                        brandIds
                    )

                    if (loadMoreNo) {
                        setProductData((prevState) => ({
                            ...response.data,
                            data: response.data.data,
                        }))
                        setLoadMoreNo(false)
                    } else {
                        setProductData((prevState) => ({
                            ...response.data,
                            data: [...prevState.data, ...response.data.data],
                        }))
                    }

                    newUrl = newUrl + '?page=' + page + '&loadMore=true';

                    window.history.replaceState(
                        {
                            ...window.history.state,
                            as: newUrl,
                            url: newUrl
                        },
                        "",
                        newUrl
                    )
                    setLoadMore(0);
                })
            } else {
                startTransition(() => {
                    router.push(newUrl, { scroll: false })
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
        return {} as IProdustsList
    }

    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams.get('loadMore') == 'true') {
            setTimeout(() => {
                window.scroll({
                    top: 0,
                    behavior: 'smooth',
                })
            }, 300);

            const page = parseInt(searchParams.get('page') || '1');
            setLoadMoreNo(true);
            setLoadMore(page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="catalog-box">
            <div className="catalog-box__sort">
                <div className="left">
                    <span
                        className="filter"
                        onClick={() => setIsOpenFilter(!isOpenFilter)}
                    >
                        {translations[locale].catalog.filter}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 5.83333L16.6667 5.83333"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3.33398 5.83333L6.66732 5.83333"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M14.166 14.1667L16.666 14.1667"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3.33398 14.1667L10.0007 14.1667"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="8.33333"
                                cy="5.83333"
                                r="1.66667"
                                transform="rotate(90 8.33333 5.83333)"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <ellipse
                                cx="12.4993"
                                cy="14.1667"
                                rx="1.66667"
                                ry="1.66667"
                                transform="rotate(90 12.4993 14.1667)"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <span>
                        {translations[locale].catalog.product_count}:{' '}
                        {productData.meta?.total ?? 0}
                    </span>
                </div>
                <SortCatalog
                    activeSort={sort}
                    locale={locale}
                    sales={sales}
                />
            </div>
            <div className="catalog-box__content">
                <FilterCatalog
                    loadMore={loadMore}
                    setIsOpenFilter={setIsOpenFilter}
                    isOpenFilter={isOpenFilter}
                    locale={locale}
                    fetchProduct={fetchProduct}
                    propertyFilter={propertyFilter}
                    setActiveFilters={setActiveFilters}
                    activeFilters={activeFilters}
                    page={page}
                    activeBrands={activeBrands}
                    setActiveBrands={setActiveBrands}
                    isBrandPage={isBrandPage}
                    activeRating={activeRating}
                    filterPrice={filterPrice}
                    filterCountData={filterCountData}
                />
                <div className={`products-list ${isPending ? 'loading' : ''}`}>
                    {isPending ? <Loader /> : ''}
                    {productData.data?.length ? (
                        <>
                            {isPending ? <Loader /> : ''}
                            <div className={`list ${isPending ? 'loading' : ''}`}>
                                {productData.data.map((product) => (
                                    <ProductCard
                                        locale={locale}
                                        favorites={favorites}
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                            <PaginationCatalog
                                setLoadMore={setLoadMore}
                                locale={locale}
                                sort={sort}
                                meta={productData.meta}
                                sales={sales}
                            />
                        </>
                    ) : (
                        <span className="title-section text-h1 center empty-title">
                            {translations[locale].catalog.empty}
                        </span>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CatalogBox
