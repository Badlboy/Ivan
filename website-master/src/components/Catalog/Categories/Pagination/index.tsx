import { IMetaListPagintation } from '@/models/IPagination'
import React from 'react'
import Link from 'next/link'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'

const PaginationCatalog = ({
    meta,
    locale,
    setLoadMore,
    sort = '',
    sales = false
}: {
    meta: IMetaListPagintation
    locale: AllowedLangs
    setLoadMore: any,
    sort: string,
    sales: boolean
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
                href={{
                    pathname: '', query: {
                        page: 1, ...(sort != '' && { sort }),
                        ...(sales && { sales: 'sales' }),
                    }
                }}
                className={meta.current_page == 1 ? 'active' : ''}
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
                    href={{
                        pathname: '', query: {
                            page: i, ...(sort != '' && { sort }),
                            ...(sales && { sales: 'sales' })
                        }
                    }}
                    className={meta.current_page == i ? 'active' : ''}
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
                    href={{
                        pathname: '', query: {
                            page: totalPages, ...(sort != '' && { sort }),
                            ...(sales && { sales: 'sales' })
                        }
                    }}
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
            <span className="info">
                {translations[locale].catalog.pagintaion.show} {meta.from}-
                {meta.to} {translations[locale].catalog.pagintaion.product}{' '}
                {meta.total}
            </span>
            {meta.last_page > 1 && meta.current_page !== meta.last_page ? (
                <LoadMoreButton
                    setLoadMore={setLoadMore}
                    currentPage={meta.current_page}
                    title={translations[locale].catalog.pagintaion.load_more}
                />
            ) : null}
            <div className="dots">
                {meta.current_page > 1 ? (
                    <Link href={{
                        pathname: '', query: {
                            page: meta.current_page - 1, ...(sort != '' && { sort }),
                            ...(sales && { sales: 'sales' })
                        }
                    }}>
                        {translations[locale].catalog.pagintaion.prev}
                    </Link>
                ) : null}
                <div className="number">{renderPageNumbers()}</div>
                {meta.current_page !== meta.last_page ? (
                    <Link href={{
                        pathname: '', query: {
                            page: meta.current_page + 1, ...(sort != '' && { sort }),
                            ...(sales && { sales: 'sales' })
                        }
                    }}>
                        {translations[locale].catalog.pagintaion.next}
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

export default PaginationCatalog

const LoadMoreButton = ({
    currentPage,
    title,
    setLoadMore
}: {
    currentPage: number
    title: string,
    setLoadMore: any
}) => {
    return (
        <button onClick={() => setLoadMore(currentPage + 1)} className="btn-opacity">
            {title}
        </button>
    )
}
