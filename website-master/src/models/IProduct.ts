import { IBrand } from './IBrand'
import { ICategories } from './ICategories'
import { IMetaListPagintation } from './IPagination'

export interface ISearch { 
    data: IProdust[];
    count:number;
} 
export interface IProdustsList {
    data: IProdust[]
    meta: IMetaListPagintation
}

export interface IProdustBasketData {
    data: IProdustBasket[]
}

export interface IProdustBasket {
    id: number
    title: string
    slug: string
    variation: IVariation
    quantity: number
}

export interface IProdustDetail {
    data: IProdust
}
export interface IVariation {
    id: number
    image: string
    price: string
    discounted_price: string
    quantity: number
    properties: PropertiesList[]
    article_number: string
    code: string;
    description:string;
    title:string;
}

export interface PropertiesListValues {
    id: number
    dop: string | null
    name: string
    textUrl: string
    variation?: number[]
    isDisabled?: boolean
}
export type Property = {
    key: number
    value: any
    variation: number[]
}
export interface PropertiesList {
    property: {
        id: number
        is_variation: string
        name: string
    }
    values: PropertiesListValues[]
}

export interface PropertiesCount {
    [key: number]: {
        count: number
    }
}
export interface IFilterCountData {
    category: string
    brand: number
    onlySales: boolean
    filterList: Record<number, number[]>
    brandsIds: {
        id: number
        name: string
        textUrl: string
    }[]
    rating: number
    minprice: number
    maxprice: number
}

export interface PropertiesListFilterData {
    data: PropertiesListFilter[]
    brands: {
        id: number
        name: string
        textUrl: string
        product_count: number
    }[]
    min_price: string
    max_price: string
}
export interface PropertiesListFilter {
    id: number
    name: string
    textUrl: string
    values: PropertiesListValues[]
}
export interface IProdust {
    id: number
    title: string
    slug: string
    is_top_sale: boolean
    is_new: boolean
    category: ICategories
    description: string
    seo_text: string
    variations: IVariation[]
    properties: PropertiesList[]

    brand: IBrand
    reviews: IReviews[]
    average_rating: number

    created_at: string
    updated_at: string

    picture: {
        id: number
        url: string
    }[]

    title_seo: string
    description_seo: string
}

export interface IReviews {
    id: number
    text: string
    rating: string
    created_at: string
    updated_at: string

    user: {
        id: number
        name: string
        last_name: string
        avatar: string
    }
    product: {
        id: number
        title: string
        image: string
        brand: {
            slug: string
            name: string
            image: string
        }
    }
}

export interface ISizeTableData {
    data: {
        description: string
        category: string
        images: string[]
    }
}

export function getBrandIds(
    brandsArray: {
        id: number
        name: string
        textUrl: string
    }[],
    brandNames: string
): {
    id: number
    name: string
    textUrl: string
}[] {
    const brandNamesArray = brandNames.split(',')

    const brandIds = brandsArray
        ?.filter((brand) => brandNamesArray.includes(brand.textUrl))
        .map((brand) => brand)

    return brandIds
}
