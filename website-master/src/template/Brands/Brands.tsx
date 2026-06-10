'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBrand } from '@/models/IBrand'
import { getLangSlug } from '@/utils/function'
import Link from 'next/link'
import React, { useState } from 'react'

const Brands = ({
    pageData,
    locale,
}: {
    pageData: IBrand[]
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    const [activeLetter, setActiveLetter] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const groupedBrands = pageData.reduce(
        (acc, brand) => {
            const firstLetter = brand.name.charAt(0).toUpperCase()
            if (!acc[firstLetter]) {
                acc[firstLetter] = []
            }
            acc[firstLetter].push(brand)
            return acc
        },
        {} as { [key: string]: typeof pageData }
    )

    const filteredBrands = Object.keys(groupedBrands).reduce(
        (acc, letter) => {
            const filtered = groupedBrands[letter].filter((brand) =>
                brand.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            if (filtered.length > 0) {
                acc[letter] = filtered
            }
            return acc
        },
        {} as { [key: string]: IBrand[] }
    )

    const isEmpty = Object.keys(filteredBrands).length === 0

    return (
        <article>
            <section className="section-brands box-content">
                <div className="category-brands">
                    <div className="list-abc">
                        <span
                            onClick={() => setActiveLetter('')}
                            className={activeLetter == '' ? 'active' : ''}
                        >
                            {translations[locale].brands.all}
                        </span>
                        {Object.keys(filteredBrands).map((letter, index) => (
                            <span
                                onClick={() => setActiveLetter(letter)}
                                key={index}
                                className={
                                    activeLetter === letter ? 'active' : ''
                                }
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                    <div className="search">
                        <div
                            className={`input-text${searchQuery ? ' show' : ''} `}
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span>
                                {translations[locale].brands.search_brands}
                            </span>
                        </div>
                        <button>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse
                                    cx="9.3813"
                                    cy="9.16927"
                                    rx="6.04927"
                                    ry="5.83333"
                                    stroke="#111111"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M17.1589 16.6641L14.5664 14.1641"
                                    stroke="#111111"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="brands-list">
                    {isEmpty ? (
                        <span className="title-section text-h1 center empty-title">
                            {translations[locale].brands.empty}
                        </span>
                    ) : (
                        Object.keys(filteredBrands).map((letter, index) => {
                            if (
                                activeLetter !== '' &&
                                activeLetter !== letter
                            ) {
                                return null
                            }
                            return (
                                <div key={index} className="brands-list__item">
                                    <span className="simbol">{letter}</span>
                                    <div className="list">
                                        {filteredBrands[letter].map((brand) => (
                                            <Link
                                                href={
                                                    getLangSlug(locale) +
                                                    '/brands/' +
                                                    brand.slug
                                                }
                                                key={brand.id}
                                            >
                                                {brand.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </section>
        </article>
    )
}

export default Brands
