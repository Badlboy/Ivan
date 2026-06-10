'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import { IVariation } from '@/models/IProduct'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getNoPhotoLangs } from '@/utils/function'

const ProductSliderImage = ({
    locale,
    images,
    is_new,
    title,
    is_top_sale,
    percent,
}: {
    title: string
    locale: AllowedLangs
    images: {
        id: number
        url: string
    }[]
    is_top_sale: boolean
    is_new: boolean
    percent?: number | undefined
}) => {
    const { translations } = useLang()
    const mainSliderRef = useRef<Slider>(null)

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        ref: mainSliderRef,
        responsive: [
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }

    const handleThumbnailClick = (index: number) => {
        if (mainSliderRef.current) {
            mainSliderRef.current.slickGoTo(index)
        }
    }

    return (
        <div className="product-preview__left">
            <div className="splide">
                <div className="info-card">
                    {is_top_sale && (
                        <span>{translations[locale].product.is_top_sale}</span>
                    )}
                    {is_new && (
                        <span>{translations[locale].product.is_new}</span>
                    )}
                    {percent && <span className="sales">- {Math.abs(percent)}%</span>}
                </div>
                <Slider {...settings}>
                    {images.length ? images.map((image, index) => (
                        <figure key={image.id} className="product-detail__image image">
                            <Image
                                src={
                                    image.url
                                        ? API_URL_IMAGE + image.url
                                        : getNoPhotoLangs(locale)
                                }
                                title={title}
                                alt={title + ' - #' + index}
                                width={420}
                                priority={true}
                                height={430}
                            />
                        </figure>
                    )) : (
                        <figure className="product-detail__image">
                            <Image
                                src={getNoPhotoLangs(locale)}
                                title={title}
                                alt={title}
                                width={420}
                                priority={true}
                                height={430}
                            />
                        </figure>
                    )}
                </Slider>
            </div>
            <div className="product-detail__mini-image">
                {images.length ? images.map((image, index) => (
                    <figure
                        key={image.id}
                        className={"image" + (image.url ? ' image' : '')}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <Image
                            src={
                                image.url
                                    ? API_URL_IMAGE + image.url
                                    : getNoPhotoLangs(locale)
                            }
                            alt={`Image ${index}`}
                            width={111}
                            height={95}
                        />
                    </figure>
                )) : (
                    <figure className="image">
                        <Image
                            src={getNoPhotoLangs(locale)}
                            alt={`Image 1`}
                            width={111}
                            height={95}
                        />
                    </figure>
                )}
            </div>
        </div>
    )
}

export default ProductSliderImage

const CustomPrevArrow = (props: any) => {
    const { onClick } = props
    return (
        <button className="splide__arrow--prev slick-arrow" onClick={onClick}>
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
}

const CustomNextArrow = (props: any) => {
    const { onClick } = props
    return (
        <button className="splide__arrow--next slick-arrow" onClick={onClick}>
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
}
