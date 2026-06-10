import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import ProfileLayout from '@/components/Layout/ProfileLayout'
import authConfig from '@/config/auth'
import Profile from '@/template/Profile'
import translationsJson from '../../../../../public/translations/translations.json'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug } from '@/utils/function'
import { useLang } from '@/hooks/useLang'
import { SITE_URL } from '@/http/axiosConfig'

export async function generateMetadata({
    params,
}: {
    params: { locale: AllowedLangs }
}) {
    const locale = params.locale
    return {
        title:
            translationsJson[locale].menu.profile +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].menu.profile +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/profile',
            languages: {
                uk: SITE_URL + '/profile',
                ru: SITE_URL + '/ru/profile',
                en: SITE_URL + '/en/profile',
            },
        },
    }
}

const ProfilePage = async ({
    params,
}: {
    params: { locale: AllowedLangs }
}) => {
    const session = await getServerSession(authConfig)
    const { translations } = useLang()
    const { locale } = params
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
                <Profile locale={locale} />
            </ProfileLayout>
        </>
    )
}

export default ProfilePage
