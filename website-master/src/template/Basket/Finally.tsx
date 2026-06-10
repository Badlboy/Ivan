'use client'
import React from 'react'
import Link from 'next/link'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { IContact } from '@/models/IPage'
import { useLang } from '@/hooks/useLang'

const BasketFinally = ({
    locale,
    contact,
    order
}: {
    locale: AllowedLangs
    contact: IContact
    order: number
}) => {
    const { translations } = useLang()
    return (
        <article>
            <section className="section-order-product-success box-content">
                <svg
                    width="89"
                    height="88"
                    viewBox="0 0 89 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M33.4987 36.6667L45.4019 45.5941C46.9606 46.7631 49.157 46.5334 50.4401 45.067L73.832 18.3333"
                        stroke="#111111"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M77.5 44C77.5 50.8951 75.3402 57.6171 71.3239 63.2218C67.3077 68.8265 61.6367 73.0323 55.1075 75.2487C48.5783 77.4651 41.5188 77.5806 34.9206 75.579C28.3224 73.5775 22.5168 69.5594 18.3193 64.0891C14.1218 58.6189 11.7433 51.9712 11.5177 45.0797C11.2921 38.1883 13.2308 31.3993 17.0615 25.6662C20.8922 19.9331 26.4226 15.5439 32.8757 13.1151C39.3289 10.6863 46.3808 10.3399 53.041 12.1244"
                        stroke="#111111"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <h3>{contact?.title_order}</h3>
                <p>{contact?.description_order}</p>
                <span className='order-number'>{translations[locale].basket.title}  #{order}</span>
                <Link
                    href={getLangSlug(locale) + '/'}
                    className="btn-black"
                >
                    {translations[locale].order.main_link}
                </Link>
            </section>
        </article>
    )
}

export default BasketFinally
