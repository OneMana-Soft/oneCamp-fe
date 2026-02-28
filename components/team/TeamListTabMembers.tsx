import {ChannelListTabs} from "@/components/channel/channelListTabs";
import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {ChannelInfoInterface, ChannelInfoListInterfaceResp} from "@/types/channel";
import {useEffect, useState} from "react";
import {GenericSearchTextInterface, UserDMSearchTextInterface, UserProfileDataInterface} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {ChannelListResult} from "@/components/channel/chnnelListResult";
import {sortChannelList} from "@/lib/utils/sortChannelList";
import {TeamProjectListResult} from "@/components/team/TeamProjectListResult";
import {TeamInfoRawInterface} from "@/types/team";
import {ProjectInfoInterface} from "@/types/project";
import {TeamMemberListResult} from "@/components/team/TeamMemberListResult";

export const TeamListTabMembers = ({searchQuery,teamId}:{searchQuery: string, teamId:string}) => {

    const teamInfo = useFetch<TeamInfoRawInterface>(teamId ? GetEndpointUrl.GetTeamMemberInfo + '/' + teamId : '')

    const [searchUserList, setSearchUserList] = useState<UserProfileDataInterface[]>([])

    const [sortedUserList, setSortedUserList] = useState<UserProfileDataInterface[]>([])


    useEffect(()=>{

        if(searchQuery.trim().length == 0) return

        const filteredUser =
            searchQuery === ''
                ? teamInfo.data?.data.team_members || [] as UserProfileDataInterface[]
                : teamInfo.data?.data.team_members?.filter((user) =>
                user.user_name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(searchQuery.toLowerCase().replace(/\s+/g, '')) ||
                (user.user_email_id || "")
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
            ) || [] as UserProfileDataInterface[]

        setSearchUserList(filteredUser);

    }, [searchQuery])

    const renderChannelList =  searchQuery && searchUserList ? searchUserList: teamInfo.data?.data.team_members


    useEffect(() => {

        if(renderChannelList) {
            setSortedUserList(renderChannelList)
        }


    }, [renderChannelList]);


    return (
        <>
            {renderChannelList ?
                <TeamMemberListResult userList={sortedUserList} isAdmin={teamInfo.data?.data.team_is_admin || false}/>:

                <div className='flex justify-center items-center h-full text-muted-foreground text-center'>
                    Looks like team does not have any member
                </div>
            }
        </>
    )
}