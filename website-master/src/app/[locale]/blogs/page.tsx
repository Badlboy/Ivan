import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBlogList } from '@/models/IBlog'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import blogsService from '@/services/blogsService'
import translationsJson from '../../../../public/translations/translations.json'
import Blogs from '@/template/Blogs/Blogs'
import React from 'react'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

interface IPage {
    page: string
}

export async function generateMetadata({
    searchParams,
    params,
}: {
    searchParams: IPage,
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    const page = searchParams.page || '1'

    const blogsData = await fetchData(page, locale)
    let arrayLink = [];
    if (blogsData?.meta?.current_page && blogsData.meta.current_page > 1) {
        arrayLink.push({ rel: 'prev', url: `${SITE_URL}${getLangSlug(locale)}/blogs?page=${blogsData.meta.current_page - 1}` })
    }
    if (blogsData?.meta?.current_page && blogsData.meta.current_page < blogsData.meta.last_page) {
        arrayLink.push({ rel: 'next', url: `${SITE_URL}${getLangSlug(locale)}/blogs?page=${blogsData.meta.current_page + 1}` })
    }

    return {
        title:
            translationsJson[locale].menu.blogs +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].menu.blogs +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/blogs' + (blogsData?.meta?.current_page && blogsData.meta.current_page != 1 ? '?page=' + blogsData.meta.current_page : ''),
            languages: {
                uk: SITE_URL + '/blogs',
                ru: SITE_URL + '/ru/blogs',
                en: SITE_URL + '/en/blogs',
            },
        },
        robots: {
            index: (blogsData?.meta?.current_page && blogsData.meta.current_page > 1 ? false : true),
            follow: (blogsData?.meta?.current_page && blogsData.meta.current_page > 1 ? false : true),
        },
        icons: {
            other: arrayLink
        }
    }
}

const Page = async ({
    searchParams,
    params,
}: {
    searchParams: IPage
    params: { locale: AllowedLangs }
}) => {
    const { locale } = params
    const { translations } = useLang()
    const page = searchParams.page || '1'
    const blogsData = await fetchData(page, locale)
    const breadcrumbList: IBreadcrumb[] = []

    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={breadcrumbList}
                title={translations[locale].breadcrumb.blog}
            />
            <Blogs locale={locale} blogsData={blogsData} />
        </>
    )
}

const fetchData = async (
    page: string,
    locale: AllowedLangs
): Promise<IBlogList> => {
    try {
        const response = await blogsService.fetchBlogs(page, locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IBlogList
}

export default Page
