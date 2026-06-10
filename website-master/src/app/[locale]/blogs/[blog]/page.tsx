import Breadcrumb from '@/components/Breadcrumb'
import { notFound } from 'next/navigation'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import translationsJson from '../../../../../public/translations/translations.json'
import blogsService from '@/services/blogsService'
import { IBlogDetail } from '@/models/IBlog'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { SeoTags } from '@/models/response/soloResponse'
import BlogDetail from '@/template/Blogs/BlogDetail'
import { fetchSEOTitleOrDescription, getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

interface IPage {
    blog: string | undefined | null
    locale: AllowedLangs
}

export const generateMetadata = async ({ params }: { params: IPage }) => {
    const { locale, blog } = params
    const pageData = await fetchDataSeo(blog, locale, 'seo')
    let title_seo = pageData.title_seo
    let description_seo = pageData.description_seo

    if (!title_seo || !description_seo) {
        const metaSeo = await fetchSEOTitleOrDescription({
            lang: locale, title: pageData.title, type: 'page'
        });
        if (!title_seo) {
            title_seo = metaSeo.title_seo ?? pageData.title + translationsJson[locale].seo.page.title;
        }
        if (!description_seo) {
            description_seo = metaSeo.description_seo ?? pageData.title + translationsJson[locale].seo.page.description;
        }
    }
    return {
        title: title_seo,
        description: description_seo,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/blogs/' + pageData.slug,
            languages: {
                uk: SITE_URL + '/blogs/' + pageData.slug,
                ru: SITE_URL + '/ru/blogs' + pageData.slug,
                en: SITE_URL + '/en/blogs' + pageData.slug,
            },
        },
    }
}

const fetchDataSeo = async (
    slug: string | undefined | null,
    locale: AllowedLangs,
    str: string = ''
): Promise<SeoTags> => {
    try {
        const response = await blogsService.fetchBlog(slug, locale, str)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as SeoTags
}

const BlogPage = async ({ params }: { params: IPage }) => {
    const { locale } = params
    const { translations } = useLang()
    const blogData = await fetchData(params.blog, locale)
    if (!blogData.data.id) {
        notFound()
    }

    const breadcrumbList: IBreadcrumb[] = [
        {
            id: 1,
            title: translations[locale].breadcrumb.blog,
            slug: 'blogs',
        },
    ]
    return (
        <>
            <amp-img
                width={50}
                height={50}
                className="avatar"
                src={`http://laravel-api.loc/storage/images/blogs/1724839231.png`}
            />{' '}
            <Breadcrumb
                locale={locale}
                breadcrumbList={breadcrumbList}
                thisTitle={blogData.data.title}
            />
            <BlogDetail locale={locale} blogData={blogData} />
        </>
    )
}

const fetchData = async (
    slug: string | undefined | null,
    locale: AllowedLangs
): Promise<IBlogDetail> => {
    try {
        const response = await blogsService.fetchBlog(slug, locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IBlogDetail
}

export default BlogPage
