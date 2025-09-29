// src/components/channel/ChannelMessages.tsx
import { useEffect, useMemo, useRef, useState} from "react";
import {groupByDate} from "@/lib/utils/groupByDate";
import {getGroupDateHeading} from "@/lib/utils/getMessageGroupDate";
import {FlatItem} from "@/types/virtual";
import {useMedia} from "@/context/MediaQueryContext";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import {usePost} from "@/hooks/usePost";
import {CreateOrUpdateChatReaction} from "@/types/reaction";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import { openConfirmAlertMessageDialog} from "@/store/slice/dialogSlice";
import {MessageListVirtua} from "@/components/message/MessaageListVirtua";
import {VListHandle} from "virtua";
import {RootState} from "@/store/store";
import {
    createChatReactionChatId, removeChatByChatId,
    removeChatReactionByChatId, updateChatByChatId,
    updateChatReactionByChatId, updateChatScrollToBottom
} from "@/store/slice/chatSlice";
import {ChatInfo, CreateOrUpdateChatsReq} from "@/types/chat";
import {ChatMessageMobile} from "@/components/chat/chatMessageMobile";
import {ChatMessage} from "@/components/chat/chatMessage";


interface ChannelMessagesProps {
    chats: ChatInfo[];
    chatId: string
    getOldMessages: () => void
    hasMoreOldMsg: boolean
    getNewMessages: () => void
    hasMoreNewMsg: boolean
    isNewMsgLoading: boolean
    isOLdMsgLoading: boolean
    clickedScrollToBottom: () => void;

}

export const ChatMessages = ({ chats, clickedScrollToBottom, chatId,  hasMoreNewMsg, getNewMessages, hasMoreOldMsg, getOldMessages, isNewMsgLoading, isOLdMsgLoading }: ChannelMessagesProps) => {
    const { isMobile } = useMedia();


    const [virtualShift, setVirtualShift] = useState(false);

    const post = usePost()

    const dispatch = useDispatch();

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const channelScrollToBottom = useSelector((state: RootState) => state.chat.chatScrollToBottom[chatId] || {});

    const createOrUpdateReaction = (messageId: string, emojiId:string, reactionId:string)=> {

        if(!messageId) return


        post.makeRequest<CreateOrUpdateChatReaction, CreateOrUpdateChatReaction>({apiEndpoint: PostEndpointUrl.CreateOrUpdateChatReaction,
            payload :{
                chat_id: messageId,
                reaction_emoji_id: emojiId,
                reaction_dgraph_id: reactionId
            }})
            .then((res)=>{


                if(reactionId) {
                    dispatch(updateChatReactionByChatId({chatId, reactionId, emojiId, messageId}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createChatReactionChatId({chatId, messageId, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
                }
            })
    }

    const removeReaction = (messageId: string, reactionId:string) => {

        post.makeRequest<CreateOrUpdateChatReaction>({apiEndpoint: PostEndpointUrl.RemoveChatReaction,
            payload :{
                chat_id: messageId,
                reaction_dgraph_id: reactionId
            }})
            .then(()=>{


                dispatch(removeChatReactionByChatId({ chatId, messageId, reactionId}))


            })
    }

    const executeDeleteChat = (messageId: string) => {

        post.makeRequest<CreateOrUpdateChatsReq>({
            apiEndpoint: PostEndpointUrl.DeleteChatMessage,
            payload: {
               chat_id: messageId
            },
            showToast: true
        })
            .then(() => {
                dispatch(removeChatByChatId({chatId, messageId}))
            })

    }

    const handleUpdateChat = (postHTMLText: string, messageId: string) => {

        post.makeRequest<CreateOrUpdateChatsReq>({
            apiEndpoint: PostEndpointUrl.UpdateChatMessage,
            payload: {
                chat_id: messageId,
                text_html: postHTMLText
            },
            showToast: true
        })
            .then((res)=>{

                if(res) {
                    dispatch(updateChatByChatId({
                        chatId: chatId,
                        messageId,
                        htmlText: postHTMLText,
                    }))
                }

            })
        
    }


    const handleDeleteChat = (messageId: string) => {

        if(!messageId) return

        setTimeout(() => {
            dispatch(openConfirmAlertMessageDialog({
                title: "Deleting chat message",
                description: "Are you sure you want to proceed deleting the message",
                confirmText: "Delete chat",
                onConfirm: ()=>{executeDeleteChat(messageId)}
            }));
        }, 500);

    }

    const groupedChats = useMemo(() => {
        try {
            return groupByDate(chats, (chat) => chat.chat_created_at);
        } catch (error) {
            console.error("Error grouping chats:", error);
            return {};
        }
    }, [chats]);

    const flatItems = useMemo(() => {
        const items: Array<FlatItem<ChatInfo>> = [];
        Object.keys(groupedChats).forEach((date) => {
            items.push({ type: "separator", date, key:  "separator"+date});
            groupedChats[date].forEach((chat) => items.push({ type: "item", data: chat, key: chat.chat_uuid}));
        });
        return items;
    }, [groupedChats]);

    const renderItem = (chat: ChatInfo) => (
        <div >
            {isMobile ?
                <TouchableDiv
                    rippleBrightness={0.8}
                    rippleDuration={800}

                >
                    <ChatMessageMobile
                        chatInfo={chat}
                        removeChat={()=>{handleDeleteChat(chat.chat_uuid)}}
                        addReaction={(emojiId:string, reactionId:string)=>{createOrUpdateReaction(chat.chat_uuid, emojiId, reactionId)}}
                        removeReaction={(reactionId: string)=>{ removeReaction(chat.chat_uuid, reactionId)}}
                        updateChat={(body: string)=>{handleUpdateChat(body, chat.chat_uuid)}}


                    />
                </TouchableDiv>
                :
                <ChatMessage
                    chatInfo={chat}
                    addReaction={(emojiId:string, reactionId:string)=>{createOrUpdateReaction(chat.chat_uuid, emojiId, reactionId)}}
                    removeReaction={(reactionId: string)=>{ removeReaction(chat.chat_uuid, reactionId)}}
                    removePost={()=>{handleDeleteChat(chat.chat_uuid)}}
                    updatePost={(body: string)=>{handleUpdateChat(body, chat.chat_uuid)}}
                />
            }
        </div>
    );

    const containerRef = useRef<VListHandle>(null);

    useEffect(()=>{
        if(channelScrollToBottom.shouldScrollToBottom && containerRef.current) {
            setVirtualShift(true)
            dispatch(updateChatScrollToBottom({chatId, scrollToBottom: false}))
            containerRef.current.scrollToIndex(flatItems.length - 1, {
                smooth: true
            },);

            setTimeout(() => {
                setVirtualShift(false)
            }, 1000)
        }

    },[channelScrollToBottom.shouldScrollToBottom])

    const handleGetOldMessage = () => {
        setVirtualShift(true)
        getOldMessages()
        setTimeout(() => {
            setVirtualShift(false)
        }, 1000)
    }

    const handleGetNewMessage = () => {
        setVirtualShift(true)
        getNewMessages()
        setTimeout(() => {
            setVirtualShift(false)
        }, 1000)
    }


    return (

        // <MessageList
        //     items={flatItems}
        //     renderItem={renderItem}
        //     getDateHeading={getGroupDateHeading}
        //     fetchOlderMessage={getOldMessages}
        //     fetchNewMessage={getNewMessages}
        //     hasNewMessage={hasMoreNewMsg}
        //     hasOldMessage={hasMoreOldMsg}
        //     olderMessageLoading={isOLdMsgLoading}
        //     newMessageLoading={isNewMsgLoading}
        // />

    <MessageListVirtua
        items={flatItems}
        renderItem={renderItem}
        getDateHeading={getGroupDateHeading}
        fetchOlderMessage={handleGetOldMessage}
        fetchNewMessage={handleGetNewMessage}
        hasNewMessage={hasMoreNewMsg}
        hasOldMessage={hasMoreOldMsg}
        olderMessageLoading={isOLdMsgLoading}
        newMessageLoading={isNewMsgLoading}
        ref={containerRef}
        virtualShift={virtualShift}
        clickedScrollToBottom={clickedScrollToBottom}/>


    );
};

ChatMessages.displayName = "ChatMessages";