import { AxiosResponse } from 'axios'
import {
    IAboutUsDetail,
    ICareerDetail,
    IContactDetail,
    IDeliveryAndPaymentData,
    IMainPageBanner,
    IMainPageDetail,
    IPageDetail,
    ISEOTemplate,
} from '../models/IPage'
import $api from '@/http/axiosConfig'
import { ResponseSolo } from '@/models/response/soloResponse'
import { AllowedLangs } from '@/constants/lang'

export default class pagesService {
    static fetchPage(
        type: string,
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IPageDetail>> {
        return $api.get<IPageDetail>(`/pages/${type}?lang=${locale}&seo=${seo}`)
    }
    static fetchContact(
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<IContactDetail>> {
        return $api.get<IContactDetail>(`/contacts?lang=${locale}`)
    }
    static fetchAboutUs(
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IAboutUsDetail>> {
        return $api.get<IAboutUsDetail>(`/about-us?lang=${locale}&seo=${seo}`)
    }
    static fetchCareer(
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<ICareerDetail>> {
        return $api.get<ICareerDetail>(`/career?lang=${locale}&seo=${seo}`)
    }
    static fetchDeliveryAndPayment(
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IDeliveryAndPaymentData>> {
        return $api.get<IDeliveryAndPaymentData>(
            `/delivery-payment?lang=${locale}&seo=${seo}`
        )
    }
    static sendAboutUsForm(
        formData: FormData
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>(`/about-us/form`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    static sendCareer(
        formData: FormData
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>(`/career/form`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    static fetchMainPage(
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<IMainPageDetail>> {
        return $api.get<IMainPageDetail>(`/pages/main-page?lang=${locale}`)
    }
    static fetchMainBanners(
        locale:AllowedLangs = AllowedLangs.UK
    ):Promise<AxiosResponse<IMainPageBanner>> { 
        return $api.get<IMainPageBanner>(`main-banner?lang=${locale}`);
    }

    static fetchMainSlider(
        locale:AllowedLangs = AllowedLangs.UK
    ):Promise<AxiosResponse<IMainPageBanner>> { 
        return $api.get<IMainPageBanner>(`main-slider?lang=${locale}`);
    }

    static fetchSEOTagsTemplate(
        locale: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ISEOTemplate>> {
        return $api.get<ISEOTemplate>(`/pages/seo-tags?lang=${locale}`)
    }
}
