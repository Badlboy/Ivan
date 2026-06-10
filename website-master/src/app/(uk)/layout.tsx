import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import Layout from '@/components/Layout';
import authConfig from '@/config/auth';
import { CartProvider } from '@/contexts/CartContext';
import pagesService from '@/services/pagesService';
import { IContact } from '@/models/IPage';
import { ICategoriesLittle } from '@/models/ICategories';
import categoryService from '@/services/categoryService';
import { AllowedLangs } from '@/constants/lang';
import brandService from '@/services/brandService';
import { IBrand } from '@/models/IBrand';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import React from 'react';
import GoogleAnaliticHead from '@/components/GoogleAnaliticHead';
import GoogleAnaliticBody from '@/components/GoogleAnaliticBody';
import { UtmContextProvider } from '@/contexts/UtmContext';
import { SITE_URL } from '@/http/axiosConfig';

const RootLayout = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const [session, contact, categories, pageBrands] = await Promise.all([
        getServerSession(authConfig),
        fetchData(),
        fetchCategory(),
        fetchDataBrands(),
    ]);

    const locale = AllowedLangs.UK;

    const siteUrl = SITE_URL || 'https://footballshop.com.ua';
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FOOTBALLSHOP',
        url: siteUrl,
        logo: siteUrl + '/image/Logo.png',
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+380687974646',
                contactType: 'Customer Service',
                areaServed: 'UA',
                availableLanguage: ['Ukrainian', 'Russian', 'English'],
            },
            {
                '@type': 'ContactPoint',
                telephone: '+380937974646',
                contactType: 'Customer Service',
                areaServed: 'UA',
                availableLanguage: ['Ukrainian', 'Russian', 'English'],
            },
        ],
    };

    return (
        <html lang="uk">
            <head>
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
                            __html: JSON.stringify(organizationSchema),
                        }}
                    />
                    <CookieConsentBanner locale={locale} />
            </body>
        </html>
    );
};

const fetchCategory = async (): Promise<ICategoriesLittle[]> => {
    try {
        const response = await categoryService.fetchCategoriesLittle('little');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

const fetchDataBrands = async (): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand(AllowedLangs.UK, 'image');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
};

const fetchData = async (): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact();
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contact data:', error);
        return {} as IContact;
    }
};

export default RootLayout;
