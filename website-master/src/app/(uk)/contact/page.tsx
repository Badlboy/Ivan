import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { IContact } from '@/models/IPage'
import ContactTemplate from '@/template/Contact/ContactTemplate'
import translationsJson from '../../../../public/translations/translations.json'
import pagesService from '@/services/pagesService'
import { notFound } from 'next/navigation'
import React from 'react'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
    const metaSeo = await fetchSEOTitleOrDescription({
        lang: locale, title: translationsJson[locale].menu.contact, type: 'page'
    });
    return {
        title: metaSeo.title_seo,
        description: metaSeo.description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/contact',
            languages: {
                uk: SITE_URL + '/contact',
                ru: SITE_URL + '/ru/contact',
                en: SITE_URL + '/en/contact',
            },
        },
    }
}

const ContactPage = async () => {
    const contentData = await fetchData()
    const breadcrumbList: IBreadcrumb[] = []
    const locale = AllowedLangs.UK

    if (!contentData) {
        notFound()
    }

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={translationsJson[locale].menu.contact}
            />
            <ContactTemplate locale={locale} contentData={contentData} />
        </>
    )
}

const fetchData = async (): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact();
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IContact
}

export default ContactPage
