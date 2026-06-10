import { IAboutUs } from '@/models/IPage'
import React from 'react'
import Image from 'next/image'
import AboutUsForm from './AboutUsForm'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'
import Link from 'next/link'
import { useLang } from '@/hooks/useLang'

const AboutUs = ({
    locale,
    pageData,
}: {
    locale: AllowedLangs
    pageData: IAboutUs
}) => {
    const { translations } = useLang()
    return (
        <article className="section-about-us box-content">
            <section className="preview-block">
                <div
                    className="left"
                    dangerouslySetInnerHTML={{
                        __html: pageData.description,
                    }}
                ></div>
                <div className="right">
                    {pageData.image ? (
                        <Image
                            src={API_URL_IMAGE + pageData.image}
                            alt={pageData.title}
                            width={640}
                            height={340}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </section>
            <section className="advantages-block">
                <h2>{pageData.title2}</h2>
                {pageData?.elements?.length ? (
                    <div className="steps-block-list">
                        {pageData.elements.map((item, index) => (
                            <div key={index} className="steps-block-item">
                                <span className="title">
                                    <span>{index + 1}</span>
                                    <span>{item.name}</span>
                                </span>
                                <span className="text">{item.description}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    ''
                )}
                <div
                    dangerouslySetInnerHTML={{
                        __html: pageData.description2,
                    }}
                ></div>
            </section>
            <section className="form-block">
                <div className="left">
                    <h2>{pageData.title3}</h2>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: pageData.description3,
                        }}
                    ></div>
                    <p className="gray">
                        {translations[locale].page.aboutus.form_text}{' '}
                    </p>
                    <span>
                        {translations[locale].page.aboutus.form_text2}{' '}
                        {pageData.phone ? (
                            <Link href={'tel:+' + pageData.phone.replace(/\D/g, '')}>
                                {pageData.phone}
                            </Link>
                        ) : (
                            ''
                        )}
                    </span>
                </div>
                <div className="right">
                    <AboutUsForm locale={locale} />
                </div>
            </section>
        </article>
    )
}

export default AboutUs
