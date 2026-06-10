'use client'
import { AllowedLangs } from '@/constants/lang'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const LangModal = React.memo(({ locale }: { locale: AllowedLangs }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const cleanPathname = pathname.replace(/^\/(en|ru)/, '')

    const currentUrl = `${cleanPathname}?${searchParams.toString()}`

    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div ref={dropdownRef} className="lang">
            <span
                onClick={() => setIsOpen(!isOpen)}
                className={isOpen ? 'active' : ''}
            >
                <span>{locale == AllowedLangs.UK ? 'UA' : locale}</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.9644 8.40625L10.0034 11.3672L7.05859 8.42234"
                        stroke="#111111"
                        strokeWidth="1.5"
                    />
                </svg>
            </span>
            <div
                className="lang-list"
                style={isOpen ? {} : { display: 'none' }}
            >
                <Link
                    prefetch={false}
                    href={
                        currentUrl != '/ru' && currentUrl != '/en'
                            ? currentUrl != '?'
                                ? currentUrl
                                : '/'
                            : '/'
                    }
                >
                    UA
                </Link>
                <Link prefetch={false} href={'/ru' + currentUrl}>
                    {AllowedLangs.RU}
                </Link>
                <Link prefetch={false} href={'/en' + currentUrl}>
                    {AllowedLangs.EN}
                </Link>
            </div>
        </div>
    )
})

LangModal.displayName = 'LangModal';

export default LangModal
