'use client'
import { memo, ReactNode } from 'react'
import { SwiperSlider, Slide } from '@/components/business/SwiperSlider'
import { IMainPageBanner } from '@/models/IPage'
import BlockImage from '../BlockImage'
import { AllowedLangs } from '@/constants/lang'

interface PromotionSliderProps {
    promotions: IMainPageBanner;
    locale:AllowedLangs;
}

export const PromotionSlider = memo((props: PromotionSliderProps) => {
    const { promotions,locale } = props
    const slides: Slide[] = promotions.data.map((promotion, index) => ({
        id: index,
        slide: <BlockImage
                key="promotion-1"
                locale={locale}
                title={promotion.title}
                description={promotion.description}
                image={promotion.image}
                url={promotion.category_url}
        />,
    }))
    return (
        <section className="">
            <SwiperSlider autoplay={{pauseOnMouseEnter:true,delay:3000}}  slides={slides}></SwiperSlider>
        </section>
    )
})
