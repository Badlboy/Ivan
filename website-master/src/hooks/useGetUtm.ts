import { useSearchParams } from "next/navigation";
import { LocalStorageLib } from "@/libs/localStorageLib";
import { UTM_MARKERS } from "@/constants/localStorageConstants";

interface Markers { 
    utm_source:string,
    utm_medium:string,
    utm_campaign:string;
}

export const useGetUtm = () => {
    const searchParams = useSearchParams();
    const lsMarkers = LocalStorageLib.getItem(UTM_MARKERS);

    if(lsMarkers !== null) {
        const markers = JSON.parse(lsMarkers) as Markers;
        const utmSourse = markers.utm_source;
        const utmMedium = markers.utm_medium;
        const utmCampaign = markers.utm_campaign;
        return { 
            utmSourse,
            utmMedium,
            utmCampaign,
        }
    }
    const utmSourse = searchParams.get('utm_source') || undefined;
    const utmMedium = searchParams.get('utm_medium') || undefined;
    const utmCampaign = searchParams.get('utm_campaign') || undefined;

    if(utmMedium && utmSourse && utmCampaign) { 
        const markers:Markers = {
            'utm_source':utmSourse,
            'utm_medium':utmMedium,
            'utm_campaign':utmCampaign
        }
        LocalStorageLib.setItem(UTM_MARKERS,JSON.stringify(markers));
    }
    return { 
        utmSourse,
        utmMedium,
        utmCampaign,
    }
};