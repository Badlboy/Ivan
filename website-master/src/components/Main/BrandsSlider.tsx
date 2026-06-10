'use client'
import { IBrand } from '@/models/IBrand'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'
import { AllowedLangs } from '@/constants/lang'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Navigation, Pagination } from 'swiper/modules'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { divide } from 'lodash'

const BrandSlider = React.memo(
    ({
        locale,
        pageBrands,
    }: {
        locale: AllowedLangs
        pageBrands: IBrand[]
    }) => {
        const isDesktop = useMediaQuery('(max-width:1024px)');
        if (!isDesktop) {
            return (
                <div className="main-page-slider-container box-content">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        slidesPerView={2}
                        spaceBetween={20}
                        breakpoints={{
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 },
                        }}
                        navigation={{ enabled: true }}
                        className="main-page-swiper"
                    >
                        {pageBrands.map((brand) => {
                            if (brand.image) {
                                return (
                                    <SwiperSlide key={brand.id}>
                                        <Link
                                            href={
                                                getLangSlug(locale) +
                                                '/brands/' +
                                                brand.slug
                                            }
                                            title={brand.name}
                                        >
                                            <Image
                                                src={
                                                    API_URL_IMAGE + brand.image
                                                }
                                                alt={brand.name}
                                                quality={100}
                                                sizes="100vw"
                                                width={130}
                                                className="main-page-slider-image"
                                                height={50}
                                            />
                                        </Link>
                                    </SwiperSlide>
                                )
                            }
                            return null
                        })}
                    </Swiper>
                </div>
            )
        }
        return (
            <div className="main-page-slider-container box-content">
                <Swiper
                    modules={[Navigation, Pagination]}
                    slidesPerView={2}
                    spaceBetween={20}
                    breakpoints={{
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                    }}
                    pagination={{ clickable: true, enabled: true }}
                    className="main-page-swiper"
                >
                    {pageBrands.map((brand) => {
                        if (brand.image) {
                            return (
                                <SwiperSlide key={brand.id}>
                                    <Link
                                        href={
                                            getLangSlug(locale) +
                                            '/brands/' +
                                            brand.slug
                                        }
                                        title={brand.name}
                                    >
                                        <Image
                                            src={API_URL_IMAGE + brand.image}
                                            alt={brand.name}
                                            quality={100}
                                            sizes="100vw"
                                            width={130}
                                            className="main-page-slider-image"
                                            height={50}
                                        />
                                    </Link>
                                </SwiperSlide>
                            )
                        }
                        return null
                    })}
                </Swiper>
            </div>
        )
    }
)

export default BrandSlider
