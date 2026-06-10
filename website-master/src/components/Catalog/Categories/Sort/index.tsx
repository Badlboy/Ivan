import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { PropertiesListFilterData } from '@/models/IProduct'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

const SortCatalog = ({
    locale,
    activeSort,
    sales = false
}: {
    locale: AllowedLangs
    activeSort: string,
    sales: boolean
}) => {
    const { translations } = useLang()
    const [isOpen, setIsOpen] = useState(true)

    const modalRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            setIsOpen(true)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className="sort" ref={modalRef}>
            <span>{translations[locale].catalog.sort.sort_active}:</span>
            <div className="input-list-drop">
                <span
                    className={`title ${!isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>
                        {activeSort === 'hits'
                            ? translations[locale].catalog.sort.popular
                            : activeSort === 'price_desc'
                                ? translations[locale].catalog.sort.price_desc
                                : activeSort === 'title'
                                    ? translations[locale].catalog.sort.title
                                    : activeSort === 'newest'
                                        ? translations[locale].catalog.sort.newest
                                        : translations[locale].catalog.sort.price_asc}
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
                </span>
                <div
                    className="list"
                    style={!isOpen ? {} : { display: 'none' }}
                >
                    <Link onClick={() => setIsOpen(true)} href={{ pathname: '', query: { sort: 'price_asc', ...(sales && { sales: 'sales' }) } }}>
                        {translations[locale].catalog.sort.price_asc}
                    </Link>
                    <Link onClick={() => setIsOpen(true)} href={{ pathname: '', query: { sort: 'price_desc', ...(sales && { sales: 'sales' }) } }}>
                        {translations[locale].catalog.sort.price_desc}
                    </Link>
                    <Link onClick={() => setIsOpen(true)} href={{ pathname: '', query: { sort: 'title', ...(sales && { sales: 'sales' }) } }}>
                        {translations[locale].catalog.sort.title}
                    </Link>
                    <Link onClick={() => setIsOpen(true)} href={{ pathname: '', query: { sort: 'newest', ...(sales && { sales: 'sales' }) } }}>
                        {translations[locale].catalog.sort.newest}
                    </Link>
                    <Link onClick={() => setIsOpen(true)} href={{ pathname: '', query: { sort: 'hits', ...(sales && { sales: 'sales' }) } }}>
                        {translations[locale].catalog.sort.popular}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SortCatalog
