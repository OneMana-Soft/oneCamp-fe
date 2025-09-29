import {MobileChannelTextInput} from "@/components/textInput/mobileChannelTextInput";
import {ChannelMessageList} from "@/components/channel/channelMessageList";
import {ChannelInfoInterfaceResp, ChannelJoinInterface} from "@/types/channel";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {usePost} from "@/hooks/usePost";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {Button} from "@/components/ui/button";
import {LoaderCircle} from "lucide-react";
import {TypingIndicator} from "@/components/typingIndicator/typyingIndicaator";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {UserProfileInterface} from "@/types/user";

export const ChannelIdMobile = ({channelId, handleSend}: {channelId: string, handleSend: ()=>void }) => {

    const postJoinChannel = usePost()

    const channelInfo  = useFetch<ChannelInfoInterfaceResp>(`${GetEndpointUrl.ChannelBasicInfo}/${channelId}`)



    const joinChannel = async () => {
        await postJoinChannel.makeRequest<ChannelJoinInterface>({apiEndpoint: PostEndpointUrl.JoinChannel, payload: {channel_id: channelId}, onSuccess : ()=>{
                channelInfo.mutate()
            }})
    }

    if(channelInfo.isLoading) {
        return <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
    }

    return (
        <div className='flex flex-col h-full'>

            <div style={{ height: window.innerHeight-190 }}>
                <ChannelMessageList channelId={channelId} />

            </div>

            <div >

                {   channelInfo.data?.channel_info.ch_is_member
                    ?
                    <MobileChannelTextInput channelId={channelId} handleSend={handleSend}/>

                    :

                    <div className='mt-12 flex-col justify-center items-center w-full text-center space-y-2'>
                        <div>you are not the member of the channel</div>
                        <Button onClick={joinChannel}>
                            Join channel
                        </Button>
                    </div>
                }
            </div>

        </div>
    )
}