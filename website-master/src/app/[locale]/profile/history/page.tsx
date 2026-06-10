import { getServerSession } from 'next-auth'
import Breadcrumb from '@/components/Breadcrumb'
import ProfileLayout from '@/components/Layout/ProfileLayout'
import authConfig from '@/config/auth'
import ProfileHistory from '@/template/Profile/ProfileHistory'
import translationsJson from '../../../../../public/translations/translations.json'
import { redirect } from 'next/navigation'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
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
            translationsJson[locale].profile.history +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].profile.history +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/profile/history',
            languages: {
                uk: SITE_URL + '/profile/history',
                ru: SITE_URL + '/ru/profile/history',
                en: SITE_URL + '/en/profile/history',
            },
        },
    }
}

const ProfileHistoryPage = async ({
    params,
}: {
    params: { locale: AllowedLangs }
}) => {
    const { translations } = useLang()
    const { locale } = params
    const session = await getServerSession(authConfig)
    if (!session) {
        redirect(getLangSlug(locale) + '/auth')
    }
    return (
        <>
            <Breadcrumb
                locale={locale}
                thisTitle={translations[locale].breadcrumb.userLK}
                breadcrumbList={[]}
                isProfilePage={true}
            />
            <ProfileLayout locale={locale} user={session?.user}>
                <ProfileHistory locale={locale} />
            </ProfileLayout>
        </>
    )
}

export default ProfileHistoryPage
