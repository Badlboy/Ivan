'use client'
/* eslint-disable react/no-unstable-nested-components */
import cn from 'classnames';
import RCPagination, { PaginationProps } from 'rc-pagination';
import en from 'rc-pagination/lib/locale/en_US';
import { PageControl } from '../PageControl';
import styles from './Pagination.module.scss';

interface PaginationMProps extends PaginationProps {
    pageCount: number;
    onPageChange: (page: number) => void;
    activePage: number;
    className?: string;
}

export const Pagination = (props: PaginationMProps) => {
    const {
        className,
        pageCount,
        activePage,
        onPageChange,
        ...paginationRest
    } = props;
    if (pageCount <= 1) return null;

    return (
        <div className={cn(className)}>
            <RCPagination
                className={styles.root}
                current={activePage}
                showLessItems
                pageSize={1}
                onChange={onPageChange}
                total={pageCount}
                locale={en}
                itemRender={
                    (page, type) => {
                        if (type === 'jump-next' || type === 'jump-prev') {
                            return (
                                <PageControl>
                                    ...
                                </PageControl>
                            );
                        }
                        if (type === 'prev') {
                            return (
                                <PageControl isArrow disabled={activePage === 1}>
                                    &lt;
                                </PageControl>
                            );
                        }
                        if (type === 'next') {
                            return (
                                <PageControl isArrow disabled={activePage === pageCount}>
                                    &gt;
                                </PageControl>
                            );
                        }
                        if (type === 'page') {
                            return (
                                <PageControl
                                    isActive={activePage === page}
                                    key={page}
                                    onClick={() => onPageChange?.(page)}
                                >
                                    {page}
                                </PageControl>
                            );
                        }
                        return null;
                    }
                }
                {...paginationRest}
            />
        </div>
    );
};
