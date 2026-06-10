import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../../public/translations/translations.json'
import { useLang } from '@/hooks/useLang'
import Basket from '@/template/Basket'
import { getLangSlug } from '@/utils/function'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { SITE_URL } from '@/http/axiosConfig'
import { IContact } from '@/models/IPage'
import pagesService from '@/services/pagesService'
import BasketFinally from '@/template/Basket/Finally'

interface IPage {
    order: number
    locale: AllowedLangs
}
export async function generateMetadata({
    params,
}: {
    params: IPage
}) {
    const { order, locale } = params
    return {
        title:
            translationsJson[locale].basket.title + ' #' + order +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].basket.title + ' #' + order +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/basket/' + order,
            languages: {
                uk: SITE_URL + '/basket/' + order,
                ru: SITE_URL + '/ru/basket/' + order,
                en: SITE_URL + '/en/basket/' + order,
            },
        },
    }
}

const BasketPage = async ({ params }: { params: IPage }) => {
    const { order, locale } = params
    const { translations } = useLang()
    const contact = await fetchData();
    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={[]}
                title={translations[locale].basket.placeOrder}
            />
            <BasketFinally contact={contact} locale={locale} order={order} />
        </>
    )
}

const fetchData = async (): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact();
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contact data:', error);
        return {} as IContact;
    }
};

export default BasketPage
