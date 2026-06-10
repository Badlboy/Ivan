'use client'
import { memo, ReactNode, Ref } from 'react';
import {
    Swiper,
    SwiperRef,
    SwiperSlide,
    SwiperProps,
} from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/pagination';
import 'swiper/scss/navigation';

export interface Slide {
    id: string | number;
    slide: ReactNode;
}

interface Slots {
    containerStart?: { className?: string; content: ReactNode };
    containerEnd?: { className?: string; content: ReactNode };
    wrapperStart?: { className?: string; content: ReactNode };
    wrapperEnd?: { className?: string; content: ReactNode };
}

interface SliderProps extends SwiperProps {
    className?: string;
    slides: Slide[];
    slideClassName?: string;
    ref?: Ref<SwiperRef>;
    slots?: Slots;
    children?: ReactNode;
}

export const SwiperSlider = memo(({
    slides,
    className,
    slideClassName,
    ref,
    slots,
    children,
    ...swiperProps
}: SliderProps) => (
    <div>
        <Swiper
            ref={ref}
            className='swiper-slider'
            {...swiperProps}
        >
            {
                slides.map(
                    (slide) => (
                        <SwiperSlide
                            className='slide'
                            key={slide.id}
                        >
                            {slide.slide}
                        </SwiperSlide>
                    ),
                )
            }
            {children}
            {slots?.containerStart
                && (
                    <div
                        slot="container-start"
                    >
                        {slots.containerStart.content}
                    </div>
                )}

            {slots?.containerEnd
                && <div slot="container-end">{slots.containerEnd.content}</div>}

            {slots?.wrapperStart
                && <div slot="wrapper-start">{slots.wrapperStart.content}</div>}

            {slots?.wrapperEnd
                && <div slot="wrapper-end">{slots.wrapperEnd.content}</div>}

        </Swiper>
    </div>
));
