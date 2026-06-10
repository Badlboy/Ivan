import { AxiosResponse } from 'axios'
import $api from '@/http/axiosConfig'
import { IBrandDetail, IBrandList } from '@/models/IBrand'
import { AllowedLangs } from '@/constants/lang'

export default class brandService {
    static fetchBrand(
        locale: AllowedLangs = AllowedLangs.UK,
        type: string = ''
    ): Promise<AxiosResponse<IBrandList>> {
        return $api.get<IBrandList>(`/brands?lang=${locale}&type=${type}`)
    }
    static fetchBrandOne(
        slug: string | undefined | null,
        locale: AllowedLangs = AllowedLangs.UK,
        seo: string = ''
    ): Promise<AxiosResponse<IBrandDetail>> {
        return $api.get<IBrandDetail>(
            `/brands/${slug}?lang=${locale}&seo=${seo}`
        )
    }
}
