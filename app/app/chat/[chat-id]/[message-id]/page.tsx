"use client";

import {usePathname} from "next/navigation";
import {MobileChat} from "@/components/mobileChatMessage/mobileChat";
import {MobileChatMessageTextInput} from "@/components/textInput/mobileChatMessageTextInput";
import {useDispatch, useSelector} from "react-redux";
import {useFetch} from "@/hooks/useFetch";
import {CreatePostPaginationResRaw} from "@/types/post";
import {GetEndpointUrl} from "@/services/endPoints";
import type {RootState} from "@/store/store";
import {useEffect} from "react";
import {updateChannelPosts} from "@/store/slice/channelSlice";
import {CreateChatPaginationResRaw} from "@/types/chat";
import {addChatComments} from "@/store/slice/chatCommentSlice";
import {updateChats} from "@/store/slice/chatSlice";


function ChatMessageMobilePage() {

    const chatId = usePathname().split('/')[3]
    const chatMessageId = usePathname().split('/')[4]

    const dispatch = useDispatch();

    const getNewPostsWithCurrentPost = useFetch<CreateChatPaginationResRaw>(chatId ? GetEndpointUrl.GetNewChatIncludingCurrentChat + '/' + chatId + '/' + chatMessageId: '')

    const chatMessageState = useSelector((state: RootState) => state.chat.chatMessages[chatId] || []);

    const chatState = chatMessageState?.find(c => c.chat_uuid === chatMessageId);


    useEffect(() => {

        if(getNewPostsWithCurrentPost.data?.data.chats && !chatState) {
            const newChats = getNewPostsWithCurrentPost.data?.data?.chats ?? [];

            dispatch(updateChats({chatId, chats: newChats}))

        }

    }, [getNewPostsWithCurrentPost.data?.data]);


    return (
        <div className='flex flex-col h-full'>
            <MobileChat chatId={chatId} chatMessageUUID={chatMessageId} />
            <div>
                <MobileChatMessageTextInput chatId={chatId} chatMessageUUID={chatMessageId}/>
            </div>

        </div>
    )
}

export default ChatMessageMobilePage;