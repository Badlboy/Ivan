import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/contexts/CartContext'
import { ICategoriesLittle } from '@/models/ICategories'
import categoryService from '@/services/categoryService'
import { IContact } from '@/models/IPage'
import pagesService from '@/services/pagesService'
import authConfig from '@/config/auth'
import { getServerSession } from 'next-auth'
import { AllowedLangs } from '@/constants/lang'
import brandService from '@/services/brandService'
import { IBrand } from '@/models/IBrand'

export async function generateMetadata() {
    return {
        title: 'Сторінку не знайдено',
        description: 'Сторінку не знайдено',
    }
}

const ErrorPage = async () => {
    const session = await getServerSession(authConfig)
    const contact = await fetchData()
    const categories = await fetchCategory()
    const locale = AllowedLangs.UK
    const pageBrands = await fetchDataBrands()

    return (
        <html lang={locale}>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
                />
            </head>
            <body>
                <CartProvider locale={locale}>
                    <Layout
                        locale={locale}
                        categories={categories}
                        contact={contact}
                        session={session}
                        brands={pageBrands}
                    >
                        <section className="section-errors box-content">
                            <div className="content">
                                <h1>Ой-йой, Щось пішло не так(</h1>
                                <p>
                                    Наша команда обійшла суперників і вилетіла
                                    за межі поля! Спробуйте повернутися на
                                    головну сторінку)
                                </p>
                                <Link className="btn-black" href={'/'}>
                                    На головну
                                </Link>
                            </div>
                            <Image
                                src="/image/not-found.png"
                                alt="Not Found"
                                width={0}
                                sizes="50vw"
                                height={0}
                            />
                        </section>
                        <Toaster position="top-center" />
                    </Layout>
                </CartProvider>
            </body>
        </html>
    )
}

export default ErrorPage

const fetchDataBrands = async (): Promise<IBrand[]> => {
    try {
        const response = await brandService.fetchBrand(AllowedLangs.UK, 'image');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
};

const fetchCategory = async (): Promise<ICategoriesLittle[]> => {
    try {
        const response = await categoryService.fetchCategoriesLittle(
            'little',
            AllowedLangs.UK
        )
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return []
}

const fetchData = async (): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact()
        return response.data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return {} as IContact
}
