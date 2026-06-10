import TitleSection from '@/components/TitleSection'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../public/translations/translations.json'
import { useLang } from '@/hooks/useLang'
import Basket from '@/template/Basket'
import { getLangSlug } from '@/utils/function'
import { getServerSession } from 'next-auth'
import authConfig from '@/config/auth'
import { SITE_URL } from '@/http/axiosConfig'
import { IContact } from '@/models/IPage'
import pagesService from '@/services/pagesService'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
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

const BasketPage = async () => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK
    const { translations } = useLang()
    const contact = await fetchData();
    return (
        <>
            <TitleSection
                locale={locale}
                breadcrumbList={[]}
                title={translations[locale].basket.placeOrder}
            />
            <Basket contact={contact} session={session?.user} locale={locale} />
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
