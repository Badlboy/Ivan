'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IFilterCountData, PropertiesCount, PropertiesListFilter } from '@/models/IProduct'
import productsService from '@/services/productService'
import React, { useEffect, useState } from 'react'

const FilterItem = ({
    clearFilter,
    locale,
    activeFilter,
    filter,
    handleFilterToggle,
    filterCountData = {} as IFilterCountData
}: {
    clearFilter: any
    locale: AllowedLangs
    activeFilter: number[]
    filter: PropertiesListFilter
    handleFilterToggle: any,
    filterCountData?: IFilterCountData,
}) => {
    const { translations } = useLang()
    const [isOpen, setIsOpen] = useState(false)
    const [countProduct, setCountProduct] = useState<PropertiesCount>({})

    useEffect(() => {
        fetchData()
        setIsOpen(window.innerWidth > 1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function fetchData() {
        try {
            const response = await productsService.fetchGetCountProductPropertyFilter(filter.id, filterCountData, false)
            setCountProduct(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    return (
        <div className="filter-list__item">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`title ${isOpen ? 'active' : ''}`}
            >
                <span>
                    {filter.name}
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
                className={`list-box filter-modal-box ${filter.values.length > 8 ? 'scroll' : ''} ${isOpen ? 'active' : ''}`}
            >
                <span className="close-modal" onClick={() => setIsOpen(false)}>
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
                <div className="list">
                    {filter.values.map((item) => (
                        <div key={item.id} className="input-checkbox">
                            <input
                                type="checkbox"
                                name={`filter_box_${filter.id}`}
                                id={`filter_val_${item.id}`}
                                onChange={() =>
                                    handleFilterToggle(filter.id, item.id)
                                }
                                checked={(activeFilter || []).includes(item.id)}
                            />
                            <label htmlFor={`filter_val_${item.id}`}>
                                {item.name}
                                {countProduct[item.id]?.count == 0 || countProduct[item.id]?.count > 0 ? <span>({countProduct[item.id]?.count})</span> : ''}
                            </label>
                        </div>
                    ))}
                </div>
                <span
                    className="disable"
                    onClick={() => {
                        clearFilter()
                        setIsOpen(false)
                    }}
                >
                    {translations[locale].catalog.filterBox.abort_filter}
                </span>
                <button
                    className="btn-black btn-filter"
                    onClick={() => setIsOpen(false)}
                >
                    {translations[locale].catalog.filterBox.use_filter}
                </button>
            </div>
        </div>
    )
}

export default FilterItem
