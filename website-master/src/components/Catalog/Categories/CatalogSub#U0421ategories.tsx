'use client'
import { AllowedLangs } from '@/constants/lang'
import { ICategories } from '@/models/ICategories'
import { getLangSlug } from '@/utils/function'
import Link from 'next/link'
import React from 'react'
import Slider from 'react-slick'

const CatalogSubСategories = ({
    categories,
    locale,
}: {
    categories: ICategories[]
    locale: AllowedLangs
}) => {
    if (categories.length == 0) {
        return
    }
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
    }

    return (
        <section className="subcategory-list splide subcategory-slider-js">
            <Slider {...settings}>
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={getLangSlug(locale) + '/shop/' + cat.slug}
                        className="subcategory-list__item splide__slide"
                    >
                        <span className="title">{cat.title}</span>
                    </Link>
                ))}
            </Slider>
        </section>
    )
}

const CustomPrevArrow = (props: any) => {
    const { onClick } = props
    return (
        <button className="splide__arrow--prev slick-arrow" onClick={onClick}>
            <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.5 4L7.5 10L13.5 16"
                    stroke="#111111"
                    strokeWidth="1.5"
                />
            </svg>
        </button>
    )
}

const CustomNextArrow = (props: any) => {
    const { onClick } = props
    return (
        <button className="splide__arrow--next slick-arrow" onClick={onClick}>
            <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7.5 4L13.5 10L7.5 16"
                    stroke="#111111"
                    strokeWidth="1.5"
                />
            </svg>
        </button>
    )
}

export default CatalogSubСategories
