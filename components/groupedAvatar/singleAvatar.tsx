import type * as React from "react";
import {UserProfileDataInterface} from "@/types/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useFetch, useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";

interface SingleAvatarProps  {
    userInfo: UserProfileDataInterface

}

export function SingleAvatar({ userInfo }: SingleAvatarProps) {
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo.user_name);

    return (
        <Avatar className="h-full w-full">
            <AvatarImage src={profileImageRes.data?.url} />
            <AvatarFallback className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )

}