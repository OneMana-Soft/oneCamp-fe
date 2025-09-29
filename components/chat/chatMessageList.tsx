"use client"

import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {  PostsRes} from "@/types/post";
import {useEffect, useState} from "react";

import {ChatMessages} from "@/components/chat/chatMessages";
import {CreateChatPaginationResRaw} from "@/types/chat";
import {updateChats, updateChatScrollToBottom} from "@/store/slice/chatSlice";
import {TypingIndicator} from "@/components/typingIndicator/typyingIndicaator";
import {updateChannelPosts, updateChannelScrollToBottom} from "@/store/slice/channelSlice";
import {UserProfileInterface} from "@/types/user";

interface ChatMessageListProps {
    chatId: string;
    messageId?: string;
}

export const ChatMessageList = ({chatId, messageId}: ChatMessageListProps) => {

    const latestMsg = useFetch<CreateChatPaginationResRaw>(messageId ? '' : GetEndpointUrl.GetChatLatestMessage + '/' + chatId)
    const getNewChatsWithCurrentChat = useFetch<CreateChatPaginationResRaw>(messageId ? GetEndpointUrl.GetNewChatIncludingCurrentChat + '/' + chatId + '/' + messageId: '')

    const chatTypingState = useSelector((state: RootState) => state.typing.channelTyping[chatId] || []).map(item => item.user);

    const chatMessageState = useSelector((state: RootState) => state.chat.chatMessages[chatId] || [] as PostsRes[]);

    const [hasMoreChat, setHasMoreChat] = useState(true)
    const [oldChatTime, setOldChatTime] = useState(0)
    const oldMsg = useFetch<CreateChatPaginationResRaw>(oldChatTime == 0 ? '' : GetEndpointUrl.GetOldChatBefore + '/' + chatId + '/' + oldChatTime)

    const [hasMoreNewChat, setHasMoreNewChat] = useState(true)
    const [newChat, setNewChat] = useState(0)
    const newMsg = useFetch<CreateChatPaginationResRaw>(newChat == 0 ? '' : GetEndpointUrl.GetNewChatAfter + '/' + chatId + '/' + newChat)



    const dispatch = useDispatch();


    useEffect(() => {

        if(messageId && getNewChatsWithCurrentChat.data?.data?.chats) {
            const newChats = getNewChatsWithCurrentChat.data?.data?.chats ?? [];
            dispatch(updateChats({chats:newChats, chatId}))
        }

        if(!messageId && latestMsg.data?.data.chats && chatMessageState.length == 0 ) {
            const newChats = latestMsg.data?.data.chats.reverse() ?? [];
            dispatch(updateChats({chatId, chats: newChats}))
            latestMsg.data?.data.chats.reverse()
        }

    }, [getNewChatsWithCurrentChat, latestMsg]);

    useEffect(() => {

        if(chatMessageState && oldMsg.data?.data && oldChatTime != 0) {
            setHasMoreChat(oldMsg.data.data.has_more)
            setOldChatTime(0)
            if(oldMsg.data?.data.chats && oldMsg.data?.data.chats.length !== 0) {
                const chats = oldMsg.data.data.chats.reverse().concat(chatMessageState)
                dispatch(updateChats({chats, chatId}))
                oldMsg.data.data.chats.reverse()
            }
        }

    }, [ oldMsg.data?.data]);

    useEffect(() => {

        if(chatMessageState && newMsg.data?.data && newChat != 0) {
            setHasMoreNewChat(newMsg.data.data.has_more)
            setNewChat(0)
            if(newMsg.data?.data.chats && newMsg.data?.data.chats.length !== 0) {
                const chats = chatMessageState.concat(newMsg.data.data.chats)
                dispatch(updateChats({chats, chatId}))
            }
        }

    }, [ newMsg.data?.data]);


    const handleClickedScrollToBottom = () => {

        if(chatMessageState[chatMessageState.length -1].chat_uuid != latestMsg.data?.data.chats?.[0]?.chat_uuid) {
            const newChats = latestMsg.data?.data.chats.reverse() ?? [];
            dispatch(updateChats({chatId, chats: newChats}))
            latestMsg.data?.data.chats.reverse()
        }

        dispatch(updateChatScrollToBottom({chatId: chatId, scrollToBottom: true}))

    }

    const getOldMessages = () => {

        const lastTimeString = chatMessageState[0].chat_created_at
        const epochTime = Math.floor(Date.parse(lastTimeString) / 1000);
        setOldChatTime(epochTime)
        setHasMoreChat(false)
    }

    const getNewMessages = () => {

        const lastTimeString = chatMessageState[chatMessageState.length -1].chat_created_at
        const epochTime = Math.ceil(Date.parse(lastTimeString) / 1000);
        setNewChat(epochTime)
        setHasMoreNewChat(false)
    }


    return (
        <div className='flex flex-col h-full space-y-2 '>
            <ChatMessages
                chats={chatMessageState || []}
                chatId={chatId}
                getNewMessages={getNewMessages}
                getOldMessages={getOldMessages}
                hasMoreNewMsg={hasMoreNewChat}
                hasMoreOldMsg={hasMoreChat}
                isNewMsgLoading={newMsg.isLoading}
                isOLdMsgLoading={oldMsg.isLoading}
                clickedScrollToBottom={handleClickedScrollToBottom}
            />

            <TypingIndicator users={chatTypingState}/>
        </div>
    )

}