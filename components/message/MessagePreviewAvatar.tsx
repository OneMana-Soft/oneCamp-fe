import {UserProfileDataInterface} from "@/types/user";
import {useFetch, useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import type * as React from "react";

interface MessagePreviewAvatarProps {
    userInfo?: UserProfileDataInterface;
}
export const MessagePreviewAvatar = ({userInfo}: MessagePreviewAvatarProps) => {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo && userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo && userInfo.user_name);

    return (
        <Avatar className="h-9 w-9">
            <AvatarImage src={profileImageRes.data?.url} className='rounded-2xl'/>
            <AvatarFallback>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )
}

