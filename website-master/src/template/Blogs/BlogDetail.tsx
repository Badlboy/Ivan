import { AllowedLangs } from '@/constants/lang'
import { useLang } from '@/hooks/useLang'
import { IBlogDetail } from '@/models/IBlog'
import React from 'react'
import Image from 'next/image'
import { API_URL_IMAGE, SITE_URL } from '@/http/axiosConfig'
import Link from 'next/link'
import { getLangSlug, getNoPhotoLangs } from '@/utils/function'

const BlogDetail = ({
    locale,
    blogData,
}: {
    locale: AllowedLangs
    blogData: IBlogDetail
}) => {
    const { translations } = useLang()
    const [day, month, year] = blogData.data.created_at.split('/');
    const date = new Date(`${year}-${month}-${day}T12:00:00Z`);
    const isoDate = date.toISOString();
    const finalDate = isoDate.split('.')[0] + "Z";

    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": SITE_URL + '/blogs/' + blogData.data.slug,
        },
        "headline": blogData.data.title,
        "description": "Краткое описание статьи",
        "image": API_URL_IMAGE + blogData.data.image_detail,
        "author": {
            "@type": "Person",
            "name": "Footbalshop"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Footbalshop",
            "logo": {
                "@type": "ImageObject",
                "url": "/image/Logo.png",
            }
        },
        "datePublished": finalDate
    };
    return (
        <>
            <article>
                <section className="section-blogs-detail box-content">
                    <div className="text">
                        {blogData?.data?.image_detail ? (
                            <Image
                                src={API_URL_IMAGE + blogData.data.image_detail}
                                title={blogData.data.title}
                                alt={blogData.data.title}
                                style={{objectFit: "contain"}}
                                width={860}
                                height={320}
                            />
                        ) : (
                            ''
                        )}
                        <h1>{blogData.data.title}</h1>
                        <div className="info">
                            <span>{blogData.data.created_at}</span>
                            <span>
                                {translations[locale].blog.author}:{' '}
                                <span>Footbalshop</span>
                            </span>
                        </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: blogData.data.description,
                            }}
                        ></div>
                    </div>
                    {blogData.sidebar.length > 0 ? (
                        <aside className="sidebar">
                            <span className="title">
                                {translations[locale].blog.last}
                            </span>
                            <div className="news-list">
                                {blogData.sidebar.map((item) => (
                                    <Link
                                        key={item.id}
                                        className="news-list__item"
                                        href={
                                            getLangSlug(locale) +
                                            '/blogs/' +
                                            item.slug
                                        }
                                    >
                                        <Image
                                            src={item.image
                                                ? API_URL_IMAGE + item.image
                                                : getNoPhotoLangs(locale)}
                                            title={item.title}
                                            alt={item.title}
                                            width={200}
                                            height={120}
                                        />
                                        <div>
                                            <span className="title">
                                                {item.title}
                                            </span>
                                            <span className="desc">
                                                {item.description}
                                            </span>
                                            <span className="date">
                                                {item.created_at}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    ) : (
                        ''
                    )}
                </section>
            </article>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(blogSchema),
                }}
            />
        </>
    )
}

export default BlogDetail
