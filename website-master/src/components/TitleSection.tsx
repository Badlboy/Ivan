import React from 'react'
import Breadcrumb from './Breadcrumb'
import { IBreadcrumb } from '@/models/IBreadcrumb'
import { AllowedLangs } from '@/constants/lang'

const TitleSection = ({
    title,
    breadcrumbList,
    locale,
}: {
    title: string
    breadcrumbList: IBreadcrumb[]
    locale: AllowedLangs
}) => {
    return (
        <article className="section-title-page-box box-content">
            <Breadcrumb
                locale={locale}
                breadcrumbList={breadcrumbList}
                thisTitle={title}
                box={false}
            />
            <section className="title-page">
                <h1>{title}</h1>
            </section>
        </article>
    )
}

export default TitleSection
