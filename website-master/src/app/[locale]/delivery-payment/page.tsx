import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IDeliveryAndPayment } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import DeliveryPayment from '@/template/DeliveryPayment/DeliveryPayment'
import translationsJson from '../../../../public/translations/translations.json'
import pagesService from '@/services/pagesService'
import { notFound } from 'next/navigation'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    const pageData = await fetchDataSEO(locale)
    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: pageData.title, type: 'page'
    });

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

const fetchDataSEO = async (locale: AllowedLangs): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchDeliveryAndPayment(
            locale,
            'seo'
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const Page = async ({ params }: { params: { locale: AllowedLangs } }) => {
    const { locale } = params
    const pageData = await fetchData(locale)
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

const fetchData = async (
    locale: AllowedLangs
): Promise<IDeliveryAndPayment> => {
    try {
        const response = await pagesService.fetchDeliveryAndPayment(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IDeliveryAndPayment
}

export default Page
