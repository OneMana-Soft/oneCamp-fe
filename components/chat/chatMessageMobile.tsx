import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {cn} from "@/lib/utils/cn";
import {Check, X} from "lucide-react";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {useLongPress} from "@/hooks/useLongPress";
import {useDispatch} from "react-redux";
import {
    closeChatMessageLongPressDrawer,
    openChatMessageLongPressDrawer,
    openReactionPickerDrawer
} from "@/store/slice/drawerSlice";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {MessagePreview} from "@/components/message/MessagePreview";
import { app_chat_path} from "@/types/paths";
import {usePathname, useRouter} from "next/navigation";
import {MessageAttachments} from "@/components/message/MessageAttachments";
import {GetEndpointUrl} from "@/services/endPoints";
import {BottomMenu} from "@/components/message/bottomMenu";
import {useEffect, useState} from "react";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface, UserSelectedOptionInterface} from "@/types/user";
import { AttachmentMediaReq} from "@/types/attachment";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import { ConditionalWrap } from "../conditionalWrap/conditionalWrap";
import {MessageReplyCount} from "@/components/message/messageReplyCount";
import {ChatInfo} from "@/types/chat";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";
import {removeHtmlTags} from "@/lib/utils/removeHtmlTags";

interface ChatMessageProps {
    chatInfo: ChatInfo
    isAdmin?: boolean
    addReaction: (emojiId: string, reactionId: string) => void
    removeReaction: (reactionId: string) => void
    removeChat: () => void
    updateChat: (body: string) => void
}


export const ChatMessageMobile = ({chatInfo, isAdmin, addReaction, removeReaction, removeChat, updateChat}: ChatMessageProps) => {

    const dispatch = useDispatch();

    const router = useRouter();

    const copyToClipboard = useCopyToClipboard()

    const otherUserUUID = usePathname().split('/')[3]

    const[isMessageEditEnabled, setIsMessageEditEnabled] = useState(false);

    const [userSelectedOption, setUserSelectedOption] = useState<UserSelectedOptionInterface>({} as UserSelectedOptionInterface)
    const [reactions, setReactions] = useState<{ [key: string]: string[] }>({});

    const [updatedText, setUpdatedText] = useState<string>(chatInfo.chat_body_text||'');

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)


    useEffect(() => {
        setUserSelectedOption({} as UserSelectedOptionInterface)
        setReactions({})
        if (selfProfile.data?.data && chatInfo.chat_reactions) {
            chatInfo.chat_reactions.forEach((reaction) => {
                if (reaction.reaction_added_by.user_uuid == selfProfile.data?.data.user_uuid) {
                    setUserSelectedOption({
                        reactionId: reaction.uid,
                        emojiId: reaction.reaction_emoji_id
                    })
                }
                setReactions(prevReactions => ({
                    ...prevReactions,
                    [reaction.reaction_emoji_id]: [...(prevReactions[reaction.reaction_emoji_id] || []), reaction.reaction_added_by.user_name]
                }));

            })
        }


    }, [chatInfo, selfProfile.data?.data]);

    const copyPostText = () => {
        const t = removeHtmlTags(chatInfo.chat_body_text)

        copyToClipboard.copy(t, 'copied chat text')
    }

    const addEmojiReaction = () => {

        dispatch(closeChatMessageLongPressDrawer())

        dispatch(openReactionPickerDrawer({
            onReactionSelect(reaction: StandardReaction | SyncCustomReaction): void {
                handleEmojiClick(reaction.id)
            },
            showCustomReactions: false
        }))

    }

    const onLongPress = () => {
        dispatch(openChatMessageLongPressDrawer({
            onAddReaction: addEmojiReaction,
            chatUUID: chatInfo.chat_uuid,
            otherUserUUID: otherUserUUID,
            editMessage: () => {setIsMessageEditEnabled(true)},
            deleteMessage: removeChat,
            isAdmin: isAdmin,
            isOwner: chatInfo.chat_from.user_uuid == selfProfile.data?.data.user_uuid,
            handleEmojiClick: handleEmojiClick,
            copyTextToClipboard: copyPostText
        }))
    }


    const longPressEvent = useLongPress(onLongPress, {
        threshold: 500, // Reduced from 800ms to 500ms for quicker long press
        onLongPressStart: () =>{

        }
    })

    const handleEmojiClick = (emojiId: string) => {

        if(userSelectedOption.emojiId == emojiId) {
            removeReaction(userSelectedOption.reactionId)
            return
        }

        addReaction(emojiId, userSelectedOption.reactionId)
    }

    const handleSelectAttachment = (attachment: AttachmentMediaReq) => {

        if(chatInfo.chat_attachments) {
            dispatch(openMediaLightboxDialog({allMedia: chatInfo.chat_attachments, media: attachment, mediaGetUrl: GetEndpointUrl.GetChatMedia + '/' + otherUserUUID}))

        }

    }

    const handleOnCLick = () => {

        setTimeout(() => {
            router.push(`${app_chat_path}/${otherUserUUID}/${chatInfo.chat_uuid}`);

        }, 500);


    }



    return (

        <div  className='flex p-4 space-x-4 select-none' {...longPressEvent} >

            <div className='h-12 w-12 flex-shrink-0'>
                <ChannelMessageAvatar userInfo={chatInfo.chat_from}/>

            </div>
            <div className='w-full'>
                <div className='flex items-baseline space-x-2'>
                    <div className='font-semibold text-m'>
                        {chatInfo.chat_from.user_name}
                    </div>
                    <div className='text-xs text-muted-foreground text'>
                        {formatTimeForPostOrComment(chatInfo.chat_created_at, true)}

                    </div>
                </div>
                <ConditionalWrap
                    condition={!isMessageEditEnabled}
                    wrap={(c) => (
                        <div onClick={handleOnCLick}>{c}</div>
                    )}>
                    <div className='break-all' >


                        <MinimalTiptapTextInput
                            throttleDelay={300}
                            isOutputText={true}
                            className={cn("max-w-full rounded-xl h-auto ", isMessageEditEnabled ? "p-2 ml-[-4]" : "border-none")}
                            editorContentClassName={cn("overflow-auto ")}
                            output="html"
                            content={chatInfo.chat_body_text}
                            placeholder={"message"}
                            editable={isMessageEditEnabled}
                            PrimaryButtonIcon={Check}
                            buttonOnclick={()=>{
                                updateChat(updatedText)
                                setIsMessageEditEnabled(false)

                            }}
                            SecondaryButtonIcon={X}
                            secondaryButtonOnclick={()=>{
                                setIsMessageEditEnabled(false)
                            }}
                            editorClassName="focus:outline-none "
                            onChange={(content) => {
                                const s = content as string

                                setUpdatedText(s)

                            }}
                        >
                        </MinimalTiptapTextInput>
                        <div className={`${chatInfo.chat_body_text && chatInfo.chat_body_text.length > 0 ? 'mb-2' : ''}`}/>


                        {
                            (chatInfo.chat_fwd_msg_chat || chatInfo.chat_fwd_msg_post) &&

                            <MessagePreview
                                msgBy={chatInfo.chat_from || chatInfo.chat_fwd_msg_chat?.chat_from}
                                msgText={chatInfo.chat_fwd_msg_post?.post_text || chatInfo.chat_fwd_msg_chat?.chat_body_text || ''}
                                msgChannelName={chatInfo.chat_fwd_msg_post?.post_channel?.ch_name}
                                msgChannelUUID={chatInfo.chat_fwd_msg_post?.post_channel?.ch_uuid}
                                msgUUID={chatInfo.chat_fwd_msg_post?.post_uuid || chatInfo.chat_fwd_msg_chat?.chat_uuid}
                                msgCreatedAt={chatInfo.chat_fwd_msg_post?.post_created_at || chatInfo.chat_fwd_msg_chat?.chat_created_at}
                                vewFooter={true}
                            />
                        }
                    </div>

                </ConditionalWrap>

                {
                    !isMessageEditEnabled && chatInfo.chat_attachments && chatInfo.chat_attachments?.length > 0 &&
                    <MessageAttachments attachmentSelected={handleSelectAttachment} attachments={chatInfo.chat_attachments} mediaGetUrl={GetEndpointUrl.GetChatMedia + '/' + otherUserUUID}/>
                }

                {chatInfo.chat_comments && chatInfo.chat_comment_count && <div className='mb-3' onClick={handleOnCLick}><MessageReplyCount replyCount={chatInfo.chat_comment_count} lastCommentCreatedAt={chatInfo.chat_comments[0].comment_created_at}/></div>}

                { !isMessageEditEnabled && <BottomMenu handleEmojiClick={handleEmojiClick} reactions={reactions} selectedEmojiId={userSelectedOption.emojiId}/>}



            </div>



        </div>
    )
}