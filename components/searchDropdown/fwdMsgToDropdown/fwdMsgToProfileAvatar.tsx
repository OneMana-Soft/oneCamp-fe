"use client"

import {useFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface FwdMsgToProfileAvatarProps {
    userProfileObjKey: string
    userName: string
}
export const FwdMsgToProfileAvatar = ({userProfileObjKey, userName}: FwdMsgToProfileAvatarProps) => {
    const profileImageRes = useFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');
    const nameInitial = getNameInitials(userName);

    return (
        <Avatar className="w-8 h-8">
            <AvatarImage src={profileImageRes.data?.url} className='rounded-full'/>
            <AvatarFallback>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )
}

