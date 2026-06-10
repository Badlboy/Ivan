import { AllowedLangs } from '@/constants/lang'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'
import { useLang } from '@/hooks/useLang'
import { API_URL_IMAGE } from '@/http/axiosConfig'
const regex = /https?:\/\//;

const Banner = React.memo(({ locale, banner_title,image,url }: { locale: AllowedLangs, banner_title: string,image:string,url:string }) => {
    const { translations } = useLang();
    
    const href = regex.test(url) ? url : getLangSlug(locale) + `/shop/${url}`;
    return (
        <article className='section-banner-article'>
            <section className="section-banner">
                <Image
                    src={API_URL_IMAGE + image}
                    title={banner_title ? banner_title : translations[locale].main.test_period}
                    alt={banner_title ? banner_title : translations[locale].main.test_period}
                    width={1440}
                    priority={true}
                    height={585}
                />
                <div className="box-content">
                    <div className="box">
                        <h1>{banner_title ? banner_title : translations[locale].main.test_period}</h1>
                        <Link
                            className="btn-black big"
                            href={href}
                        >
                            {translations[locale].main.title_link}
                        </Link>
                    </div>
                </div>
                <div className="box-content mobile-btn-banner">
                    <Link
                        className="btn-black big"
                        href={href}
                    >
                        {translations[locale].main.title_link}
                    </Link>
                </div>
            </section>
        </article>
    )
})

Banner.displayName = 'Banner';

export default Banner
