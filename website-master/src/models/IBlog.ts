import { IMetaListPagintation } from './IPagination'

export interface IBlogList {
    data: IBlog[]
    meta: IMetaListPagintation
}
export interface IBlogDetail {
    data: IBlog
    sidebar: IBlog[]
}
export interface IBlog {
    id: number
    slug: string
    image: string
    image_detail: string

    title: string
    description: string
    title_seo: string
    description_seo: string

    created_at: string
    updated_at: string
}
