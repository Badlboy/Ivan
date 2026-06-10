export interface ResponseSolo {
    message: string
}

export interface SeoTags {
    id: number
    title_seo: string
    description_seo: string
    title: string | undefined
    slug?: string
}
