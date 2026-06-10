'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import React, { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { Form, Formik } from 'formik'
import Input from '@/components/Form/Input'
import productsService from '@/services/productService'
import { IProdust } from '@/models/IProduct'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'
import Loader from '@/components/Loader'

const SearchModal = React.memo(({
    isOpen,
    locale,
    modalSearchBtnRef,
    modalSearchBtnRef2,
    setIsOpen,
}: {
    isOpen: boolean
    locale: AllowedLangs
    modalSearchBtnRef: React.RefObject<HTMLDivElement>
    modalSearchBtnRef2: React.RefObject<HTMLDivElement>
    setIsOpen: any
}) => {
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [listResult, setListResult] = useState<IProdust[]>([])
    const [textSearch, setTextSearch] = useState<string>('')
    const [isEmpty, setIsEmpty] = useState<boolean>(false)
    const { translations } = useLang()
    const initialValues = {
        q: '',
    }

    const modalRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node) &&
            modalSearchBtnRef.current &&
            !modalSearchBtnRef.current.contains(event.target as Node) &&
            modalSearchBtnRef2.current &&
            !modalSearchBtnRef2.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const SignupSchema = Yup.object().shape({
        q: Yup.string()
            .min(3, translations[locale].errors.search)
            .required(translations[locale].errors.required),
    })

    async function onSubmit(values: typeof initialValues) {
        const searchQuery = values.q
        setTextSearch(searchQuery);
        setIsEmpty(false)
        setLoading(true)

        try {
            const response = await productsService.fetchProductSearch(searchQuery, locale, 8)
            setListResult(response.data.data)
            setIsEmpty(response.data.data.length == 0);
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const performSearch = async (query: string) => {
        setIsEmpty(false)
        setLoading(true)
        try {
            const response = await productsService.fetchProductSearch(query, locale, 8)
            setListResult(response.data.data)
            setIsEmpty(response.data.data.length == 0);
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setTextSearch(query)

        if (query.length >= 3) {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

            searchTimeoutRef.current = setTimeout(() => {
                performSearch(query)
            }, 100)
        } else {
            setListResult([])
        }
    }

    return (
        <div
            ref={modalRef}
            className="search-modal"
            id="search-modal"
            style={isOpen ? {} : { display: 'none' }}
        >
            <div className="box-content">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={SignupSchema}
                    onSubmit={onSubmit}
                >
                    {({ values, errors, setFieldValue, isSubmitting }) => (
                        <Form className="right">
                            <Input
                                name="q"
                                label={translations[locale].search.input}
                                type="text"
                                value={values.q}
                                onChange={handleInputChange}
                            />
                            <span className='clearSearch' onClick={() => { setFieldValue('q', ''); setTextSearch(''); setListResult([]); }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8L8 16" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 8L16 16" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <button
                                className="btn-white-border"
                                disabled={isSubmitting}
                            >
                                {translations[locale].search.btn}
                            </button>
                        </Form>
                    )}
                </Formik>
                {loading ? <Loader /> : listResult.length > 0 ? (
                    <div className='search-modal-result'>
                        <div className='list'>
                            {listResult.slice(0, 7).map((item) =>
                                <ListItem
                                    key={item.id}
                                    item={item}
                                    query={textSearch}
                                    locale={locale}
                                    setIsOpen={setIsOpen}
                                />
                            )}
                        </div>
                        {listResult.length > 7 ? (
                            <div className='all'>
                                <Link onClick={() => setIsOpen(false)} href={`${getLangSlug(locale)}/shop/search/?q=${textSearch}`}>{translations[locale].search.all_btn}</Link>
                            </div>
                        ) : ''}
                    </div>
                ) : isEmpty && textSearch.length > 2 ? <div className='search-modal-result'>{translations[locale].catalog.empty}</div> : ''}
            </div>
        </div>
    )
})

SearchModal.displayName = 'SearchModal';

interface ListItemProps {
    item: {
        id: number
        title: string
        slug: string
        category?: {
            slug: string
        }
        variations: { code: string }[]
    }
    query: string
    locale: AllowedLangs
    setIsOpen: (isOpen: boolean) => void
}

const ListItem: React.FC<ListItemProps> = ({ item, query, locale, setIsOpen }) => {
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const highlightText = (text: string, highlight: string) => {
        const escapedHighlight = escapeRegExp(highlight)
        const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'))

        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={index} style={{ color: '#111' }}>{part}</span>
                    ) : (
                        part
                    )
                )}
            </>
        )
    }

    return (
        <Link
            key={item.id}
            onClick={() => setIsOpen(false)}
            href={`${getLangSlug(locale)}/shop/${item.category?.slug}/${item.slug}-var-${item.variations[0].code}`}
        >
            {highlightText(item.title, query)}
        </Link>
    )
}

export default SearchModal