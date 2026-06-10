import { AllowedLangs } from '@/constants/lang'
import $api from '@/http/axiosConfig'
import {
    IOrderCreateDetail,
    IOrderCreateOneClickDetail,
    IOrderItem,
} from '@/models/IOrder'
import { IPromocodDetail } from '@/models/IPromocod'
import { AxiosResponse } from 'axios'

export default class orderService {
    static fetchSearchPromocod(
        promocod: string
    ): Promise<AxiosResponse<IPromocodDetail>> {
        return $api.get<IPromocodDetail>(`/orders/promocod/search/${promocod}`)
    }
    static fetchCreateOrder(
        first_name: string,
        last_name: string,
        phone: string,
        email: string,
        delivery_method: string,
        delivery_address: string,
        city: string,
        department_postomat: string,
        payment_method: string,
        comment: string,
        promo_code_id: number,
        items: IOrderItem[],
        call_phone: boolean,
        locale: AllowedLangs = AllowedLangs.UK,
        utm_source?:string, 
        utm_campaign?:string, 
        utm_medium?:string,
    ): Promise<AxiosResponse<IOrderCreateDetail>> {
        return $api.post<IOrderCreateDetail>(`/orders`, {
            first_name: first_name ?? '',
            last_name: last_name ?? '',
            phone: phone ?? '',
            email: email ?? '',
            delivery_method: delivery_method ?? '',
            delivery_address: delivery_address ?? '',
            city: city ?? '',
            department_postomat: department_postomat ?? '',
            payment_method: payment_method ?? '',
            comment: comment ?? '',
            promo_code_id: promo_code_id ?? null,
            items: items ?? [],
            dont_call: call_phone ?? false,
            locale,
            utm_source,
            utm_campaign,
            utm_medium
        })
    }

    static fetchCreateOrderOneClick(
        name: string,
        phone: string,
        product_id: number,
        product_variation_id: number,
        utm_source?:string, 
        utm_campaign?:string, 
        utm_medium?:string,
    ): Promise<AxiosResponse<IOrderCreateOneClickDetail>> {
        return $api.post<IOrderCreateOneClickDetail>(`/orders/one-click`, {
            name,
            phone,
            product_id,
            product_variation_id,
            utm_source,
            utm_campaign,
            utm_medium
        })
    }
}
