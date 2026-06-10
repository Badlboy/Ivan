import { Toaster } from 'react-hot-toast'
import { getServerSession } from 'next-auth'
import Layout from '@/components/Layout'
import authConfig from '@/config/auth'
import { CartProvider } from '@/contexts/CartContext'
import pagesService from '@/services/pagesService'
import { IContact } from '@/models/IPage'
import { ICategoriesLittle } from '@/models/ICategories'
import categoryService from '@/services/categoryService'
import { notFound } from 'next/navigation'
import { AllowedLangs } from '@/constants/lang'
import brandService from '@/services/brandService'
import { IBrand } from '@/models/IBrand'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import GoogleAnaliticHead from '@/components/GoogleAnaliticHead'
import GoogleAnaliticBody from '@/components/GoogleAnaliticBody'
import { UtmContextProvider } from '@/contexts/UtmContext'

export async function generateMetadata({
    params,
}: {
    params: { locale: string }
}) {
    return {
        htmlAttributes: {
            lang: params.locale,
        },
    }
}

const RootLayout = async ({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: { locale: AllowedLangs }
}>) => {
    const contactSchema = {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        url: 'https://yourwebsite.com',
        logo: 'https://yourwebsite.com/logo.png',
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+1-800-555-1212',
                contactType: 'Customer Service',
                areaServed: 'US',
                availableLanguage: ['English', 'Spanish'],
            },
        ],
    }

    const { locale } = params
    const session = await getServerSession(authConfig)
    const contact = await fetchData(locale)
    const categories = await fetchCategory(locale)
    const pageBrands = await fetchDataBrands(locale)

    if (locale !== 'ru' && locale !== 'en') {
        notFound()
    }

    return (
        <html lang={locale}>
            <head>
                <link
                    rel="preload"
                    as="font"
                    type="font/woff2"
                    href="/_next/static/media/TTHoves-Regular.cce19915.woff2"
                />
                <link
                    rel="preload"
                    as="font"
                    type="font/woff2"
                    href="/_next/static/media/TTHoves-Medium.4abe38fa.woff2"
                />
                <GoogleAnaliticHead />
            </head>
            <body>
                <GoogleAnaliticBody />
                <UtmContextProvider>
                    <CartProvider locale={locale}>
                        <Layout
                            locale={locale}
                            categories={categories}
                            contact={contact}
                            session={session}
                            brands={pageBrands}
                        >
                            {children}
                            <Toaster position="top-center" />
                        </Layout>
                    </CartProvider>
                </UtmContextProvider>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(contactSchema),
                    }}
                />
                <CookieConsentBanner locale={locale} />
            </body>
        </html>
    )
}

export default RootLayout

const fetchCategory = async (
    locale: AllowedLangs
): Promise<ICategoriesLittle[]> => {
    try {
        const response = await categoryService.fetchCategoriesLittle(
            'little',
            locale
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchDataBrands = async (locale: AllowedLangs): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand(locale, 'image')
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchData = async (locale: AllowedLangs): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact(locale)
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IContact
}
