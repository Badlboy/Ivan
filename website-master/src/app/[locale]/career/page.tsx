import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { ICareer } from '@/models/IPage'
import { SeoTags } from '@/models/response/soloResponse'
import Career from '@/template/Career/Career'
import pagesService from '@/services/pagesService'
import { notFound } from 'next/navigation'
import translationsJson from '../../../../public/translations/translations.json'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const pageData = await fetchDataSEO(params.locale)
    const locale = params.locale
    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: pageData.title, type: 'page'
    });

    return {
        title: pageData.title_seo != '' && pageData.title_seo != null ? pageData.title_seo : metaSeo.title_seo,
        description: pageData.description_seo != '' && pageData.description_seo != null ? pageData.description_seo : metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/career',
            languages: {
                uk: SITE_URL + '/career',
                ru: SITE_URL + '/ru/career',
                en: SITE_URL + '/en/career',
            },
        },
    }
}

const fetchDataSEO = async (locale: AllowedLangs): Promise<SeoTags> => {
    try {
        const response = await pagesService.fetchCareer(locale, 'seo')
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
            <Career locale={locale} pageData={pageData} />
        </>
    )
}

const fetchData = async (locale: AllowedLangs): Promise<ICareer> => {
    try {
        const response = await pagesService.fetchCareer(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as ICareer
}

export default Page
