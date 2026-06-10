'use client';

import { UTM_MARKERS } from "@/constants/localStorageConstants";
import { LocalStorageLib } from "@/libs/localStorageLib";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useMemo } from "react";

interface UtmContextProps { 
    utmSourse:string | undefined;
    utmMedium:string | undefined;
    utmCampaign:string | undefined;
}

export const UtmContext = createContext<UtmContextProps | null>({
    utmSourse:undefined,
    utmMedium:undefined,
    utmCampaign:undefined
});

interface UtmContextProviderProps { 
    children:ReactNode;
}

interface Markers { 
    utm_source:string,
    utm_medium:string,
    utm_campaign:string;
}

export const UtmContextProvider = (props:UtmContextProviderProps) => { 
    const {
        children,
    } = props;

    const searchParams = useSearchParams();
    const lsMarkers = LocalStorageLib.getItem(UTM_MARKERS);
    
    const value = useMemo(() => {
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
            return { 
                utmSourse,
                utmMedium,
                utmCampaign,
            }
        }
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
        return {
            utmSourse:undefined,
            utmMedium:undefined,
            utmCampaign:undefined
        };
    },[lsMarkers,searchParams]) 
    return ( 
        <UtmContext.Provider value={value}>
            {children}
        </UtmContext.Provider>
    )
};