'use client'
import { IFilterCountData, PropertiesListFilterData } from '@/models/IProduct'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import FilterItem from './FilterItem'
import FilterItemPrice from './FilterItemPrice'
import { debounce } from 'lodash'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import FilterBrands from './FilterBrands'

const FilterCatalog = ({
    loadMore,
    isOpenFilter,
    setIsOpenFilter,
    fetchProduct,
    locale,
    activeFilters,
    setActiveFilters,
    propertyFilter = {} as PropertiesListFilterData,
    activeBrands = [] as {
        id: number,
        name: string
        textUrl: string
    }[],
    setActiveBrands,
    isBrandPage = false,
    activeRating = 0,
    filterPrice = [0, 0],
    filterCountData = {} as IFilterCountData
}: {
    loadMore: number
    page: string
    setIsOpenFilter: any
    isOpenFilter: boolean
    setActiveFilters: any
    fetchProduct: any
    locale: AllowedLangs
    activeFilters: {
        [key: number]: number[]
    }
    propertyFilter: PropertiesListFilterData,
    activeBrands: {
        id: number,
        name: string
        textUrl: string
    }[],
    setActiveBrands: any
    isBrandPage?: boolean,
    activeRating: number,
    filterPrice: [number, number],
    filterCountData?: IFilterCountData,
}) => {
    const { translations } = useLang()
    const abortControllerRef = useRef<AbortController | null>(null)
    const [rating, setRating] = useState<number>(activeRating)
    const [priceRange, setPriceRange] = useState<[number, number]>([
        filterPrice[0],
        filterPrice[1],
    ])

    const handleFilterToggle = (filterId: number, valueId: number) => {
        setActiveFilters((prevFilters: any) => {
            const currentFilters = { ...prevFilters }
            if (currentFilters[filterId]) {
                if (currentFilters[filterId].includes(valueId)) {
                    currentFilters[filterId] = currentFilters[filterId].filter(
                        (id: number) => id !== valueId
                    )
                    if (currentFilters[filterId].length === 0) {
                        delete currentFilters[filterId]
                    }
                } else {
                    currentFilters[filterId] = [
                        ...(currentFilters[filterId] || []),
                        valueId,
                    ]
                }
            } else {
                currentFilters[filterId] = [valueId]
            }
            debouncedFetchProducts(currentFilters, priceRange, rating, activeBrands)
            return currentFilters
        })
    }
    const getSortedActiveFilters = () => {
        return Object.entries(activeFilters).sort(
            ([aId], [bId]) => parseInt(aId) - parseInt(bId)
        )
    }

    const handlePriceRangeChange = (newRange: [number, number]) => {
        setPriceRange(newRange)
    }

    const sendFilterPrice = () => {
        debouncedFetchProducts(activeFilters, priceRange, rating, activeBrands)
    }

    const sendFilterRating = (rating: number) => {
        debouncedFetchProducts(activeFilters, priceRange, rating, activeBrands)
        setRating(rating)
    }

    const fetchProductsWithDelay = useCallback(
        async (
            filters: { [key: number]: number[] },
            priceRange: [number, number],
            rating: number,
            activeBrands: {
                id: number,
                name: string
            }[]
        ) => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            const abortController = new AbortController()
            abortControllerRef.current = abortController
            await fetchProduct(
                filters,
                priceRange,
                abortController.signal,
                rating,
                activeBrands
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchProduct]
    )

    useEffect(() => {
        if (loadMore > 0) {
            const abortController = new AbortController()
            const fetchDataLocal = async () => {
                await fetchProduct(
                    activeFilters,
                    priceRange,
                    abortController.signal,
                    rating,
                    activeBrands,
                    loadMore
                )
            }
            fetchDataLocal()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMore])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchProducts = useCallback(
        debounce((filters, priceRange, rating, activeBrands) => {
            fetchProductsWithDelay(filters, priceRange, rating, activeBrands)
        }, 500),
        [fetchProductsWithDelay]
    )

    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        setIsOpen(window.innerWidth > 1000)
    }, [])

    const toggleBrand = (id: number, name: string, textUrl: string) => {
        setActiveBrands((prevBrands: { id: number, name: string, textUrl: string, product_count: number }[]) => {
            const isBrandActive = prevBrands.some(brand => brand.id === id);
            const updatedBrands = isBrandActive
                ? prevBrands.filter(brand => brand.id !== id)
                : [...prevBrands, { id, name, textUrl }];

            debouncedFetchProducts(activeFilters, priceRange, rating, updatedBrands);
            return updatedBrands;
        });
    };

    return (
        <div
            className={'filter-box ' + (isOpenFilter ? 'active' : '')}
            style={isOpenFilter ? { display: 'none' } : {}}
            id="filter-catalog"
        >
            {getSortedActiveFilters().length > 0 || (activeBrands.length > 0 && !isBrandPage) ? (
                <div className="active-filter">
                    <div className="list">
                        {!isBrandPage ? activeBrands.map((item) => (
                            <div key={item.id} className="item">
                                {item.name}
                                <svg
                                    onClick={() =>
                                        toggleBrand(item.id, item.name, item.textUrl)
                                    }
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M13.3327 6.66667L6.66602 13.3333"
                                        stroke="#111111"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M6.66732 6.66667L13.334 13.3333"
                                        stroke="#111111"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        )) : ''}
                        {getSortedActiveFilters()?.map(
                            ([filterId, valueIds]) => (
                                <React.Fragment key={filterId}>
                                    {valueIds.map((valueId) => (
                                        <div key={valueId} className="item">
                                            {
                                                propertyFilter.data
                                                    .find(
                                                        (f) =>
                                                            f.id ===
                                                            parseInt(filterId)
                                                    )
                                                    ?.values.find(
                                                        (v) => v.id === valueId
                                                    )?.name
                                            }
                                            <svg
                                                onClick={() =>
                                                    handleFilterToggle(
                                                        parseInt(filterId),
                                                        valueId
                                                    )
                                                }
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M13.3327 6.66667L6.66602 13.3333"
                                                    stroke="#111111"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M6.66732 6.66667L13.334 13.3333"
                                                    stroke="#111111"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    ))}
                                </React.Fragment>
                            )
                        )}
                    </div>
                    <span
                        onClick={() => {
                            setActiveFilters({})
                            setActiveBrands([])
                            setRating(0)
                            setPriceRange([parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]);
                            debouncedFetchProducts({}, [parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)], 0, [])
                        }}
                        className="delete"
                    >
                        {translations[locale].catalog.filterBox.delete_all}
                    </span>
                </div>
            ) : (
                ''
            )}
            <div className="filter-list">
                {(propertyFilter?.brands?.length > 0 && !isBrandPage) ? (
                    <FilterBrands
                        clearFilter={() => {
                            setActiveFilters({})
                            setActiveBrands([])
                            setRating(0)
                            setPriceRange([parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]);
                            debouncedFetchProducts({}, [parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)], 0, [])
                        }}
                        locale={locale}
                        filterCountData={filterCountData}
                        activeBrands={activeBrands}
                        handleFilterToggle={toggleBrand}
                        filter={propertyFilter?.brands}
                    />
                ) : ''}
                {propertyFilter?.data?.map((filter) => {
                    return (
                        <FilterItem
                            clearFilter={() => {
                                setActiveFilters({})
                                setActiveBrands([])
                                setRating(0)
                                setPriceRange([parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]);
                                debouncedFetchProducts({}, [parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)], 0, [])
                            }}
                            locale={locale}
                            activeFilter={activeFilters[filter.id]}
                            handleFilterToggle={handleFilterToggle}
                            key={filter.id}
                            filter={filter}
                            filterCountData={filterCountData}
                        />
                    )
                })}
                <FilterItemPrice
                    sendFilterPrice={sendFilterPrice}
                    handlePriceRange={handlePriceRangeChange}
                    minPrice={parseInt(propertyFilter.min_price)}
                    maxPrice={parseInt(propertyFilter.max_price)}
                    filterPrice={filterPrice}
                />
                <div className="filter-list__item rating">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`title ${isOpen ? 'active' : ''}`}
                    >
                        <span>
                            {translations[locale].catalog.filterBox.rating}
                        </span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 7L10 13L16 7"
                                stroke="#111111"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                    <div
                        style={!isOpen ? { display: 'none' } : {}}
                        className={`list-box filter-modal-box ${isOpen ? 'active' : ''}`}
                    >
                        <span
                            className="close-modal"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 8L8 16"
                                    stroke="#111111"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 8L16 16"
                                    stroke="#111111"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <div className="back" onClick={() => setIsOpen(false)}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13 4L7 10L13 16"
                                    stroke="#111111"
                                    strokeWidth="1.5"
                                />
                            </svg>
                            {translations[locale].catalog.filterBox.back}
                        </div>
                        <div className="rating-list">
                            <div
                                className={`rating-list__item ${rating == 5 ? 'active' : ''}`}
                                onClick={() => sendFilterRating(5)}
                            >
                                <span className="star">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                </span>
                                <div className="name">
                                    {
                                        translations[locale].catalog
                                            .filterBox.star5
                                    }
                                </div>
                            </div>
                            <div
                                className={`rating-list__item ${rating == 4 ? 'active' : ''}`}
                                onClick={() => sendFilterRating(4)}
                            >
                                <span className="star">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                </span>
                                <div className="name">
                                    {
                                        translations[locale].catalog
                                            .filterBox.star4
                                    }
                                </div>
                            </div>
                            <div
                                className={`rating-list__item ${rating == 3 ? 'active' : ''}`}
                                onClick={() => sendFilterRating(3)}
                            >
                                <span className="star">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                </span>
                                <div className="name">
                                    {
                                        translations[locale].catalog.filterBox
                                            .star3
                                    }
                                </div>
                            </div>
                            <div
                                className={`rating-list__item ${rating == 2 ? 'active' : ''}`}
                                onClick={() => sendFilterRating(2)}
                            >
                                <span className="star">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                </span>
                                <div className="name">
                                    {
                                        translations[locale].catalog.filterBox
                                            .star2
                                    }
                                </div>
                            </div>
                            <div
                                className={`rating-list__item ${rating == 1 ? 'active' : ''}`}
                                onClick={() => sendFilterRating(1)}
                            >
                                <span className="star">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 3L12.7961 8.52786H18.6085L13.9062 11.9443L15.7023 17.4721L11 14.0557L6.29772 17.4721L8.09383 11.9443L3.39155 8.52786H9.20389L11 3Z"
                                            fill="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11 4.61803L12.3206 8.68237L12.4328 9.02786H12.7961H17.0696L13.6123 11.5398L13.3184 11.7533L13.4306 12.0988L14.7512 16.1631L11.2939 13.6512L11 13.4377L10.7061 13.6512L7.24877 16.1631L8.56936 12.0988L8.68162 11.7533L8.38772 11.5398L4.93039 9.02786H9.20389H9.56716L9.67942 8.68237L11 4.61803Z"
                                            stroke="#FFD028"
                                        />
                                    </svg>
                                </span>
                                <div className="name">
                                    {
                                        translations[locale].catalog.filterBox
                                            .star1
                                    }
                                </div>
                            </div>
                        </div>
                        <span
                            className="disable"
                            onClick={() => {
                                setActiveFilters({})
                                setActiveBrands([])
                                setRating(0)
                                setPriceRange([parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]);
                                debouncedFetchProducts({}, [parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)], 0, [])
                            }}
                        >
                            {
                                translations[locale].catalog.filterBox
                                    .abort_filter
                            }
                        </span>
                        <button
                            className="btn-black btn-filter"
                            onClick={() => setIsOpen(false)}
                        >
                            {translations[locale].catalog.filterBox.send_filter}
                        </button>
                    </div>
                </div>
            </div>
            <span
                className="clear-all"
                onClick={() => {
                    setActiveFilters({})
                    setActiveBrands([])
                    setRating(0)
                    setPriceRange([parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)]);
                    debouncedFetchProducts({}, [parseInt(propertyFilter.min_price), parseInt(propertyFilter.max_price)], 0, [])
                }}
            >
                {translations[locale].catalog.filterBox.clear_all}
            </span>
            <span
                className="close-modal"
                onClick={() => setIsOpenFilter(false)}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 8L8 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 8L16 16"
                        stroke="#111111"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <button
                className="btn-black btn-filter"
                onClick={() => setIsOpenFilter(false)}
            >
                {translations[locale].catalog.filterBox.all_product}
            </button>
        </div>
    )
}

export default FilterCatalog
