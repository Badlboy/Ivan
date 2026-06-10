import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IPage } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import PageInfoTemplate from '@/template/Pages/PageInfoTemplate'
import pagesService from '@/services/pagesService'
import { notFound } from 'next/navigation'
import translationsJson from '../../../../public/translations/translations.json'
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
            canonical: SITE_URL + getLangSlug(locale) + '/exchange-and-return',
            languages: {
                uk: SITE_URL + '/exchange-and-return',
                ru: SITE_URL + '/ru/exchange-and-return',
                en: SITE_URL + '/en/exchange-and-return',
            },
        },
    }
}

const fetchDataSEO = async (): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchPage(
            'exchange-and-return',
            AllowedLangs.UK,
            'seo'
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const Page = async () => {
    const pageData = await fetchData('exchange-and-return')
    const breadcrumbList: IBreadcrumb[] = []
    const locale = AllowedLangs.UK

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
            <PageInfoTemplate pageData={pageData} />
        </>
    )
}

const fetchData = async (type: string): Promise<IPage> => {
    try {
        const response = await pagesService.fetchPage(type)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IPage
}

export default Page
