import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBrand } from '@/models/IBrand'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import Brands from '@/template/Brands/Brands'
import translationsJson from '../../../../public/translations/translations.json'
import brandService from '@/services/brandService'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
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

const Page = async () => {
    const breadcrumbList: IBreadcrumb[] = []
    const pageData = await fetchData()
    const locale = AllowedLangs.UK
    const { translations } = useLang()

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

const fetchData = async (): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand()
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

export default Page
