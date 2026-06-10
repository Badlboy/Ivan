import { IMetaListPagintation } from '@/models/IPagination'
import React from 'react'
import Link from 'next/link'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const PaginationBlogs = ({
    locale,
    meta,
}: {
    locale: AllowedLangs
    meta: IMetaListPagintation
}) => {
    const { translations } = useLang()
    if (meta.last_page == 1) {
        return
    }
    const renderPageNumbers = () => {
        const links = []
        const totalNumbers = 6
        const totalPages = meta.last_page

        const halfTotalNumbers = Math.floor(totalNumbers / 2)
        const startPage = Math.max(2, meta.current_page - halfTotalNumbers)
        const endPage = Math.min(
            totalPages - 1,
            meta.current_page + halfTotalNumbers
        )

        links.push(
            <Link
                key={1}
                href={`?page=1`}
                className={meta.current_page === 1 ? 'active' : ''}
            >
                1
            </Link>
        )

        if (startPage > 2) {
            links.push(<span key="start-dots">...</span>)
        }

        for (let i = startPage; i <= endPage; i++) {
            links.push(
                <Link
                    key={i}
                    href={`?page=${i}`}
                    className={meta.current_page === i ? 'active' : ''}
                >
                    {i}
                </Link>
            )
        }

        if (endPage < totalPages - 1) {
            links.push(<span key="end-dots">...</span>)
        }

        if (totalPages > 1) {
            links.push(
                <Link
                    key={totalPages}
                    href={`?page=${totalPages}`}
                    className={meta.current_page === totalPages ? 'active' : ''}
                >
                    {totalPages}
                </Link>
            )
        }

        return links
    }
    return (
        <div className="pagination">
            <div className="dots">
                {meta.current_page > 1 ? (
                    <Link href={`?page=${meta.current_page - 1}`}>
                        {translations[locale].catalog.pagintaion.prev}
                    </Link>
                ) : null}
                <div className="number">{renderPageNumbers()}</div>
                {meta.current_page !== meta.last_page ? (
                    <Link href={`?page=${meta.current_page + 1}`}>
                        {translations[locale].catalog.pagintaion.next}
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

export default PaginationBlogs
