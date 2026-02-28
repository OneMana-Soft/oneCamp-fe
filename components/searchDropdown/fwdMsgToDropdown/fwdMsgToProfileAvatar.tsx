"use client"

import {useFetch, useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface FwdMsgToProfileAvatarProps {
    userProfileObjKey: string|undefined
    userName: string
}
export const FwdMsgToProfileAvatar = ({userProfileObjKey, userName}: FwdMsgToProfileAvatarProps) => {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');
    const nameInitial = getNameInitials(userName);

    return (
        <Avatar className="w-6 h-6">
            <AvatarImage src={profileImageRes.data?.url} className='rounded-full'/>
            <AvatarFallback>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )
}

