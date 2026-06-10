import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import authConfig from '@/config/auth'
import translationsJson from '../../../../public/translations/translations.json'
import AuthPage from '@/template/Profile/AuthPage'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
    return {
        title:
            translationsJson[locale].pages.auth.login +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].pages.auth.login +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/auth',
            languages: {
                uk: SITE_URL + '/auth',
                ru: SITE_URL + '/ru/auth',
                en: SITE_URL + '/en/auth',
            },
        },
    }
}

const SingInForm = async () => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK

    if (session?.user?.id) {
        redirect('/profile')
    }
    return <AuthPage locale={locale} />
}

export default SingInForm
