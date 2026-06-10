'use client'
import { memo, ReactNode } from 'react'
import { SwiperSlider, Slide } from '@/components/business/SwiperSlider'
import { IMainPageBanner } from '@/models/IPage'
import Banner from '../Banner'
import { AllowedLangs } from '@/constants/lang'

interface BannerSliderProps {
    banners: IMainPageBanner;
    locale:AllowedLangs;
}

export const BannerSlider = memo((props: BannerSliderProps) => {
    const { banners,locale } = props;
    const slides: Slide[] = banners.data.map((banner, index) => ({
        id: index,
        slide: <Banner
            key={banner.id}
            banner_title={banner.title}
            image={banner.image}
            url={banner.category_url}
            locale={locale}
        />,
    }))
    return (
        <section className="">
            <SwiperSlider autoplay={{pauseOnMouseEnter:true,delay:3000}}  slides={slides}></SwiperSlider>
        </section>
    )
})
