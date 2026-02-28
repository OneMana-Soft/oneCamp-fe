"use client"

import {usePathname} from "next/navigation";
import {Star} from "lucide-react";
import {useFetch} from "@/hooks/useFetch";
import {getStaticPaths} from "next/dist/build/templates/pages";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {usePost} from "@/hooks/usePost";
import {TeamInfoRawInterface} from "@/types/team";

export function MobileTopNavigationBarSecondTeam({teamId}:{teamId: string}) {

    const teamInfo = useFetch<TeamInfoRawInterface>(teamId ? GetEndpointUrl.GetTeamInfo + '/' + teamId :'')


    return (
        <div className='flex justify-center items-center space-x-3'>

            <div className='font-bold text-lg text-center truncate overflow-auto overflow-ellipsis'>
                {teamInfo.data?.data.team_name}
            </div>

        </div>

    );
}