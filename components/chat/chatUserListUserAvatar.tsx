"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import { useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";

interface UserAvatarNavProp {
    userProfileObjKey?: string
    userName?: string
}

export function ChatUserListUserAvatar({userProfileObjKey, userName}: UserAvatarNavProp) {

    const profileImageRes = useMediaFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');

    const nameInitial = getNameInitials(userName);


    return (

        <Avatar className='h-10 w-10 hover:cursor-pointer' >
            <AvatarImage src={profileImageRes.data?.url || ''}/>
            <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white ">{nameInitial}</AvatarFallback>
        </Avatar>


    )

}