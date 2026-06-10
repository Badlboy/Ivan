import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { IDeliveryAndPayment } from '@/models/IPage'
import Image from 'next/image'
import React from 'react'

const DeliveryPayment = ({
    pageData,
    locale,
}: {
    pageData: IDeliveryAndPayment
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    return (
        <article>
            <section className="section-page-info box-content">
                <div className="section-page-info__box">
                    <div className="box-content__mini">
                        <h2>{pageData.title2}</h2>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: pageData.description,
                            }}
                        ></div>
                    </div>
                    {pageData?.elements?.length && (
                        <div className="deliver-list">
                            {pageData.elements.map((item, index) => (
                                <div key={index} className="deliver-list__item">
                                    {item.image ? (
                                        <Image
                                            src={API_URL_IMAGE + item.image}
                                            alt={item.name}
                                            width={110}
                                            height={40}
                                        />
                                    ) : (
                                        ''
                                    )}

                                    <span className="title">{item.name}</span>
                                    <div className="desc">
                                        <div>
                                            <span>
                                                {
                                                    translations[locale].page
                                                        .other.cost
                                                }
                                                :
                                            </span>
                                            <span>{item.price}</span>
                                        </div>
                                        <div>
                                            <span>
                                                {
                                                    translations[locale].page
                                                        .other.time
                                                }
                                                :
                                            </span>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        className="box-content__mini"
                        dangerouslySetInnerHTML={{
                            __html: pageData.description2,
                        }}
                    ></div>
                </div>
                <div className="section-page-info__box box-content__mini">
                    <h2>{pageData.title3}</h2>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: pageData.description3,
                        }}
                    ></div>
                </div>
            </section>
        </article>
    )
}

export default DeliveryPayment
