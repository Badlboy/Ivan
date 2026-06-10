export interface IBrandList {
    data: IBrand[]
}
export interface IBrandDetail {
    data: IBrand
}
export interface IBrand {
    id: number
    title: string
    name: string
    slug: string
    image: string

    description: string
    description_seo: string
    title_seo: string

    created_at: string
    updated_at: string
}
