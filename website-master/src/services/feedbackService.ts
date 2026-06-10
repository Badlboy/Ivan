import $api from "@/http/axiosConfig";
import { AxiosResponse } from "axios";

export default class feedBackService {
    static getGoogleRecaptionSiteKey(): Promise<AxiosResponse<{site_key: string}>> {
        return $api.get<{site_key: string}>('recaption-site-key');
    }
}