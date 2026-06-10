import { IBlog } from './IBlog'
import { IProdust, IReviews } from './IProduct'

export interface IPageDetail {
    data: IPage
}
export interface IPage {
    id: number
    title: string
    description: string
    description_seo: string
    title_seo: string

    created_at: string
    updated_at: string
}

export interface IContactDetail {
    data: IContact
}

export interface IContact {
    phone1: string
    phone2: string
    email: string
    link_facebook: string
    link_youtube: string
    link_telegram: string
    link_viber: string
    link_instagram: string
    work1: string
    work2: string
    banner_text: string
    banner_link: string
    description_order: string
    title_order: string
    address: string
    address_link: string
}

export interface IAboutUsDetail {
    data: IAboutUs
}

export interface IAboutUsItem {
    name: string
    description: string
}
export interface IAboutUs {
    id: number
    image: string
    phone: string

    title: string
    description: string
    description_seo: string
    title_seo: string
    title2: string
    description2: string
    title3: string
    description3: string
    elements: IAboutUsItem[]

    created_at: string
    updated_at: string
}

export interface IDeliveryAndPaymentItem {
    image: string
    name: string
    price: string
    time: string
}
export interface IDeliveryAndPaymentData {
    data: IDeliveryAndPayment
}
export interface IDeliveryAndPayment {
    id: number
    title: string
    description: string
    description_seo: string
    title_seo: string
    title2: string
    description2: string
    title3: string
    description3: string

    elements: IDeliveryAndPaymentItem[]

    created_at: string
    updated_at: string
}

export interface ICareerDetail {
    data: ICareer
}
export interface ICareerItem {
    name: string
    description: string
}
export interface ICareer {
    id: number
    title: string
    description: string
    description_seo: string
    title_seo: string
    title2: string
    vacancies: string[]
    advantages: ICareerItem[]

    created_at: string
    updated_at: string
}

export interface IMainPageDetail {
    data: IMainPage
}
export interface IMainPage {
    banner_title: string
    title: string
    description: string

    created_at: string
    updated_at: string
}
export interface IMainPageBanner{ 
    data:{
        id: number;
        title: string;
        description:string;
        sort: null,
        image: string;
        category_url: string;
        category_title: string;
    }[];
    links: {
        first: string;
        last: string;
        prev: null,
        next: null
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: string[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    }
}
export interface IMainPage {
    id: number
    products_new: IProdust[]
    products_hit: IProdust[]
    blog: IBlog[]
    comments: IReviews[]
    title2: string
    description2: string
    seo_text: string

    title_seo: string
    description_seo: string

    category: IMainPageProductInfo[]
}

export interface IMainPageProductInfo {
    image: any
    slug: {
        id: number
        slug: string
    }
    name: string
    description: string
}

export interface ISEOTemplate {
    data: {
        meta_title_template_1: string
        meta_description_template_1: string
        meta_title_template_2: string
        meta_description_template_2: string
        meta_title_template_3: string
        meta_description_template_3: string
    }
}
