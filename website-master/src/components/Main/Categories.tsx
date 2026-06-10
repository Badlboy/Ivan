import { AllowedLangs } from '@/constants/lang'
import { IMainPageProductInfo } from '@/models/IPage'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { getLangSlug } from '@/utils/function'
import { useLang } from '@/hooks/useLang'

const Categories = React.memo(({
    categories,
    locale,
}: {
    categories: IMainPageProductInfo[]
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    if (categories?.length == 0) {
        return ''
    }
    return (
        <article>
            <section className="section-category box-content">
                <h2>{translations[locale].main.title_category}</h2>
                <div className="category-list">
                    {categories?.map((item, index) => {
                        if (item.image) {
                            return (
                                <Link
                                    href={`${getLangSlug(locale)}/shop${item.slug.slug ? '/' + item.slug.slug : ''}`}
                                    key={item.slug.id}
                                    className="category-list__item"
                                >
                                    <div>
                                        <span className="title text-h3">
                                            {item.name}
                                        </span>
                                        <span
                                            className="btn-black big"
                                        >
                                            {
                                                translations[locale].main
                                                    .title_link
                                            }
                                        </span>
                                    </div>
                                    <Image
                                        loading="lazy"
                                        src={API_URL_IMAGE + item.image}
                                        title={item.name}
                                        alt={item.name + ' - #' + index}
                                        width={640}
                                        height={325}
                                    />
                                </Link>
                            )
                        }

                        return (
                            <Link
                                href={`${getLangSlug(locale)}/shop${item.slug.slug ? '/' + item.slug.slug : ''}`}
                                key={item.slug.id}
                                className="category-list__item all"
                            >
                                <span className="title text-h3">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </article>
    )
})

Categories.displayName = 'Categories';

export default Categories
