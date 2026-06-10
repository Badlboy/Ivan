import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../public/translations/translations.json'
import Main from '@/template/Main/Main'
import pagesService from '@/services/pagesService'
import { IMainPage, IMainPageBanner } from '@/models/IPage'
import brandService from '@/services/brandService'
import { IBrand } from '@/models/IBrand'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
    const pageData = await fetchData(locale)
    return {
        title: pageData.title_seo ?? translationsJson[locale].seo.main.title,
        description:
            pageData.description_seo ??
            translationsJson[locale].seo.main.description,
        alternates: {
            canonical: SITE_URL + '/',
            languages: {
                uk: SITE_URL + '/',
                ru: SITE_URL + '/ru',
                en: SITE_URL + '/en',
            },
        },
        openGraph: {
            title: pageData.title_seo ?? translationsJson[locale].seo.main.title,
            description:
                pageData.description_seo ??
                translationsJson[locale].seo.main.description,
            url: SITE_URL + '/',
            siteName: 'FOOTBALLSHOP',
            images: [{ url: SITE_URL + '/image/Logo.png' }],
            locale: 'uk_UA',
            type: 'website',
        },
    }
}

export const revalidate = 60

export default async function Home() {
    const locale = AllowedLangs.UK

    const [pageData, pageBrands, session, banners, pagePromotion] =
        await Promise.all([
            fetchData(locale),
            fetchDataBrands(locale),
            getServerSession(authConfig),
            fetchMainBanners(locale),
            fetchMainSlider(locale),
        ])

    // Головна сторінка ніколи не повинна віддавати 404: якщо API не
    // відповів — кидаємо помилку (5xx), щоб Google не деіндексував сайт
    if (!pageData.id) {
        throw new Error('Main page data is unavailable')
    }

    return (
        <Main
            favorites={session?.user?.favorites ?? ([] as number[])}
            locale={locale}
            pageData={pageData}
            pageBrands={pageBrands}
            banners={banners}
            pagePromotion={pagePromotion}
        />
    )
}

const fetchDataBrands = async (locale: AllowedLangs): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchData = async (locale: AllowedLangs): Promise<IMainPage> => {
    try {
        const response = await pagesService.fetchMainPage(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IMainPage
}

const fetchMainBanners = async (
    locale: AllowedLangs
): Promise<IMainPageBanner> => {
    try {
        const response = await pagesService.fetchMainBanners(locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IMainPageBanner
}

const fetchMainSlider = async (
    locale: AllowedLangs
): Promise<IMainPageBanner> => {
    try {
        const response = await pagesService.fetchMainSlider(locale)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IMainPageBanner
}
