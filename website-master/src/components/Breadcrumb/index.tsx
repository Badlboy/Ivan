import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { getLangSlug } from '@/utils/function'
import Link from 'next/link'
import React from 'react'

const Breadcrumb = ({
    thisTitle,
    breadcrumbList = [],
    box = true,
    locale,
    isProfilePage = false
}: {
    thisTitle: string
    breadcrumbList: IBreadcrumb[]
    box?: boolean
    locale: AllowedLangs
    isProfilePage?: boolean
}) => {
    const { translations } = useLang()
    let url = getLangSlug(locale)
    if (box) {
        return (
            <article className={"section-title-page-box box-content" + (isProfilePage ? ' profile' : '')}>
                <section
                    className="breadcrumb"
                    itemScope
                    itemType="http://schema.org/BreadcrumbList"
                >
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <Link href={getLangSlug(locale) + '/'} itemProp="item">
                            <span itemProp="name">
                                {translations[locale].breadcrumb.main}
                            </span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </span>
                    {breadcrumbList?.map((item, index) => {
                        url += '/' + item.slug
                        return (
                            <span
                                key={item.id}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <Link itemProp="item" href={url}>
                                    <span itemProp="name">/ {item.title}</span>
                                </Link>
                                <meta
                                    itemProp="position"
                                    content={(index + 2).toString()}
                                />
                            </span>
                        )
                    })}
                    <span
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <span itemProp="item">
                            <span itemProp="name">/ {thisTitle}</span>
                        </span>
                        <meta
                            itemProp="position"
                            content={(breadcrumbList.length + 2).toString()}
                        />
                    </span>
                </section>
            </article>
        )
    }

    return (
        <section
            className="breadcrumb"
            itemScope
            itemType="http://schema.org/BreadcrumbList"
        >
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <Link href={getLangSlug(locale) + '/'} itemProp="item">
                    <span itemProp="name">
                        {translations[locale].breadcrumb.main}
                    </span>
                    <meta itemProp="position" content="1" />
                </Link>
            </span>
            {breadcrumbList?.map((item, index) => {
                url += '/' + item.slug
                return (
                    <span
                        key={item.id}
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                    >
                        <Link href={url} itemProp="item">
                            <span itemProp="name">/ {item.title}</span>
                        </Link>
                        <meta
                            itemProp="position"
                            content={(index + 2).toString()}
                        />
                    </span>
                )
            })}
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <span itemProp="item">
                    <span itemProp="name">/ {thisTitle}</span>
                </span>
                <meta
                    itemProp="position"
                    content={(breadcrumbList.length + 2).toString()}
                />
            </span>
        </section>
    )
}

export default Breadcrumb
