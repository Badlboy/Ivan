import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/hooks/useLang'
import { IBrand } from '@/models/IBrand'
import { API_URL_IMAGE } from '@/http/axiosConfig'

const regex = /https?:\/\//;
const BlockImage = React.memo(({
    locale,
    description,
    title,
    image,
    url
}: {
    locale: AllowedLangs
    description: string
    title: string
    image:string
    url:string
}) => {
    const { translations } = useLang();
    const href = regex.test(url) ? url : getLangSlug(locale) + `/shop/${url}`;
    const makeup = {
        __html: JSON.stringify(description)
    }
    return (
        <article className="section-block-image__bg">
            <section className="section-block-image box-content">
                <div className="left">
                    <h2>{title}</h2>
                    {/* <div dangerouslySetInnerHTML={makeup} /> */}
                    <Link
                        href={href}
                        className="btn-black big"
                    >
                        {translations[locale]?.main.link_all}
                    </Link>
                </div>
                <div className="right">
                    <Image
                        loading="lazy"
                        src={API_URL_IMAGE + image}
                        title={title}
                        alt={title}
                        width={710}
                        height={525}
                    />
                </div>
            </section>
        </article>
    )
})

BlockImage.displayName = 'BlockImage';

export default BlockImage
