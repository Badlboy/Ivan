'use client'
import ProductCard from '@/components/Card/ProductCard'
import ModalBuyOneClick from '@/components/Modal/ModalBuyOneClick'
import ModalSunscription from '@/components/Modal/ModalSunscription'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IProdust } from '@/models/IProduct'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Navigation } from 'swiper/modules'

interface ModalSlider {
    product: number
    variation: number
}

const ProductsSlider = React.memo(({
    index,
    locale,
    products,
    title,
    link,
    favorites,
}: {
    index: string
    favorites: number[]
    locale: AllowedLangs
    products: IProdust[]
    title: string
    link: string
}) => {
    const uniqueId = index
    const [isOpenBuyOneClick, setIsOpenBuyOneClick] = useState<boolean>(false)
    const [isOpenModalSunscription, setIsOpenModalSunscription] =
        useState<boolean>(false)
    const [activeProduct, setActiveProduct] = useState<ModalSlider>(
        {} as ModalSlider
    )

    const handleActiveProduct = (product: number, variation: number) => {
        setActiveProduct({
            product: product,
            variation: variation,
        })
        setIsOpenBuyOneClick(true)
    }

    const { translations } = useLang()

    return (
        <section className="section-products-sliders">
            <div className="title-box box-content">
                <h2>{title}</h2>
                {link ? (
                    <a href={link}>{translations[locale].main.link_all}</a>
                ) : (
                    ''
                )}
            </div>
            <div className="swiper-container box-content products-slider-js">
                <Swiper
                    className="splide__list"
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={5}
                    navigation={{
                        prevEl: '.swiper-button-prev-' + uniqueId,
                        nextEl: '.swiper-button-next-' + uniqueId,
                    }}
                    breakpoints={{
                        1200: {
                            slidesPerView: 5,
                        },
                        1100: {
                            slidesPerView: 4,
                        },
                        900: {
                            slidesPerView: 3,
                        },
                        300: {
                            slidesPerView: 2,
                            spaceBetween: 5
                        },
                    }}
                >
                    {products?.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard
                                locale={locale}
                                favorites={favorites}
                                {...product}
                                hendleActiveProduct={handleActiveProduct}
                                setIsOpenModalSunscription={
                                    setIsOpenModalSunscription
                                }
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="swiper-arrow-box">
                    <div className={'swiper-button-prev-' + uniqueId}>
                        <CustomPrevArrow />
                    </div>
                    <div className={'swiper-button-next-' + uniqueId}>
                        <CustomNextArrow />
                    </div>
                </div>
            </div>
            {isOpenBuyOneClick ? (
                <ModalBuyOneClick
                    setIsOpenBuyOneClick={setIsOpenBuyOneClick}
                    isOpenBuyOneClick={isOpenBuyOneClick}
                    locale={locale}
                    product={activeProduct.product}
                    product_variation={activeProduct.variation}
                />
            ) : (
                ''
            )}
            {isOpenModalSunscription ? (
                <ModalSunscription
                    setIsOpenModalSunscription={setIsOpenModalSunscription}
                    isOpenModalSunscription={isOpenModalSunscription}
                    locale={locale}
                />
            ) : (
                ''
            )}
        </section>
    )
})

ProductsSlider.displayName = 'ProductsSlider';

export default ProductsSlider

const CustomPrevArrow = React.memo(() => {
    return (
        <button aria-label="Prev" className="swiper-button-prev slick-arrow">
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13 4L7 10L13 16"
                    stroke="#111111"
                    strokeWidth="1.5"
                ></path>
            </svg>
        </button>
    )
})
CustomPrevArrow.displayName = 'CustomPrevArrow';

const CustomNextArrow = React.memo(() => {
    return (
        <button aria-label="Next" className="swiper-button-next slick-arrow">
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 4L13 10L7 16"
                    stroke="#111111"
                    strokeWidth="1.5"
                ></path>
            </svg>
        </button>
    )
})
CustomNextArrow.displayName = 'CustomNextArrow';
