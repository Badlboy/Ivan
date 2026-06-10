import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IAboutUs } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import AboutUs from '@/template/AboutUs/AboutUs'
import pagesService from '@/services/pagesService'
import { notFound } from 'next/navigation'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const pageData = await fetchDataSEO()
    const locale = AllowedLangs.UK

    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: pageData.title, type: 'page'
    });
    return {
        title: pageData.title_seo != '' && pageData.title_seo != null ? pageData.title_seo : metaSeo.title_seo,
        description: pageData.description_seo != '' && pageData.description_seo != null ? pageData.description_seo : metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/about-us',
            languages: {
                uk: SITE_URL + '/about-us',
                ru: SITE_URL + '/ru/about-us',
                en: SITE_URL + '/en/about-us',
            },
        },
    }
}

const fetchDataSEO = async (): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchAboutUs(AllowedLangs.UK, 'seo')
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const Page = async () => {
    const locale = AllowedLangs.UK
    const pageData = await fetchData()
    const breadcrumbList: IBreadcrumb[] = []

    if (!pageData.title) {
        notFound()
    }

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={pageData.title}
            />
            <AboutUs locale={locale} pageData={pageData} />
        </>
    )
}

const fetchData = async (): Promise<IAboutUs> => {
    try {
        const response = await pagesService.fetchAboutUs()
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IAboutUs
}

export default Page
