"use client";

import { useMedia } from "@/context/MediaQueryContext";
import {usePathname} from "next/navigation";
import {CreateOrUpdatePostsReq, CreatePostPaginationResRaw, CreatePostsRes, PostsRes} from "@/types/post";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {clearChannelInputState, createPostLocally, updateChannelScrollToBottom} from "@/store/slice/channelSlice";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {ChatIdMobile} from "@/components/chat/chatIdMobile";
import {ChatIdDesktop} from "@/components/chat/chatIdDesktop";
import {ChatInfo, CreateChatMessagePaginationResRaw, CreateChatRes, CreateOrUpdateChatsReq} from "@/types/chat";
import {
    AddUserInChatList,
    clearChatInputState,
    createChat,
    CreateOrUpdateUserInChatList,
    updateChatScrollToBottom
} from "@/store/slice/chatSlice";
import {useEffect} from "react";
import {addUserToUserChatList} from "@/store/slice/userSlice";
import {removeEmptyPTags} from "@/lib/utils/removeEmptyPTags";


function Chat() {


    const chatId = usePathname().split('/')[3]

    const post = usePost()

    const chatMessageState = useSelector((state: RootState) => state.chat.chatMessages[chatId] || [] as ChatInfo[]);

    const chatState = useSelector((state: RootState) => state.chat.chatInputState[chatId] || {});

    const dispatch = useDispatch();

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const otherUserInfo  = useFetchOnlyOnce<UserProfileInterface>(`${GetEndpointUrl.SelfProfile}/${chatId}`)

    const latestMsg = useFetch<CreateChatMessagePaginationResRaw>( GetEndpointUrl.GetChatLatestMessage + '/' + chatId)


    useEffect(()=>{

        if(otherUserInfo.data?.data){

            dispatch(addUserToUserChatList({chatUser: otherUserInfo.data.data}))
            dispatch(AddUserInChatList({user: otherUserInfo.data.data}))

        }

    }, [otherUserInfo.data?.data])

    const handleSend = () => {

        const body = removeEmptyPTags(chatState.chatBody)

        if(body.length==0) return

        post.makeRequest<CreateOrUpdateChatsReq, CreateChatRes>({
            apiEndpoint: PostEndpointUrl.CreateChatMessage,
            payload: {
                media_attachments: chatState.filesUploaded,
                to_uuid: chatId,
                text_html: body
            }
        })
            .then((res)=>{

                if(res && latestMsg.data?.data && latestMsg.data?.data?.chats?.[0]?.chat_uuid == chatMessageState[chatMessageState.length -1].chat_uuid) {
                    dispatch(createChat({
                        dmId: chatId,
                        chatCreatedAt:res?.chat_created_at,
                        chatBy: selfProfile.data?.data || {} as UserProfileDataInterface,
                        chatText: body,
                        attachments: chatState.filesUploaded,
                        chatId: res?.chat_uuid,
                        chatTo: otherUserInfo.data?.data || {} as UserProfileDataInterface,
                    }))

                    latestMsg.mutate()
                    dispatch(updateChatScrollToBottom({chatId: chatId, scrollToBottom: true}))


                }

            })
        dispatch(clearChatInputState({chatUUID: chatId}))
    }




    const { isMobile, isDesktop } = useMedia();

    return (
        <>

            {isMobile && <ChatIdMobile chatId={chatId} handleSend={handleSend}/>}

            {isDesktop && <ChatIdDesktop chatId={chatId} handleSend={handleSend}/>}
        </>
    );
}

export default Chat;
