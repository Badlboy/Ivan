import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import authConfig from '@/config/auth'
import translationsJson from '../../../../../public/translations/translations.json'
import { AllowedLangs } from '@/constants/lang'
import RegisterPage from '@/template/Profile/RegisterPage'
import authService from '@/services/authService'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
    return {
        title:
            translationsJson[locale].menu.register +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].menu.register +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/auth/register',
            languages: {
                uk: SITE_URL + '/auth/register',
                ru: SITE_URL + '/ru/auth/register',
                en: SITE_URL + '/en/auth/register',
            },
        },
    }
}

const RegisterPageForm = async ({
    searchParams,
}: {
    searchParams: { token: string }
}) => {
    const locale = AllowedLangs.UK
    const session = await getServerSession(authConfig)
    if (session) {
        redirect('/profile')
    }
    let status = 0
    if (searchParams?.token) {
        status = await fetchVerifyEmail(searchParams.token)
    }

    return <RegisterPage status={status} locale={locale} />
}

const fetchVerifyEmail = async (token: string): Promise<number> => {
    try {
        const response = await authService.userIsVerifyEmail(token)
        return response.status
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    return 404
}

export default RegisterPageForm
