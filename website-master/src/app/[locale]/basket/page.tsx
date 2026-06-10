import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import translationsJson from '../../../../public/translations/translations.json'
import Basket from '@/template/Basket'
import { getLangSlug } from '@/utils/function'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { SITE_URL } from '@/http/axiosConfig'
import { IContact } from '@/models/IPage'
import pagesService from '@/services/pagesService'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    return {
        title:
            translationsJson[locale].basket.title +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].basket.title +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/basket',
            languages: {
                uk: SITE_URL + '/basket',
                ru: SITE_URL + '/ru/basket',
                en: SITE_URL + '/en/basket',
            },
        },
    }
}

const BasketPage = async ({ params }: { params: { locale: AllowedLangs } }) => {
    const session = await getServerSession(authConfig)
    const { translations } = useLang()
    const { locale } = params
    const contact = await fetchData(locale);
    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={[]}
                title={translations[locale].basket.placeOrder}
            />
            <Basket contact={contact} locale={locale} session={session?.user} />
        </>
    )
}

const fetchData = async (locale: AllowedLangs): Promise<IContact> => {
    try {
        const response = await pagesService.fetchContact(locale);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contact data:', error);
        return {} as IContact;
    }
};

export default BasketPage
