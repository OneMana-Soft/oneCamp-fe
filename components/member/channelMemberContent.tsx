"use client"
import MembersList from "@/components/member/membersList";
import {useFetch} from "@/hooks/useFetch";
import {ChannelInfoInterfaceResp, ChannelMemberUpdateInterface} from "@/types/channel";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {usePost} from "@/hooks/usePost";
import AddTeamMemberCombobox from "@/components/combobox/addChannelMemberCombobox";


interface memberContentProp {
    channelId: string
}

const ChannelMemberContent: React.FC<memberContentProp> = ({channelId}) => {
    const channelInfo = useFetch<ChannelInfoInterfaceResp>(channelId ? GetEndpointUrl.ChannelMemberInfoWithAdminFlagInfo + '/' + channelId : '')
    const post = usePost()

    const handleMakeAdmin = async (id: string) => {
        if(!id) return

        await post.makeRequest<ChannelMemberUpdateInterface>({apiEndpoint: PostEndpointUrl.AddChannelModerator, payload:{channel_id: channelId, user_id: id}})

    }

    const handleRemoveAdmin = async (id: string) => {
        if(!id) return

        await post.makeRequest<ChannelMemberUpdateInterface>({apiEndpoint: PostEndpointUrl.RemoveChannelModerator, payload:{channel_id: channelId, user_id: id}})

    }

    const handleAddMember = async (id: string) => {
        if(!id) return

        await post.makeRequest<ChannelMemberUpdateInterface>({apiEndpoint: PostEndpointUrl.RemoveChannelModerator, payload:{channel_id: channelId, user_id: id}})

    }

    const handleRemoveMember = async (id: string) => {
        if(!id ) return

        await post.makeRequest<ChannelMemberUpdateInterface>({apiEndpoint: PostEndpointUrl.RemoveChannelMember, payload:{channel_id: channelId, user_id: id}})

    }

    return (
        <div className='h-full flex flex-col gap-y-6'>
            <AddTeamMemberCombobox handleAddMember={handleAddMember} channelId={channelId}/>
            <MembersList isAdmin={channelInfo.data?.channel_info.ch_is_admin || false} usersList={channelInfo.data?.channel_info.ch_members || []}
                        handleMakeAdmin={handleMakeAdmin} handleRemoveAdmin={handleRemoveAdmin}
                        handleRemoveMember={handleRemoveMember} blockExitForUUID={channelInfo.data?.channel_info.ch_created_by.user_uuid}/>

        </div>
    )
}

export default ChannelMemberContent