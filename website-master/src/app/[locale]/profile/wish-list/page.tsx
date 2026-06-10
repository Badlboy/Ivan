import { getServerSession } from 'next-auth'
import Breadcrumb from '@/components/Breadcrumb'
import ProfileLayout from '@/components/Layout/ProfileLayout'
import authConfig from '@/config/auth'
import ProfileWishList from '@/template/Profile/ProfileWishList'
import { redirect } from 'next/navigation'
import translationsJson from '../../../../../public/translations/translations.json'
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
            translationsJson[locale].profile.wish_list +
            translationsJson[locale].seo.page.title,
        description:
            translationsJson[locale].profile.wish_list +
            translationsJson[locale].seo.page.description,
        alternates: {
            canonical: SITE_URL + getLangSlug(locale) + '/profile/wish-list',
            languages: {
                uk: SITE_URL + '/profile/wish-list',
                ru: SITE_URL + '/ru/profile/wish-list',
                en: SITE_URL + '/en/profile/wish-list',
            },
        },
    }
}

const ProfileWishListPage = async ({
    params,
}: {
    params: { locale: AllowedLangs }
}) => {
    const { locale } = params
    const { translations } = useLang()
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
                <ProfileWishList locale={locale} />
            </ProfileLayout>
        </>
    )
}

export default ProfileWishListPage
