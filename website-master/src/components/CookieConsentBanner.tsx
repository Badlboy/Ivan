'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { getLangSlug } from '@/utils/function'
import Link from 'next/link'
import React from 'react'
import CookieConsent from 'react-cookie-consent'

const CookieConsentBanner = ({ locale }: { locale: AllowedLangs }) => {
    const { translations } = useLang()
    return (
        <div className="CookieConsentFixed">
            <CookieConsent
                location="bottom"
                buttonText={translations[locale].system.cookie_btn}
                cookieName="myAwesomeCookieName"
                expires={365}
                style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'initial',
                }}
                buttonStyle={{}}
                buttonClasses="btn-black big"
                contentStyle={{
                    margin: 0,
                    color: '#111',
                    display: 'block',
                }}
            >
                {translations[locale].system.cookie}{' '}
                <Link
                    prefetch={false}
                    href={getLangSlug(locale) + '/privacy-policy'}
                >
                    {translations[locale].system.cookie_more}
                </Link>
            </CookieConsent>
        </div>
    )
}

export default CookieConsentBanner
