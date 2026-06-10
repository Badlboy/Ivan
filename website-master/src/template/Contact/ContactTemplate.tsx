import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IContact } from '@/models/IPage'
import Link from 'next/link'
import React from 'react'

const ContactTemplate = ({ contentData, locale }: { contentData: IContact, locale: AllowedLangs }) => {
    const { translations } = useLang()
    return (
        <article>
            <section className="section-page-info box-content">
                <div
                    className="section-page-info__box section-contact box-content__mini"
                >
                    {contentData?.address ? (
                        <div className='contact-box'>
                            <span className='title'>{translations[locale].page.contact.address}</span>
                            {contentData?.address_link ? (
                                <a className='address' href={contentData?.address_link}>{contentData?.address}</a>
                            ) : <span className='address'>{contentData?.address}</span>}
                        </div>
                    ) : ""}
                    {contentData?.phone1 || contentData?.phone2 ? (
                        <div className='contact-box'>
                            <span className='title'>{translations[locale].page.contact.phone}</span>
                            {contentData?.phone1 && (
                                <Link
                                    href={'tel:+' + contentData.phone1.replace(/\D/g, '')}
                                >
                                    {contentData.phone1}
                                </Link>
                            )}
                            {contentData?.phone2 && (
                                <Link
                                    href={'tel:+' + contentData.phone2.replace(/\D/g, '')}
                                >
                                    {contentData.phone2}
                                </Link>
                            )}
                        </div>
                    ) : ""}
                    {contentData?.email ? (
                        <div className='contact-box'>
                            <span className='title'>{translations[locale].page.contact.email}</span>
                            <Link
                                href={'mailto:' + contentData.email}
                            >
                                {contentData.email}
                            </Link>
                        </div>
                    ) : ""}
                </div>
            </section>
        </article>
    )
}

export default ContactTemplate
