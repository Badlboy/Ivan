import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import authConfig from '@/config/auth'
import translationsJson from '../../../../public/translations/translations.json'
import AuthPage from '@/template/Profile/AuthPage'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
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

const SingInForm = async ({ params }: { params: { locale: AllowedLangs } }) => {
    const session = await getServerSession(authConfig)
    if (session) {
        redirect(getLangSlug(params.locale) + '/profile')
    }
    return <AuthPage locale={params.locale} />
}

export default SingInForm
