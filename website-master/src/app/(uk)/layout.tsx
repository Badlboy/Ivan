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

export async function generateMetadata() {
    return {
        htmlAttributes: {
            lang: 'uk',
        },
    };
}

const RootLayout = React.memo(async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const [session, contact, categories, pageBrands] = await Promise.all([
        getServerSession(authConfig),
        fetchData(),
        fetchCategory(),
        fetchDataBrands(),
    ]);

    const locale = AllowedLangs.UK;

    return (
        <html lang="uk">
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
                    <CookieConsentBanner locale={locale} />
            </body>
        </html>
    );
});

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

RootLayout.displayName = 'RootLayout';

export default RootLayout;
