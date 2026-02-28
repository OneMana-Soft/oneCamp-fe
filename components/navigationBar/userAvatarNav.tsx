"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import { memo } from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/format/getNameIntials";
import {USER_STATUS_ONLINE} from "@/types/user";
import {useUserInfoState} from "@/hooks/useUserInfoState";

interface UserAvatarNavProp {
    toolTipString?: string
    userProfileObjKey?: string
    userName?: string
    isOnline?: boolean
    userUUID?: string
}

export const UserAvatarNav = memo(({toolTipString, userProfileObjKey, userName, isOnline: manualIsOnline, userUUID}: UserAvatarNavProp) => {

    const userStatusState = useUserInfoState(userUUID);
    const profileImageRes = useMediaFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');

    const nameInitial = getNameInitials(userName);

    const isOnline = manualIsOnline ?? (userStatusState?.status === USER_STATUS_ONLINE && (userStatusState?.deviceConnected || 0) > 0);

    return (
        <Tooltip >
            <TooltipTrigger asChild>
                <div className="relative w-fit h-fit">
                    <Avatar className='h-8 w-8 hover:cursor-pointer' >
                        <AvatarImage src={profileImageRes.data?.url}/>
                        <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">{nameInitial}</AvatarFallback>
                    </Avatar>
                    {isOnline && <div className={`h-2.5 w-2.5 md:h-2 md:w-2 ring-[1px] ring-background rounded-full bg-green-500 absolute bottom-0 right-0`}></div>}
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
                {toolTipString &&
                        <span className="ml-auto">
                    {toolTipString}
                  </span>

                }

            </TooltipContent>
        </Tooltip>

    )

})

UserAvatarNav.displayName = "UserAvatarNav"