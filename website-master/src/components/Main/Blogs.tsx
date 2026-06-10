'use client'
import { AllowedLangs } from '@/constants/lang'
import { IBlog } from '@/models/IBlog'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Swiper, SwiperSlide } from 'swiper/react'
import BlogItem from '../Blogs/BlogItem'
import { useLang } from '@/hooks/useLang'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Navigation, Pagination } from 'swiper/modules'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Blogs = React.memo(({ blogs, locale }: { blogs: IBlog[]; locale: AllowedLangs }) => {
    const { translations } = useLang();

    const isDesktop = useMediaQuery('(max-width:1024px)');
    const uniqueId = 'blogs'
    if(!isDesktop) { 

        return (
            <article className="post-slider-js">
                <section className="splide__track section-blogs-list">
                    <div className="title-box box-content">
                        <h2>{translations[locale].menu.blogs}</h2>
                        <Link href={getLangSlug(locale) + '/blogs'}>
                            {translations[locale].main.link_all}
                        </Link>
                    </div>
                    <div className="swiper-container box-content">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            className="blogs-slider"
                            slidesPerView={5}
                            navigation={{
                                prevEl: '.swiper-button-prev-' + uniqueId,
                                nextEl: '.swiper-button-next-' + uniqueId,
                            }}
                            breakpoints={{
                                1440: {
                                    slidesPerView: 5,
                                },
                                1100: {
                                    slidesPerView: 4,
                                },
                                900: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                300: {
                                    spaceBetween: 20,
                                    slidesPerView: 1,
                                },
                            }}
                        >
                            {blogs.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <BlogItem
                                        langText={translations[locale].blog.read}
                                        locale={locale}
                                        key={item.id}
                                        {...item}
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
                </section>
            </article>
        )
    }
    return (
        <article className="post-slider-js">
            <section className="splide__track section-blogs-list">
                <div className="title-box box-content">
                    <h2>{translations[locale].menu.blogs}</h2>
                    <Link href={getLangSlug(locale) + '/blogs'}>
                        {translations[locale].main.link_all}
                    </Link>
                </div>
                <div className="swiper-container box-content">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        className="blogs-slider"
                        slidesPerView={5}
                        
                        pagination={{ clickable: true}}
                        breakpoints={{
                            1440: {
                                slidesPerView: 5,
                            },
                            1100: {
                                slidesPerView: 4,
                            },
                            900: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            300: {
                                spaceBetween: 20,
                                slidesPerView: 1,
                            },
                        }}
                    >
                        {blogs.map((item) => (
                            <SwiperSlide key={item.id}>
                                <BlogItem
                                    langText={translations[locale].blog.read}
                                    locale={locale}
                                    key={item.id}
                                    {...item}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                   
                </div>
            </section>
        </article>
    )
})

Blogs.displayName = 'Blogs';

export default Blogs

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