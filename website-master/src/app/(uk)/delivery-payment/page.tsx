import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IDeliveryAndPayment } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import DeliveryPayment from '@/template/DeliveryPayment/DeliveryPayment'
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
    console.log(pageData.title_seo)
    return {
        title: pageData.title_seo != '' && pageData.title_seo != null ? pageData.title_seo : metaSeo.title_seo,
        description: pageData.description_seo != '' && pageData.description_seo != null ? pageData.description_seo : metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/delivery-payment',
            languages: {
                uk: SITE_URL + '/delivery-payment',
                ru: SITE_URL + '/ru/delivery-payment',
                en: SITE_URL + '/en/delivery-payment',
            },
        },
    }
}

const fetchDataSEO = async (): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchDeliveryAndPayment(
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
            <DeliveryPayment locale={locale} pageData={pageData} />
        </>
    )
}

const fetchData = async (): Promise<IDeliveryAndPayment> => {
    try {
        const response = await pagesService.fetchDeliveryAndPayment()
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IDeliveryAndPayment
}

export default Page
