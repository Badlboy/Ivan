export interface IMetaListPagintation {
    current_page: number
    from: number
    last_page: number
    links: Link[]
    path: string
    per_page: number
    to: string
    total: string
}

interface Link {
    url: string
    label: string
    active: boolean
}
