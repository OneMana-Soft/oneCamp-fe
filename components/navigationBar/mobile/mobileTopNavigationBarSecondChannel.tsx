"use client"

import {usePathname} from "next/navigation";
import {Star} from "lucide-react";
import {useFetch} from "@/hooks/useFetch";
import {getStaticPaths} from "next/dist/build/templates/pages";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {usePost} from "@/hooks/usePost";

export function MobileTopNavigationBarSecondChannel({channelUUID}:{channelUUID: string}) {

    const [isFavorite, setFavorite] = useState<boolean>(false)
    const channelInfo  = useFetch<ChannelInfoInterfaceResp>(`${GetEndpointUrl.ChannelBasicInfo}/${channelUUID}`);
    const postFav  = usePost()


    useEffect(()=>{

        setFavorite(channelInfo.data?.channel_info.ch_is_user_fav || false)

    }, [channelInfo.data?.channel_info.ch_is_user_fav])

    if(!channelInfo.data && !channelInfo.isLoading) return

    const toggleFavourite = async () => {
        if(isFavorite) {
            await postFav.makeRequest({apiEndpoint: PostEndpointUrl.RemoveFavChannel, appendToUrl:`/${channelUUID}`, onSuccess : ()=>{
                    setFavorite(false)}})
        } else {
            await postFav.makeRequest({apiEndpoint: PostEndpointUrl.AddFavChannel, appendToUrl:`/${channelUUID}`, onSuccess : ()=>{setFavorite(true)}})
        }
    }



    return (
        <div className='flex justify-center items-center space-x-3'>

            <div className='font-bold text-lg text-center truncate overflow-auto overflow-ellipsis'>
                {channelInfo.data?.channel_info.ch_name}
            </div>
            <Star  onClick={toggleFavourite} className='text-muted-foreground text-center' fill={isFavorite ?"#ffcc00":'none'} size={20}/>

        </div>

    );
}