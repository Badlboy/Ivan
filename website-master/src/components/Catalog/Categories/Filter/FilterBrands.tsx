'use client'
import Input from '@/components/Form/Input'
import * as Yup from 'yup'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { IFilterCountData, PropertiesCount } from '@/models/IProduct'
import productsService from '@/services/productService'

const FilterBrands = ({
    clearFilter,
    locale,
    activeBrands,
    filter,
    handleFilterToggle,
    filterCountData = {} as IFilterCountData
}: {
    clearFilter: any
    locale: AllowedLangs
    activeBrands: {
        id: number,
        name: string
        textUrl: string,
    }[]
    filter: {
        id: number,
        name: string,
        textUrl: string,
    }[]
    handleFilterToggle: any
    filterCountData?: IFilterCountData
}) => {
    const { translations } = useLang()
    const [isOpen, setIsOpen] = useState(false)
    const [filteredBrands, setFilteredBrands] = useState(filter);
    const [countProduct, setCountProduct] = useState<PropertiesCount>({})

    useEffect(() => {
        fetchData()
        setIsOpen(window.innerWidth > 1000)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function fetchData() {
        try {
            const response = await productsService.fetchGetCountProductPropertyFilter(1, filterCountData, true)
            setCountProduct(response.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const initialValues = {
        search: '',
    }
    const SignupSchema = Yup.object().shape({
        search: Yup.string()
    })

    const onSubmit = (values: typeof initialValues) => {
        const { search } = values;
        const updatedBrands = filter.filter((brand) =>
            brand.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBrands(updatedBrands);
    };

    return (
        <div className="filter-list__item">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`title ${isOpen ? 'active' : ''}`}
            >
                <span>
                    {translations[locale].menu.brands}
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
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, isSubmitting }) => (
                        <Form className="search-box">
                            <Input
                                name="search"
                                label={translations[locale].form.search_filter}
                                type="text"
                                value={
                                    values.search
                                }
                            />
                            <button className="search-box--btn">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="9.3813" cy="9.16927" rx="6.04927" ry="5.83333" stroke="#111111" strokeWidth="1.5" />
                                    <path d="M17.1609 16.6641L14.5684 14.1641" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="list brands">
                    {filteredBrands.length > 0 ? filteredBrands.map((item) => (
                        <div key={item.id} className="input-checkbox">
                            <input
                                type="checkbox"
                                name={`filter_box_brands`}
                                id={`filter_val_brands_${item.id}`}
                                onChange={() =>
                                    handleFilterToggle(item.id, item.name, item.textUrl)
                                }
                                checked={activeBrands.some(filter => filter.id === item.id)}
                            />
                            <label htmlFor={`filter_val_brands_${item.id}`}>
                                {item.name}
                                {countProduct[item.id]?.count == 0 || countProduct[item.id]?.count > 0 ? <span>({countProduct[item.id]?.count})</span> : ''}
                            </label>
                        </div>
                    )) : <span className='empty'>{translations[locale].form.search_filter_empty}</span>}
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

export default FilterBrands
