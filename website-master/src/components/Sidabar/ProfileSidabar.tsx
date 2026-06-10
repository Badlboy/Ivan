'use client'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { API_URL_IMAGE } from '@/http/axiosConfig'
import { IUser } from '@/models/IUser'
import authService from '@/services/authService'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'

const ProfileSidabar = ({
    user,
    locale,
    isMain
}: {
    user: IUser | undefined
    locale: AllowedLangs,
    isMain: boolean
}) => {
    const { translations } = useLang()
    const { data: session } = useSession()
    const currentPath = usePathname()

    async function userLogout() {
        try {
            await authService.logout()
            await signOut({
                redirect: true,
                callbackUrl: getLangSlug(locale) + '/',
            })
        } catch (error: any) {
            console.error('Error fetching data:', error)
            toast.error(
                translations[locale].errors.error +
                ' ' +
                error?.response?.data?.message
            )
        }
    }

    return (
        <div className={"personal-menu" + (isMain ? ' main' : '')}>
            {user?.id ? (
                <Link
                    className={`personal-menu__info ${currentPath === getLangSlug(locale) + '/profile' || currentPath === getLangSlug(locale) + '/profile/info' ? 'active' : ''}`}
                    href={getLangSlug(locale) + '/profile/info'}
                >
                    <figure className="image">
                        {session?.user?.avatar ? (
                            <>
                                {session?.user?.avatar.startsWith('https://') ||
                                    session?.user?.avatar.startsWith('http://') ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.avatar}
                                        alt={user?.name}
                                        width={34}
                                        height={34}
                                    />
                                ) : (
                                    <Image
                                        src={
                                            session?.user?.avatar
                                                ? `${API_URL_IMAGE}${session.user.avatar}`
                                                : '/image/avatar.png'
                                        }
                                        alt={session?.user?.name}
                                        width={34}
                                        height={34}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {user?.avatar?.startsWith('https://') ||
                                    user?.avatar?.startsWith('http://') ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.avatar}
                                        alt={user?.name}
                                        width={34}
                                        height={34}
                                    />
                                ) : (
                                    <Image
                                        src={
                                            user?.avatar
                                                ? API_URL_IMAGE + user?.avatar
                                                : '/image/avatar.png'
                                        }
                                        alt={user?.name}
                                        width={34}
                                        height={34}
                                    />
                                )}
                            </>
                        )}
                    </figure>
                    <div>
                        {session?.user?.name ? (
                            <>
                                <span className="name">
                                    {session?.user?.name}{' '}
                                    {session?.user?.last_name}
                                </span>
                                <span className="email">
                                    {session?.user?.email}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="name">
                                    {user?.name} {user?.last_name}
                                </span>
                                <span className="email">{user.email}</span>
                            </>
                        )}
                    </div>
                </Link>
            ) : (
                ''
            )}
            <Link
                href={getLangSlug(locale) + '/profile/history'}
                className={`personal-menu__info ${currentPath === getLangSlug(locale) + '/profile/history' ? 'active' : ''}`}
            >
                {translations[locale].profile.history}
            </Link>
            <Link
                href={getLangSlug(locale) + '/profile/wish-list'}
                className={`personal-menu__info ${currentPath === getLangSlug(locale) + '/profile/wish-list' ? 'active' : ''}`}
            >
                {translations[locale].profile.wish_list}
            </Link>
            <span
                onClick={async () => userLogout()}
                className="personal-menu__item"
            >
                {translations[locale].profile.exit}
            </span>
        </div>
    )
}

export default ProfileSidabar
