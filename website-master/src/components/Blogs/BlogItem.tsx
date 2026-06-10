// components/Blogs/BlogItem.tsx
import Link from 'next/link'
import React from 'react'
import { IBlog } from '@/models/IBlog'
import { AllowedLangs } from '@/constants/lang'
import { getLangSlug, getNoPhotoLangs } from '@/utils/function'
import { API_URL_IMAGE } from '@/http/axiosConfig'
import Image from 'next/image'

interface IBlogProps extends IBlog {
    langText: string
    locale: AllowedLangs
}

const BlogItem = React.memo((blog: IBlogProps) => {
    return (
        <Link href={
            getLangSlug(blog.locale) + '/blogs/' + blog.slug
        } className="blogs-card">
            <Image
                src={
                    blog.image
                        ? API_URL_IMAGE + blog.image
                        : getNoPhotoLangs(blog.locale)
                }
                title={blog.title}
                style={{objectFit: "contain"}}
                alt={blog.title + ' - #1'}
                width="310"
                height="382"
                layout="responsive"
            />
            <div className="info-box">
                <div className="info">
                    <span className="title">{blog.title.length > 45
                        ? `${blog.title.slice(0, 45)}...`
                        : blog.title}</span>
                    <p className="hidden">{blog.description}</p>
                    <div className="bottom">
                        <span>{blog.created_at}</span>
                        <span>
                            {blog.langText}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
})

BlogItem.displayName = 'BlogItem';

export default BlogItem
