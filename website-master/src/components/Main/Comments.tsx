'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { v4 as uuidv4 } from 'uuid'
import { IReviews } from '@/models/IProduct'
import React from 'react'
import Image from 'next/image'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Navigation } from 'swiper/modules'
import StarBox from '@/components/Catalog/StarBox'
import { getNoPhotoLangs } from '@/utils/function'

const Comments = React.memo(({
    locale,
    comments,
}: {
    locale: AllowedLangs
    comments: IReviews[]
}) => {
    const { translations } = useLang()
    const uniqueId = 'comments'
    return (
        <article id="comments" className="post-slider-js">
            <section className="section-comments splide__track">
                <div className="title-box box-content">
                    <h2>{translations[locale].main.comments_title}</h2>
                    {/* <div className="splide__arrows">
                        <div className={'swiper-button-prev-' + uniqueId}>
                            <CustomPrevArrow />
                        </div>
                        <div className={'swiper-button-next-' + uniqueId}>
                            <CustomNextArrow />
                        </div>
                    </div> */}
                </div>
                <div className="comments-slider swiper-container box-content">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
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
                            620: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            300: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {comments?.map((item) => (
                            <SwiperSlide key={item.id}>
                                <CommentsItem {...item} locale={locale} />
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
})

Comments.displayName = 'Comments';

export default Comments

interface IReviewsThis extends IReviews {
    locale: AllowedLangs
}

const CommentsItem = React.memo((item: IReviewsThis) => {
    return (
        <div className="section-comments__item splide__slide">
            <div className="top">
                <div className="author">
                    <Image
                        loading="lazy"
                        src={
                            item.user?.avatar
                                ? API_URL_IMAGE + item.user.avatar
                                : '/image/avatar.png'
                        }
                        alt={
                            item?.user?.name
                                ? item?.user?.name
                                : 'User #' + item.id
                        }
                        width={42}
                        height={42}
                    />
                    <div className="name">
                        {item?.user?.name ? <span>{item.user.name}</span> : ''}
                        <span>{item.created_at}</span>
                    </div>
                </div>
                <StarBox number={parseFloat(item.rating)} />
            </div>
            <div className="text">
                <p>{item.text}</p>
            </div>
            <div className="product">
                <Image
                    loading="lazy"
                    src={
                        item.product?.image
                            ? API_URL_IMAGE + item.product.image
                            : getNoPhotoLangs(item.locale)
                    }
                    alt={item.product?.title}
                    width={67}
                    height={72}
                />
                <span>
                    <span>{item.product?.title}</span>
                    {item.product?.brand?.image ? (
                        <Image
                            loading="lazy"
                            src={
                                item.product.brand.image
                                    ? API_URL_IMAGE + item.product.brand.image
                                    : getNoPhotoLangs(item.locale)
                            }
                            alt={item.product.brand.name}
                            width={43}
                            height={20}
                        />
                    ) : (
                        ''
                    )}
                </span>
            </div>
        </div>
    )
})

CommentsItem.displayName = 'CommentsItem';

const CustomPrevArrow = () => {
    return (
        <button aria-label="Prev" className="swiper-button-prev slick-arrow">
            <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13 4.15625L7 10.1562L13 16.1562"
                    stroke="#111111"
                    strokeWidth="1.5"
                />
            </svg>
        </button>
    )
}

CustomPrevArrow.displayName = 'CustomPrevArrow';

const CustomNextArrow = React.memo(() => {
    return (
        <button aria-label="Next" className="swiper-button-next slick-arrow">
            <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 4.15625L13 10.1562L7 16.1562"
                    stroke="#111111"
                    strokeWidth="1.5"
                />
            </svg>
        </button>
    )
})

CustomNextArrow.displayName = 'CustomNextArrow';