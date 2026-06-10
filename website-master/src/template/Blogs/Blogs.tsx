'use client'
import BlogItem from '@/components/Blogs/BlogItem'
import PaginationBlogs from '@/components/Blogs/Pagination'
import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBlogList } from '@/models/IBlog'
import React from 'react'

const Blogs = ({
    locale,
    blogsData,
}: {
    locale: AllowedLangs
    blogsData: IBlogList
}) => {
    const { translations } = useLang()
    return (
        <article>
            <section className="section-blogs-list box-content">
                {blogsData.data.length > 0 ? (
                    <>
                        <div className="section-blogs-list__list">
                            {blogsData.data.map((item) => (
                                <BlogItem
                                    langText={translations[locale].blog.read}
                                    locale={locale}
                                    key={item.id}
                                    {...item}
                                />
                            ))}
                        </div>
                        <PaginationBlogs
                            locale={locale}
                            meta={blogsData.meta}
                        />
                    </>
                ) : (
                    <span className="title-section text-h1 center empty-title">
                        {translations[locale].blog.empty}
                    </span>
                )}
            </section>
        </article>
    )
}

export default Blogs
