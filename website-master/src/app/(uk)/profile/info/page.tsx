import { getServerSession } from 'next-auth'
import Breadcrumb from '@/components/Breadcrumb'
import ProfileLayout from '@/components/Layout/ProfileLayout'
import authConfig from '@/config/auth'
import ProfileWishList from '@/template/Profile/ProfileWishList'
import { redirect } from 'next/navigation'
import { useLang } from '@/hooks/useLang'
import { AllowedLangs } from '@/constants/lang'
import translationsJson from '../../../../../public/translations/translations.json'
import { getLangSlug } from '@/utils/function'
import { SITE_URL } from '@/http/axiosConfig'
import Profile from '@/template/Profile'

export async function generateMetadata() {
    const locale = AllowedLangs.UK
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

const ProfilePage = async () => {
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
                <Profile locale={locale} />
            </ProfileLayout>
        </>
    )
}

export default ProfilePage
