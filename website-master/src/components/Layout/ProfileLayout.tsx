'use client'
import React from 'react'
import ProfileSidabar from '../Sidabar/ProfileSidabar'
import { IUser } from '@/models/IUser'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import Link from 'next/link'
import { getLangSlug } from '@/utils/function'

const ProfileLayout = ({
    children,
    user,
    locale,
    isMain = false
}: Readonly<{
    children: React.ReactNode
    user: IUser | undefined
    locale: AllowedLangs
    isMain?: boolean
}>) => {
    const { translations } = useLang()

    return (
        <article>
            <section className="section-personal-area box-content">
                <ProfileSidabar locale={locale} user={user} isMain={isMain} />
                <Link className="button-back" href={getLangSlug(locale) + '/profile'}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 4L7 10L13 16"
                            stroke="#111111"
                            strokeWidth="1.5"
                        />
                    </svg>
                    <span>{translations[locale]?.breadcrumb.back}</span>
                </Link>
                {children}
            </section>
        </article>
    )
}

export default ProfileLayout
