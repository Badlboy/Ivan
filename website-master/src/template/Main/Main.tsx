import Banner from '@/components/Main/Banner'
import { BannerSlider } from '@/components/Main/Sliders/BannerSlider'
import BlockImage from '@/components/Main/BlockImage'
import Blogs from '@/components/Main/Blogs'
import Brands from '@/components/Main/Brands'
import Categories from '@/components/Main/Categories'
import Comments from '@/components/Main/Comments'
import NewsProduct from '@/components/Main/NewsProduct'
import SectionSeoText from '@/components/Section/SectionSeoText'
import { AllowedLangs } from '@/constants/lang'
import { IBrand } from '@/models/IBrand'
import { IMainPage, IMainPageBanner } from '@/models/IPage'
import React from 'react'
import { PromotionSlider } from '@/components/Main/Sliders/PromotionSlider'
import BrandSlider from '@/components/Main/BrandsSlider'

const Main = React.memo(
    ({
        locale,
        pageData,
        pageBrands,
        favorites,
        banners,
        pagePromotion
    }: {
        locale: AllowedLangs
        pageData: IMainPage
        pageBrands: IBrand[]
        favorites: number[]
        banners:IMainPageBanner,
        pagePromotion:IMainPageBanner
    }) => {
        return (
            <>
                {/* <Banner banner_title={pageData.banner_title} locale={locale} /> */}
                <BannerSlider
                    banners={banners}
                    locale={locale}
                />
                <NewsProduct
                    favorites={favorites}
                    locale={locale}
                    products_hit={pageData.products_hit}
                    products_new={pageData.products_new}
                />
                <Categories locale={locale} categories={pageData.category} />
                <BrandSlider locale={locale} pageBrands={pageBrands}/>
                <PromotionSlider
                    promotions={pagePromotion}
                    locale={locale}
                />
                <Blogs locale={locale} blogs={pageData.blog} />
                <Comments locale={locale} comments={pageData.comments} />
                <SectionSeoText text={pageData.seo_text} locale={locale} />
            </>
        )
    }
)

Main.displayName = 'Main'

export default Main