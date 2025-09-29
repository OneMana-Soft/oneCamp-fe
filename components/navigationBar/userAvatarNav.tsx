"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useFetch, useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";

interface UserAvatarNavProp {
    toolTipString?: string
    userProfileObjKey?: string
    userName?: string
}

export function UserAvatarNav({toolTipString, userProfileObjKey, userName}: UserAvatarNavProp) {

    const profileImageRes = useMediaFetch<GetMediaURLRes>(userProfileObjKey ? GetEndpointUrl.PublicAttachmentURL+'/'+userProfileObjKey : '');

    const nameInitial = getNameInitials(userName);


    return (
        <Tooltip >
            <TooltipTrigger asChild>
                <Avatar className='h-8 w-8 hover:cursor-pointer' >
                    <AvatarImage src={profileImageRes.data?.url}/>
                    <AvatarFallback  className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-white md:text-sm">{nameInitial}</AvatarFallback>
                </Avatar>
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

}