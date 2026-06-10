'use client'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { hasText } from '@/utils/function'
import React, { useState } from 'react'

const SectionSeoText = React.memo(({
    text,
    locale,
}: {
    text: string
    locale: AllowedLangs
}) => {
    const { translations } = useLang()
    const [isOpen, setOpen] = useState(text?.length > 400 ? false : true)

    if (!text || !hasText(text)) {
        return
    }

    return (
        <article className={"box-content section-seo-text__box" + (text?.length < 400 ? ' show' : '')}>
            <div style={!isOpen ? {} : { height: 'auto' }}>
                <section
                    className={"section-seo-text"}
                    dangerouslySetInnerHTML={{
                        __html: text,
                    }}
                ></section>
            </div>
            {text?.length > 400 ? (
                <span onClick={() => setOpen(!isOpen)} className="load-more">
                    {!isOpen
                        ? translations[locale].system.expand
                        : translations[locale].system.expandReset}
                </span>
            ) : ''}
        </article>
    )
})

SectionSeoText.displayName = 'SectionSeoText';

export default SectionSeoText
