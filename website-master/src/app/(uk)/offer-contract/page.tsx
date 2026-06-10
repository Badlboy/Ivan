import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IPage } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import PageInfoTemplate from '@/template/Pages/PageInfoTemplate'
import translationsJson from '../../../../public/translations/translations.json'
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
            canonical: SITE_URL + getLangSlug(locale) + '/offer-contract',
            languages: {
                uk: SITE_URL + '/offer-contract',
                ru: SITE_URL + '/ru/offer-contract',
                en: SITE_URL + '/en/offer-contract',
            },
        },
    }
}

const fetchDataSEO = async (): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchPage(
            'offer-contract',
            AllowedLangs.UK,
            'seo'
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const OfferContractPage = async () => {
    const pageData = await fetchData('offer-contract')
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

export default OfferContractPage
