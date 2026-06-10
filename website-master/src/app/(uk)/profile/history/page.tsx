import { getServerSession } from 'next-auth'
import Breadcrumb from '@/components/Breadcrumb'
import ProfileLayout from '@/components/Layout/ProfileLayout'
import authConfig from '@/config/auth'
import ProfileHistory from '@/template/Profile/ProfileHistory'
import translationsJson from '../../../../../public/translations/translations.json'
import { redirect } from 'next/navigation'
import { useLang } from '@/hooks/useLang'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
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

const ProfileHistoryPage = async () => {
    const locale = AllowedLangs.UK
    const { translations } = useLang()
    const session = await getServerSession(authConfig)
    if (!session) {
        redirect('/auth')
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
