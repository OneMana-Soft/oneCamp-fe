import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {cn} from "@/lib/utils/cn";
import {Check, X} from "lucide-react";
import MinimalTiptapTextInput from "@/components/textInput/textInput";

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {MessagePreview} from "@/components/message/MessagePreview";
import {
    MessageDesktopHoverOptionsForMainChatAndChannel
} from "@/components/MessageDesktopHover/messageDesktopHoverOptionsForMainChatAndChannel";
import {UserProfileInterface, UserSelectedOptionInterface} from "@/types/user";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {BottomMenu} from "@/components/message/bottomMenu";
import {MessageAttachments} from "@/components/message/MessageAttachments";
import {useDispatch} from "react-redux";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {AttachmentMediaReq} from "@/types/attachment";
import {MessageReplyCount} from "@/components/message/messageReplyCount";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {ChatInfo} from "@/types/chat";

interface ChatMessageProps {
    chatInfo: ChatInfo
    isAdmin?: boolean
    addReaction: (emojiId: string, reactionId: string) => void
    removeReaction: (reactionId: string) => void
    removePost: () => void
    updatePost: (body: string) => void
}


export const ChatMessage = ({updatePost, chatInfo, addReaction, removeReaction, isAdmin, removePost}: ChatMessageProps) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const[isMessageEditEnabled, setIsMessageEditEnabled] = useState(false);

    const otherUserUUID = usePathname().split('/')[3]

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const [userSelectedOption, setUserSelectedOption] = useState<UserSelectedOptionInterface>({} as UserSelectedOptionInterface)
    const [reactions, setReactions] = useState<{ [key: string]: string[] }>({});

    const [updatedText, setUpdatedText] = useState<string>(chatInfo.chat_body_text||'');

    const dispatch = useDispatch();


    const handleSelectAttachment = (attachment: AttachmentMediaReq) => {

        if(chatInfo.chat_attachments) {
            dispatch(openMediaLightboxDialog({allMedia:  chatInfo.chat_attachments, media: attachment, mediaGetUrl: GetEndpointUrl.GetChatMedia + '/' + otherUserUUID}))

        }

    }


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


    const handleEmojiClick = (emojiId: string) => {
        if(userSelectedOption.emojiId == emojiId) {
            removeReaction(userSelectedOption.reactionId)
            return
        }


        addReaction(emojiId, userSelectedOption.reactionId)
    }

    const handleOpenThread = () => {
        dispatch(openRightPanel({postUUID:'', channelUUID: '', chatMessageUUID: chatInfo.chat_uuid, chatUUID: otherUserUUID}))
    }


    return (
        <div className={` space-x-4 relative pb-4 pt-4 hover:bg-primary/5 transition-colors delay-200 group ${(isDropdownOpen || isEmojiPickerOpen)? 'bg-primary/5':''}`}>
        <div className={`flex space-x-4`}>
            { !isMessageEditEnabled && <div
                className={cn(
                    "ml-2 absolute -top-5 right-1 transition-opacity delay-200",
                    (isDropdownOpen || isEmojiPickerOpen) || "opacity-0 group-hover:opacity-100"
                )}
            >
                <MessageDesktopHoverOptionsForMainChatAndChannel
                    editMessage={()=>{setIsMessageEditEnabled(true)}}
                    deleteMessage={removePost}
                    isOwner={chatInfo.chat_from.user_uuid == selfProfile.data?.data.user_uuid}
                    isAdmin={isAdmin} setEmojiPopupState={setIsEmojiPickerOpen}
                    onReactionSelect={handleEmojiClick}
                    setIsDropdownOpen={setIsDropdownOpen}
                    chatUUID={otherUserUUID}
                    chatMessageID={chatInfo.chat_uuid}
                />
            </div>}
            <div className='h-12 w-12 flex-shrink-0'>
                <ChannelMessageAvatar userInfo={chatInfo.chat_from}/>

            </div>
            <div className='flex-1'>
                {!isMessageEditEnabled && <div className='flex items-baseline space-x-2'>
                    <div className='font-semibold text-m'>
                        {chatInfo.chat_from.user_name}
                    </div>
                    <div className='text-xs text-muted-foreground text'>
                        {formatTimeForPostOrComment(chatInfo.chat_created_at, true)}

                    </div>
                </div>}
                <div className='break-all w-full'>

                    <MinimalTiptapTextInput
                        throttleDelay={300}
                        isOutputText={true}
                        className={cn("max-w-full rounded-xl h-auto",
                            isMessageEditEnabled ? "p-2" : "border-none"
                            )}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={chatInfo.chat_body_text}
                        placeholder={"message"}
                        editable={isMessageEditEnabled}
                        PrimaryButtonIcon={Check}
                        buttonOnclick={()=>{
                            updatePost(updatedText)
                            setIsMessageEditEnabled(false)
                            setIsDropdownOpen(false)

                        }}
                        SecondaryButtonIcon={X}
                        secondaryButtonOnclick={()=>{
                            setIsMessageEditEnabled(false)
                            setIsDropdownOpen(false)
                        }}
                        editorClassName="focus:outline-none "
                        onChange={(content) => {

                            const s = content as string

                            setUpdatedText(s)
                        }}
                    >
                    </MinimalTiptapTextInput>
                </div>

                {
                    (chatInfo.chat_fwd_msg_chat || chatInfo.chat_fwd_msg_post) && !isMessageEditEnabled &&

                    <MessagePreview
                        msgBy={chatInfo.chat_from || chatInfo.chat_fwd_msg_chat?.chat_from }
                        msgText={chatInfo.chat_fwd_msg_post?.post_text || chatInfo.chat_fwd_msg_chat?.chat_body_text || ''}
                        msgChannelName={chatInfo.chat_fwd_msg_post?.post_channel?.ch_name}
                        msgChannelUUID={chatInfo.chat_fwd_msg_post?.post_channel?.ch_uuid}
                        msgUUID={chatInfo.chat_fwd_msg_post?.post_uuid || chatInfo.chat_fwd_msg_chat?.chat_uuid}
                        msgCreatedAt={chatInfo.chat_fwd_msg_post?.post_created_at || chatInfo.chat_fwd_msg_chat?.chat_created_at}
                        vewFooter={true}
                    />
                }

                {
                    !isMessageEditEnabled && chatInfo.chat_attachments && chatInfo.chat_attachments?.length > 0 &&
                    <MessageAttachments attachmentSelected={handleSelectAttachment} attachments={chatInfo.chat_attachments} mediaGetUrl={GetEndpointUrl.GetChatMedia + '/' + otherUserUUID}/>
                }

                {chatInfo.chat_comments && chatInfo.chat_comment_count && <div className='mb-2'><MessageReplyCount openDesktopThread={handleOpenThread} replyCount={chatInfo.chat_comment_count} lastCommentCreatedAt={chatInfo.chat_comments[chatInfo.chat_comments.length-1].comment_created_at}/></div>}

                { !isMessageEditEnabled && <BottomMenu handleEmojiClick={handleEmojiClick} reactions={reactions} selectedEmojiId={userSelectedOption.emojiId}/>}



            </div>

        </div>

        </div>
    )
}