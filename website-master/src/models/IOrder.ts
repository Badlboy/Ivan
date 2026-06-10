import { IVariation } from './IProduct'
import { IPromocod } from './IPromocod'

export interface IOrderList {
    data: IOrder[]
}
export interface IOrderDetail {
    data: IOrder
}
export interface IOrder {
    id: number
    first_name: string
    last_name: string
    phone: string
    email: string
    delivery_method: string
    delivery_address: string
    department_postomat: string
    payment_method: string
    comment: string
    status: string
    promo_code_id: IPromocod
    total_cost: string

    delivery_cost: string
    discount: string
    order_items: OrderItems[]

    created_at: string
    updated_at: string
}
export interface OrderItems {
    id: number
    order_id: number
    product_id: number
    variation_id: number
    quantity: number
    product_name: {
        id: number
        slug: string
        title: string
    }
    variation_details: IVariation
}

export interface IOrderCreateDetail {
    message?: string
    order: IOrder
    ecommerce_data: IEcommerceData
}
export interface IOrderCreateOneClickDetail {
    data: {
        id: number
        name: string
        phone: string
    }
    ecommerce_data: IEcommerceData
}

interface IEcommerceItem {
    item_id: string
    item_name: string
    affiliation: string
    quantity: number
    price: number
    item_brand: string
    item_category: string
    item_variant: string
    coupon: string
    discount: number
}

interface IEcommerceData {
    transaction_id: number
    value: number
    currency: string
    items: IEcommerceItem[]
    coupon: string
}
export interface IUserBasket {
    first_name: string
    last_name: string
    phone: string
    email: string
    delivery_method: string
    city: string
    department_postomat: string
    delivery_address: string
}

export interface IOrderItem {
    product_id: number
    variation_id: number
    quantity: number
}
