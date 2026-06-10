
import $api from "@/http/axiosConfig";
import { AxiosResponse } from "axios";

interface DropShipingData { 
    url:string;
    description:string;
    phone:string;
    email:string;
    'g-recaptcha-response':string;
}
interface DropShipingResponce { 

}
export default class dropShipingService {
    static sendDropShipingRequest(data:DropShipingData): Promise<AxiosResponse<DropShipingResponce>> {
        return $api.post<DropShipingResponce>('dropship-partners/store',data);
    }
}