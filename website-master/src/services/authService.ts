import $api from '@/http/axiosConfig'
import { AxiosResponse } from 'axios'
import { authResponse } from '../models/response/authResponse'
import {
    IUserAddressData,
    IUserAddressDataList,
    IUserAddressDataOne,
    IUserData,
} from '@/models/IUser'
import { IOrderList } from '@/models/IOrder'
import { IProdustsList } from '@/models/IProduct'
import { ResponseSolo } from '@/models/response/soloResponse'
import { AllowedLangs } from '@/constants/lang'

export default class authService {
    static auth(
        email: string,
        password: string,
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<authResponse>> {
        return $api.post<authResponse>('/auth/login', {
            email,
            password,
            locale,
        })
    }
    static logout(): Promise<void> {
        return $api.get('/auth/logout')
    }
    static refresh(): Promise<AxiosResponse<authResponse>> {
        return $api.get<authResponse>('/auth/refresh')
    }

    static userIsVerifyEmail(
        token: string
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/auth/verify-email', {
            token,
        })
    }

    static userRegister(
        name: string,
        last_name: string,
        email: string,
        password: string,
        password_confirmation: string,
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/auth/register', {
            name,
            last_name,
            email,
            password,
            password_confirmation,
            locale,
        })
    }

    static userPasswordForgot(
        email: string,
        locale: AllowedLangs
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/auth/password/forgot', {
            email,
            locale,
        })
    }
    static userPasswordReset(
        token: string,
        email: string,
        password: string,
        password_confirmation: string,
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/auth/password/reset', {
            token,
            email,
            password,
            password_confirmation,
            locale,
        })
    }

    static userChangePassword(
        old_password: string,
        password: string,
        password_confirmation: string,
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<authResponse>> {
        return $api.post<authResponse>('/auth/change-password', {
            old_password,
            password,
            password_confirmation,
            locale,
        })
    }
    static fetchUser(): Promise<AxiosResponse<IUserData>> {
        return $api.get<IUserData>('/auth/profile')
    }
    static fetchUserOrders(
        locale: AllowedLangs = AllowedLangs.UK,
        sort: string
    ): Promise<AxiosResponse<IOrderList>> {
        return $api.get<IOrderList>(`/orders?lang=${locale}&status=${sort}`)
    }

    static getFavorite(): Promise<AxiosResponse<IProdustsList>> {
        return $api.get<IProdustsList>('/auth/favorites')
    }
    static addFavorite(
        product_id: number
    ): Promise<AxiosResponse<authResponse>> {
        return $api.post<authResponse>('/auth/favorites', { product_id })
    }
    static removeFavorite(
        product_id: number
    ): Promise<AxiosResponse<authResponse>> {
        return $api.post<authResponse>('/auth/favorites/remove', { product_id })
    }

    static updateUser(data: FormData): Promise<AxiosResponse<IUserData>> {
        return $api.post<IUserData>('/auth/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    static getBasket(): Promise<AxiosResponse<IProdustsList>> {
        return $api.get<IProdustsList>('/auth/basket')
    }

    static getUserAddressOne(): Promise<AxiosResponse<IUserAddressDataOne>> {
        return $api.get<IUserAddressDataOne>('/auth/address?type=active')
    }

    static getUserAddress(): Promise<AxiosResponse<IUserAddressDataList>> {
        return $api.get<IUserAddressDataList>('/auth/address')
    }
    static getUserSetActiveAddress(
        address_id: number
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.get<ResponseSolo>(
            '/auth/address/' + address_id + '/set-active'
        )
    }
    static createUserAddress(
        first_name: string,
        last_name: string,
        phone: string,
        delivery_method: string,
        delivery_address: string,
        city: string,
        department_postomat: string
    ): Promise<AxiosResponse<IUserAddressData>> {
        return $api.post<IUserAddressData>('/auth/address', {
            first_name,
            last_name,
            phone,
            delivery_method,
            delivery_address,
            city,
            department_postomat,
        })
    }
    static updateUserAddress(
        address_id: number,
        first_name: string,
        last_name: string,
        phone: string,
        delivery_method: string,
        delivery_address: string,
        city: string,
        department_postomat: string
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.put<ResponseSolo>('/auth/address/' + address_id, {
            first_name,
            last_name,
            phone,
            delivery_method,
            delivery_address,
            city,
            department_postomat,
        })
    }

    static removeUserAddress(
        address_id: number
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.delete<ResponseSolo>('/auth/address/' + address_id)
    }
}
