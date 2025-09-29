"use client"

import {useFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import type * as React from "react";
import {UserProfileDataInterface} from "@/types/user";

interface ChannelMessageAvatarProps {
    userInfo?: UserProfileDataInterface;
}
export const ChannelMessageAvatar = ({userInfo}: ChannelMessageAvatarProps) => {

    const profileImageRes = useFetch<GetMediaURLRes>(userInfo?.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo?.user_name);

    return (
        <Avatar className="h-full w-full">
            <AvatarImage src={profileImageRes.data?.url} className='rounded-2xl'/>
            <AvatarFallback>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )
}

