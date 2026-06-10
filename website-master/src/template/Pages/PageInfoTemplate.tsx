import { IPage } from '@/models/IPage'
import React from 'react'

const PageInfoTemplate = ({ pageData }: { pageData: IPage }) => {
    return (
        <article className='page-info-article'>
            <section className="section-page-info box-content">
                <div
                    className="section-page-info__box box-content__mini"
                    dangerouslySetInnerHTML={{
                        __html: pageData.description,
                    }}
                ></div>
            </section>
        </article>
    )
}

export default PageInfoTemplate
