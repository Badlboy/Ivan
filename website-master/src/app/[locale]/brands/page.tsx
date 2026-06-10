import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBrand } from '@/models/IBrand'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import Brands from '@/template/Brands/Brands'
import brandService from '@/services/brandService'
import translationsJson from '../../../../public/translations/translations.json'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: translationsJson[locale].breadcrumb.brands, type: 'page'
    });
    return {
        title: metaSeo.title_seo,
        description: metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/brands',
            languages: {
                uk: SITE_URL + '/brands',
                ru: SITE_URL + '/ru/brands',
                en: SITE_URL + '/en/brands',
            },
        },
    }
}

const Page = async ({ params }: { params: { locale: AllowedLangs } }) => {
    const { locale } = params
    const { translations } = useLang()
    const breadcrumbList: IBreadcrumb[] = []
    const pageData = await fetchData(locale)

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={translations[locale].breadcrumb.brands}
            />
            <Brands locale={locale} pageData={pageData} />
        </>
    )
}

const fetchData = async (locale: AllowedLangs): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

export default Page
