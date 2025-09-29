import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {
    ChannelInfoInterfaceResp,
    ChannelJoinInterface,
    ChannelNotificationInterface,
    NotificationType
} from "@/types/channel";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {cn} from "@/lib/utils/cn";
import {ChevronLeft, ChevronRight, Hash, Pencil, SendHorizontal, Star, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {NotificationBell} from "@/components/Notification/notificationBell";
import {usePost} from "@/hooks/usePost";
import {useEffect, useState} from "react";
import {getNextNotification} from "@/lib/utils/getNextNotification";
import {openUpdateChannelDialog, openUpdateChannelMemberDialog} from "@/store/slice/dialogSlice";
import {ChannelFileUpload} from "@/components/fileUpload/channelFileUpload";
import {openChannelFileUpload} from "@/store/slice/fileUploadSlice";
import {
    addUUIDToLocallyCreatedPost, clearChannelInputState,
    createPostLocally, updateChannelInputText,
} from "@/store/slice/channelSlice";

import {GenericResponse} from "@/types/genericRes";
import {ChannelMessageList} from "@/components/channel/channelMessageList";
import {UserEmojiStatus} from "@/types/user";
import {TypingIndicator} from "@/components/typingIndicator/typyingIndicaator";


export const ChannelIdDesktop = ({channelId, handleSend}: {channelId: string, handleSend: ()=>void}) => {

    const dispatch = useDispatch()
    const postFav  = usePost()
    const postNotification  = usePost()
    const postJoinChannel = usePost()
    const channelInfo  = useFetch<ChannelInfoInterfaceResp>(`${GetEndpointUrl.ChannelBasicInfo}/${channelId}`)
    const [isFavorite, setFavorite] = useState<boolean>(false)
    const [channelNotification, setChannelNotificationType] = useState<string>(NotificationType.NotificationAll)

    const channelNme = useSelector((state: RootState) => state.users.userSidebar.userChannels)?.filter((item)=>item.ch_uuid == channelId);

    const channelState = useSelector((state: RootState) => state.channel.channelInputState[channelId] || []);

    const channelTypingState = useSelector((state: RootState) => state.typing.channelTyping[channelId] || []).map(item => item.user);


    useEffect(() => {

        if(channelInfo.data?.channel_info.ch_is_user_fav) {
            setFavorite(true)
        }

        if(channelInfo.data?.channel_info.notification_type) {
            setChannelNotificationType(channelInfo.data?.channel_info.notification_type)
        }

    }, [channelInfo.data?.channel_info])

    if(!channelInfo.data && !channelInfo.isLoading) return

    const toggleFavourite = async () => {
            if(isFavorite) {
               await postFav.makeRequest({apiEndpoint: PostEndpointUrl.RemoveFavChannel, appendToUrl:`/${channelId}`, onSuccess : ()=>{
                       setFavorite(false)}})
            } else {
                await postFav.makeRequest({apiEndpoint: PostEndpointUrl.AddFavChannel, appendToUrl:`/${channelId}`, onSuccess : ()=>{setFavorite(true)}})
            }
    }

    const joinChannel = async () => {
        await postJoinChannel.makeRequest<ChannelJoinInterface>({apiEndpoint: PostEndpointUrl.JoinChannel, payload: {channel_id: channelId}, onSuccess : ()=>{
            channelInfo.mutate()
            }})
    }


    const UpdateNotification = async () => {
        const nextNotification = getNextNotification(channelNotification)
        await postNotification.makeRequest<ChannelNotificationInterface, GenericResponse >({payload:{channel_id: channelId, notification_type: nextNotification}, apiEndpoint: PostEndpointUrl.UpdateChannelNotification})
        setChannelNotificationType(nextNotification)
    }


    return (
        <div className='flex flex-col h-full'>
            <div
                className='flex font-semibold text-lg p-2 truncate overflow-auto overflow-ellipsis justify-start border-b'>
                <div className='flex justify-center items-center space-x-1'>
                    <div><Hash className='h-5 w-5 text-muted-foreground'/></div>
                    <div>{channelNme?.[0]?.ch_name}</div>
                </div>
                <div className='flex justify-center items-center ml-2'>
                    <Button size='icon' variant='ghost' onClick={toggleFavourite}><Star  className='text-muted-foreground' fill={isFavorite ?"#ffcc00":'none'}/></Button>

                    <NotificationBell notificationType={channelNotification} isLoading={postNotification.isSubmitting} onNotCLick={UpdateNotification}/>
                    <Button size='icon' variant='ghost' onClick={()=>{dispatch(openUpdateChannelDialog({channelUUID: channelId}))}}><Pencil /></Button>
                    <Button size='icon' variant='ghost' onClick={()=>{dispatch(openUpdateChannelMemberDialog({channelUUID: channelId}))}}> <Users /></Button>


                </div>


            </div>
            <div className="flex-1 overflow-y-auto">
                <ChannelMessageList channelId={channelId} isAdmin={channelInfo.data?.channel_info.ch_is_admin}/>
            </div>
            <TypingIndicator users={channelTypingState}/>
            <div className="sticky bottom-0 left-0 right-0 z-50 border-t p-4 ">
                <div>
                    {   channelInfo.data?.channel_info.ch_is_member
                        ?
                        <MinimalTiptapTextInput
                        throttleDelay={300}
                        attachmentOnclick = {()=>{dispatch(openChannelFileUpload())}}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={channelState.inputTextHTML}
                        placeholder={"message"}
                        editable={true}
                        ButtonIcon={SendHorizontal}
                        buttonOnclick={handleSend}
                        editorClassName="focus:outline-none px-5 py-4"
                        onChange={(content ) => {

                            dispatch(updateChannelInputText({channelId, inputTextHTML: content as string}))
                        }}
                        >
                            <ChannelFileUpload channelId={channelId}/>
                        </MinimalTiptapTextInput>

                        :

                        <div className='h-20 flex-col justify-center items-center w-full text-center space-y-2'>
                            <div>you are not the member of the channel</div>
                            <Button onClick={joinChannel}>
                                Join channel
                            </Button>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}