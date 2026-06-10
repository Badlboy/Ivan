import { User as NextAuthUser } from 'next-auth'

export interface IUser extends NextAuthUser {
    id: string
    email: string
    name: string
    last_name: string
    avatar: string
    phone: string
    roles: string[]
    favorites: number[]
}

export interface IUserData {
    data: IUser
}

export interface IUserAddressData {
    message: string
    data: IUserAddress
}
export interface IUserAddressDataList {
    data: IUserAddress[]
}
export interface IUserAddressDataOne {
    data: IUserAddress
}

export interface IUserAddress {
    id: number
    user_id: number
    is_active: boolean
    first_name: string
    last_name: string
    phone: string
    delivery_method: string
    delivery_address: string
    city: string
    department_postomat: string
    created_at: string
    updated_at: string
}

export interface IUserAddressForm {
    first_name: string
    last_name: string
    phone: string
    delivery_method: string
    delivery_address: string
    city: string
    department_postomat: string
}
