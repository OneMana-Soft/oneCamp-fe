import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {NotificationType} from "@/types/channel";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {cn} from "@/lib/utils/cn";
import {SendHorizontal} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {NotificationBell} from "@/components/Notification/notificationBell";
import {usePost} from "@/hooks/usePost";
import React, {useEffect, useState} from "react";
import {getNextNotification} from "@/lib/utils/getNextNotification";

import {openChatFileUpload} from "@/store/slice/fileUploadSlice";


import {ChatMessageList} from "@/components/chat/chatMessageList";
import {USER_STATUS_ONLINE, UserProfileInterface} from "@/types/user";
import {ChatNotificationInterface} from "@/types/chat";
import {ChatUserAvatar} from "@/components/chat/chatUserAvatar";
import {ChatFileUpload} from "@/components/fileUpload/chatFileUpload";
import {createOrUpdateChatBody} from "@/store/slice/chatSlice";
import {TypingIndicator} from "@/components/typingIndicator/typyingIndicaator";
import {updateUserConnectedDeviceCount, updateUserEmojiStatus, updateUserStatus} from "@/store/slice/userSlice";
import {ChatUserEmojiStatus} from "@/components/chat/chatUserEmojiStatus";


export const ChatIdDesktop = ({chatId, handleSend}: {chatId: string, handleSend: ()=>void}) => {

    const dispatch = useDispatch()
    const postNotification  = usePost()
    const otherUserInfo  = useFetchOnlyOnce<UserProfileInterface>(`${GetEndpointUrl.SelfProfile}/${chatId}`)
    const [chatNotification, setChatNotificationType] = useState<string>(NotificationType.NotificationAll)

    const chatTypingState = useSelector((state: RootState) => state.typing.channelTyping[chatId] || []).map(item => item.user);

    const chatState = useSelector((state: RootState) => state.chat.chatInputState[chatId] || {});

    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[chatId] || []);

    useEffect(() => {


        if(otherUserInfo.data?.data.notification_type) {
            setChatNotificationType(otherUserInfo.data?.data.notification_type)
        }

        if(otherUserInfo.data?.data.user_emoji_statuses && otherUserInfo.data?.data.user_emoji_statuses.length > 0) {
            dispatch(updateUserEmojiStatus({userUUID: otherUserInfo.data?.data.user_uuid, status:otherUserInfo.data.data.user_emoji_statuses[0]}));
        }

        if(otherUserInfo.data?.data.user_status) {
            dispatch(updateUserStatus({userUUID: otherUserInfo.data?.data.user_uuid, status:otherUserInfo.data.data.user_status}));
        }

        if(otherUserInfo.data?.data.user_device_connected) {
            dispatch(updateUserConnectedDeviceCount({userUUID: otherUserInfo.data?.data.user_uuid, deviceConnected:otherUserInfo.data.data.user_device_connected}));
        }
    }, [otherUserInfo.data?.data])

    if(!otherUserInfo.data && !otherUserInfo.isLoading) return

    // const toggleFavourite = async () => {
    //         if(isFavorite) {
    //            await postFav.makeRequest({apiEndpoint: PostEndpointUrl.RemoveFavChannel, appendToUrl:`/${channelId}`, onSuccess : ()=>{
    //                    setFavorite(false)}})
    //         } else {
    //             await postFav.makeRequest({apiEndpoint: PostEndpointUrl.AddFavChannel, appendToUrl:`/${channelId}`, onSuccess : ()=>{setFavorite(true)}})
    //         }
    // }


    const UpdateNotification = async () => {
        const nextNotification = getNextNotification(chatNotification)
        await postNotification.makeRequest<ChatNotificationInterface>({payload:{to_user_id: chatId, notification_type: nextNotification}, apiEndpoint: PostEndpointUrl.UpdateChatNotification})
        setChatNotificationType(nextNotification)
    }

    const isOnline = userStatusState.status == USER_STATUS_ONLINE && userStatusState.deviceConnected && userStatusState.deviceConnected > 0


    return (
        <div className='flex flex-col h-full relative'>
            <div
                className='flex font-semibold text-lg p-2 truncate overflow-auto overflow-ellipsis justify-start border-b'>
                <div className='flex justify-center items-center space-x-2'>
                    <div className='relative'>
                        <ChatUserAvatar userName={otherUserInfo.data?.data.user_name}
                                        userProfileObjKey={otherUserInfo.data?.data.user_profile_object_key}/>
                        {isOnline && <div className={`h-2.5 w-2.5 ring-[2px] ring-background rounded-full bg-green-500 absolute bottom-0 right-0`}></div>}

                    </div>
                    <div>{otherUserInfo.data?.data.user_name}</div>
                </div>
                <div className='flex justify-center items-center ml-2'>
                {/*<Button size='icon' variant='ghost' onClick={toggleFavourite}><Star  className='text-muted-foreground' fill={isFavorite ?"#ffcc00":'none'}/></Button>*/}
                    <ChatUserEmojiStatus userUUID={chatId}/>
                    <NotificationBell notificationType={chatNotification} isLoading={postNotification.isSubmitting} onNotCLick={UpdateNotification}/>
                    {/*<Button size='icon' variant='ghost' onClick={()=>{dispatch(openUpdateChannelDialog({channelUUID: channelId}))}}><Pencil /></Button>*/}
                    {/*<Button size='icon' variant='ghost' onClick={()=>{dispatch(openUpdateChannelMemberDialog({channelUUID: channelId}))}}> <Users /></Button>*/}


                </div>


            </div>
            <div className="flex-1 overflow-y-auto">
                <ChatMessageList chatId={chatId} />
            </div>
            <TypingIndicator users={chatTypingState}/>

            <div className="sticky bottom-0 left-0 right-0 z-50 border-t p-4 ">
                <div>
                    <MinimalTiptapTextInput
                        throttleDelay={300}
                        attachmentOnclick = {()=>{dispatch(openChatFileUpload())}}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={chatState.chatBody}
                        placeholder={"message"}
                        editable={true}
                        ButtonIcon={SendHorizontal}
                        buttonOnclick={handleSend}
                        editorClassName="focus:outline-none px-5 py-4"
                        onChange={(content ) => {

                            dispatch(createOrUpdateChatBody({chatUUID:chatId, body: content as string}))
                        }}
                    >
                        <ChatFileUpload chatUUID={chatId} />
                    </MinimalTiptapTextInput>
                </div>
            </div>

        </div>
    )
}