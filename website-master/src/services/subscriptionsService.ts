import { AxiosResponse } from 'axios'
import { ResponseSolo } from '../models/response/soloResponse'
import $api from '@/http/axiosConfig'
import { AllowedLangs } from '@/constants/lang'

export default class subscriptionsService {
    static fetchCreateSubscriptions(
        email: string,
        lang: AllowedLangs = AllowedLangs.UK
    ): Promise<AxiosResponse<ResponseSolo>> {
        return $api.post<ResponseSolo>('/subscriptions', { email, lang })
    }
}
