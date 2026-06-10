import { IProdust } from '@/models/IProduct'
import React from 'react'
import ProductsSlider from './Sliders/ProductsSlider'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'

const NewsProduct = React.memo(({
    locale,
    products_hit,
    products_new,
    favorites,
}: {
    favorites: number[]
    locale: AllowedLangs
    products_hit: IProdust[]
    products_new: IProdust[]
}) => {
    const { translations } = useLang()
    return (
        <article className="section-products-article">
            {products_hit?.length > 0 ? (
                <ProductsSlider
                    index={'product_2'}
                    locale={locale}
                    favorites={favorites}
                    products={products_hit}
                    title={translations[locale].main.title_hit}
                    link={`${getLangSlug(locale)}/shop`}
                />
            ) : (
                ''
            )}
            <section className="section-products-sliders section-tabs-info box-content">
                <div className="section-tabs-info__item">
                    <div className="title">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.51682 14.0584C7.41955 14.736 7.07927 15.356 6.55846 15.8045C6.03766 16.253 5.37132 16.5 4.68182 16.5C3.99232 16.5 3.32597 16.253 2.80517 15.8045C2.28437 15.356 1.94408 14.736 1.84682 14.0584H1V4.31218C1 4.09678 1.0862 3.89019 1.23964 3.73788C1.39308 3.58557 1.60119 3.5 1.81818 3.5H13.2727C13.4897 3.5 13.6978 3.58557 13.8513 3.73788C14.0047 3.89019 14.0909 4.09678 14.0909 4.31218V5.93654H16.5455L19 9.23075V14.0584H17.335C17.2377 14.736 16.8974 15.356 16.3766 15.8045C15.8558 16.253 15.1895 16.5 14.5 16.5C13.8105 16.5 13.1442 16.253 12.6234 15.8045C12.1026 15.356 11.7623 14.736 11.665 14.0584H7.51682ZM12.8636 4.72336H2.22727V12.033C2.97832 11.281 3.35686 11.0904 3.79553 10.9486C4.23419 10.8068 4.70088 10.7724 5.15585 10.8481C5.61083 10.9239 6.04063 11.1077 6.40868 11.3838C6.77673 11.6599 7.19389 12.1853 7.41761 12.8452L11.7577 12.8421C11.8762 12.3536 12.2956 11.7138 12.8636 11.3134V4.72336ZM14.0909 10.8096H17.7727V9.76598L15.7207 7.15482H14.0909V10.8096ZM16.1311 13.6447C16.1311 14.5418 15.3985 15.269 14.4948 15.269C13.591 15.269 12.8584 14.5418 12.8584 13.6447C12.8584 12.7475 13.591 12.0203 14.4948 12.0203C15.3985 12.0203 16.1311 12.7475 16.1311 13.6447ZM4.68129 15.269C5.58502 15.269 6.31765 14.5418 6.31765 13.6447C6.31765 12.7475 5.58502 12.0203 4.68129 12.0203C3.77755 12.0203 3.04492 12.7475 3.04492 13.6447C3.04492 14.5418 3.77755 15.269 4.68129 15.269Z"
                                fill="#111111"
                            />
                        </svg>
                        {translations[locale].main.product_info.title1}
                    </div>
                    <div className="text">
                        {translations[locale].main.product_info.description1}
                    </div>
                </div>
                <div className="section-tabs-info__item">
                    <div className="title">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.49935 8.33329L10.0908 10.2769C10.5093 10.5907 11.0989 10.529 11.4434 10.1354L16.666 4.16663"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M17.5 10C17.5 11.5671 17.0091 13.0948 16.0964 14.3686C15.1836 15.6424 13.8947 16.5983 12.4108 17.102C10.9269 17.6057 9.32246 17.632 7.82287 17.1771C6.32327 16.7222 5.00383 15.809 4.04985 14.5657C3.09587 13.3225 2.55529 11.8116 2.50402 10.2454C2.45274 8.67916 2.89336 7.1362 3.76398 5.83322C4.6346 4.53025 5.89149 3.53271 7.35812 2.98071C8.82476 2.4287 10.4275 2.34997 11.9411 2.75556"
                                stroke="#111111"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        {translations[locale].main.product_info.title2}
                    </div>
                    <div className="text">
                        {translations[locale].main.product_info.description2}
                    </div>
                </div>
                <div className="section-tabs-info__item">
                    <div className="title">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16.666 4.99996L17.1963 5.53029L17.7267 4.99996L17.1963 4.46963L16.666 4.99996ZM3.41602 9.16663C3.41602 9.58084 3.7518 9.91663 4.16602 9.91663C4.58023 9.91663 4.91602 9.58084 4.91602 9.16663L3.41602 9.16663ZM13.863 8.86362L17.1963 5.53029L16.1357 4.46963L12.8024 7.80296L13.863 8.86362ZM17.1963 4.46963L13.863 1.1363L12.8024 2.19696L16.1357 5.53029L17.1963 4.46963ZM16.666 4.24996L8.16602 4.24996L8.16602 5.74996L16.666 5.74996V4.24996ZM3.41602 8.99996V9.16663L4.91602 9.16663V8.99996L3.41602 8.99996ZM8.16602 4.24996C5.54266 4.24996 3.41602 6.37661 3.41602 8.99996L4.91602 8.99996C4.91602 7.20503 6.37109 5.74996 8.16602 5.74996L8.16602 4.24996Z"
                                fill="#111111"
                            />
                            <path
                                d="M3.33398 15L2.80365 14.4697L2.27332 15L2.80365 15.5304L3.33398 15ZM16.584 10.8334C16.584 10.4192 16.2482 10.0834 15.834 10.0834C15.4198 10.0834 15.084 10.4192 15.084 10.8334L16.584 10.8334ZM6.13699 11.1364L2.80365 14.4697L3.86431 15.5304L7.19765 12.197L6.13699 11.1364ZM2.80365 15.5304L6.13699 18.8637L7.19765 17.803L3.86431 14.4697L2.80365 15.5304ZM3.33398 15.75L11.834 15.75L11.834 14.25L3.33398 14.25L3.33398 15.75ZM16.584 11V10.8334L15.084 10.8334V11L16.584 11ZM11.834 15.75C14.4573 15.75 16.584 13.6234 16.584 11L15.084 11C15.084 12.795 13.6289 14.25 11.834 14.25L11.834 15.75Z"
                                fill="#111111"
                            />
                        </svg>
                        {translations[locale].main.product_info.title3}
                    </div>
                    <div className="text">
                        {translations[locale].main.product_info.description3}
                    </div>
                </div>
            </section>
            {products_new?.length > 0 ? (
                <ProductsSlider
                    index={'product_1'}
                    favorites={favorites}
                    locale={locale}
                    products={products_new}
                    title={translations[locale].main.title_new}
                    link={`${getLangSlug(locale)}/shop?sort=news`}
                />
            ) : (
                ''
            )}
        </article>
    )
})

NewsProduct.displayName = 'NewsProduct';

export default NewsProduct
