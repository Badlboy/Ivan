export interface ICategoriesList {
    data: ICategories[]
}
export interface ICategoriesDetail {
    data: ICategories
}
export interface ICategories {
    id: number
    slug: string
    image: string
    parent: ICategories
    created_at: string
    updated_at: string

    title: string
    description: string

    title_seo: string
    description_seo: string
}

export interface ICategoriesLittleList {
    data: ICategoriesLittle[]
}

export interface ICategoriesLittle {
    id: number
    slug: string
    title: string
    children: ICategoriesLittle[]
}

export interface ICategorySEO {
    data: {
        title_seo: string
        description_seo: string
    }
}
