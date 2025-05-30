import type * as React from "react";
import {UserProfileDataInterface} from "@/types/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";

interface SingleAvatarProps  {
    userInfo: UserProfileDataInterface

}

export function SingleAvatar({ userInfo }: SingleAvatarProps) {
    const profileImageRes = useFetch<GetMediaURLRes>(userInfo.user_profile_object_key ? GetEndpointUrl.PublicAttachmentURL+'/'+userInfo.user_profile_object_key : '');
    const nameInitial = getNameInitials(userInfo.user_name);

    return (
        <Avatar className="h-full w-full">
            <AvatarImage src={profileImageRes.data?.url} />
            <AvatarFallback>
                {nameInitial}
            </AvatarFallback>
        </Avatar>
    )

}