'use client'
import { IBrand } from '@/models/IBrand'
import React from 'react'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'
import { AllowedLangs } from '@/constants/lang'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Navigation } from 'swiper/modules'

const Brands = React.memo(({
    locale,
    pageBrands,
}: {
    locale: AllowedLangs
    pageBrands: IBrand[]
}) => {
    return (
        <article>
            <section className="section-list-brands box-content">
                <div id="brands" className="splide">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={6}
                        navigation={{
                            prevEl: '.swiper-button-prev-brands',
                            nextEl: '.swiper-button-next-brands',
                        }}
                        modules={[Navigation]}
                        breakpoints={{
                            1440: {
                                slidesPerView: 6,
                                spaceBetween: 70,
                            },
                            850: {
                                slidesPerView: 5,
                            },
                            300: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {pageBrands.map((item) => {
                            if (item.image) {
                                return (
                                    <SwiperSlide
                                        key={item.id}
                                        className="section-list-brands__item"
                                    >
                                        <Link
                                            href={
                                                getLangSlug(locale) +
                                                '/brands/' +
                                                item.slug
                                            }
                                            title={item.name}
                                        >
                                            <Image src={API_URL_IMAGE +
                                                item.image} alt={item.name} quality={100} sizes="100vw" width={130}
                                                height={50} />
                                        </Link>
                                    </SwiperSlide>
                                )
                            }
                            return null
                        })}
                    </Swiper>
                    <div className="swiper-arrow-box">
                        <div className={'swiper-button-prev-brands'}>
                            <CustomPrevArrow />
                        </div>
                        <div className={'swiper-button-next-brands'}>
                            <CustomNextArrow />
                        </div>
                    </div>
                </div>
            </section>
        </article>
    )
})

Brands.displayName = 'Brands';

export default Brands

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