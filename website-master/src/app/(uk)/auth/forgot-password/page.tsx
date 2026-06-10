import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import authConfig from '@/config/auth'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../../public/translations/translations.json'
import ForgotPasswordPage from '@/template/Profile/ForgotPasswordPage'
import ForgotPasswordEditPage from '@/template/Profile/ForgotPasswordEditPage'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
    return {
        title:
            translationsJson[locale].pages.auth.forgot_password +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].pages.auth.forgot_password +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/auth/forgot-password',
            languages: {
                uk: SITE_URL + '/auth/forgot-password',
                ru: SITE_URL + '/ru/auth/forgot-password',
                en: SITE_URL + '/en/auth/forgot-password',
            },
        },
    }
}

const ForgotPasswordForm = async ({
    searchParams,
}: {
    searchParams: { token: string; email: string }
}) => {
    const session = await getServerSession(authConfig)
    const locale = AllowedLangs.UK

    if (session?.user?.id) {
        redirect('/profile')
    }

    if (searchParams.token) {
        return (
            <ForgotPasswordEditPage
                searchParams={searchParams}
                locale={locale}
            />
        )
    }

    return <ForgotPasswordPage locale={locale} />
}

export default ForgotPasswordForm
