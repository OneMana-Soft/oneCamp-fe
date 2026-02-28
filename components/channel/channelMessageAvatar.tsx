"use client"

import { useMediaFetch } from "@/hooks/useFetch"
import type { GetMediaURLRes } from "@/types/file"
import { GetEndpointUrl } from "@/services/endPoints"
import { getNameInitials } from "@/lib/utils/format/getNameIntials"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChannelMessageAvatarProps {
    userProfileKey?: string
    userName: string
}

export const ChannelMessageAvatar = ({ userName,  userProfileKey}: ChannelMessageAvatarProps) => {

    const profileImageRes = useMediaFetch<GetMediaURLRes>(
        userProfileKey ? GetEndpointUrl.PublicAttachmentURL + "/" + userProfileKey : "",
    )
    const nameInitial = getNameInitials(userName)

    return (
        <Avatar className="h-full w-full">
            <AvatarImage src={profileImageRes.data?.url} className="rounded-2xl" />
            <AvatarFallback>{nameInitial}</AvatarFallback>
        </Avatar>
    )
}
