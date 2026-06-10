import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IPage } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import PageInfoTemplate from '@/template/Pages/PageInfoTemplate'
import pagesService from '@/services/pagesService'
import translationsJson from '../../../../public/translations/translations.json'
import { notFound } from 'next/navigation'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import FeedbackForm from '@/components/DropShippings/FeedbackForm/FeedbackForm'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    const pageData = await fetchDataSEO('dropshippings', locale, 'seo')
    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: pageData.title, type: 'page'
    });


    return {
        title: pageData.title_seo != '' && pageData.title_seo != null ? pageData.title_seo : metaSeo.title_seo,
        description: pageData.description_seo != '' && pageData.description_seo != null ? pageData.description_seo : metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/dropshippings',
            languages: {
                uk: SITE_URL + '/dropshippings',
                ru: SITE_URL + '/ru/dropshippings',
                en: SITE_URL + '/en/dropshippings',
            },
        },
    }
}

const fetchDataSEO = async (
    type: string,
    locale: AllowedLangs,
    seo: string
): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchPage(type, locale, seo)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const Page = async ({ params }: { params: { locale: AllowedLangs } }) => {
    const { locale } = params
    const pageData = await fetchData('dropshippings', locale)
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
             <section className="section-page-info box-content">
                <div className="section-page-info__container">
                    <PageInfoTemplate pageData={pageData} />
                    <FeedbackForm locale={locale}/>
                </div>
            </section>
        </>
    )
}

const fetchData = async (
    type: string,
    locale: AllowedLangs
): Promise<IPage> => {
    try {
        const response = await pagesService.fetchPage(type, locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IPage
}

export default Page
