
import {useLongPress} from "@/hooks/useLongPress";
import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {cn} from "@/lib/utils/cn";
import {Check, X} from "lucide-react";
import {MessagePreview} from "@/components/message/MessagePreview";
import {ForwardedMessageData} from "@/types/rightPanel";
import {UserProfileDataInterface, UserProfileInterface, UserSelectedOptionInterface} from "@/types/user";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import {MessageAttachments} from "@/components/message/MessageAttachments";
import {GetEndpointUrl} from "@/services/endPoints";
import {BottomMenu} from "@/components/message/bottomMenu";
import {AttachmentMediaReq} from "@/types/attachment";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {GroupedReaction, StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {
    closePostCommentMessageLongPressDrawer, closePostMessageLongPressDrawer,
    openDmChatCommentMessageLongPressDrawer, openDmChatMessageLongPressDrawer,
    openPostCommentMessageLongPressDrawer, openPostMessageLongPressDrawer, openReactionPickerDrawer
} from "@/store/slice/drawerSlice";
import {removeHtmlTags} from "@/lib/utils/removeHtmlTags";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";

interface mobileMessageProps {
    userInfo: UserProfileDataInterface
    createdAt: string
    content: string
    forwardedMessage?: ForwardedMessageData
    channelUUID?: string
    commentUUID?: string
    postUUID?: string
    chatUUID?: string
    chatMessageUUID?: string
    rawReactions?: GroupedReaction[]
    removeReaction: (reactionId: string) => void
    attachments?: AttachmentMediaReq[]
    addReaction: (emojiId:string, reactionId: string) => void
    isAdmin?: boolean;
    updateMessage: (id: string, body: string) => void;
    deleteMessage: (id: string) => void;
    getMediaUrl: string
}

export const MobileMessage = ({  userInfo, isAdmin, deleteMessage, chatMessageUUID, content, rawReactions, addReaction, removeReaction, updateMessage, chatUUID, channelUUID, postUUID, commentUUID, attachments, getMediaUrl, forwardedMessage, createdAt}: mobileMessageProps) => {


    const dispatch = useDispatch();

    const[isMessageEditEnabled, setIsMessageEditEnabled] = useState(false);

    const [userSelectedOption, setUserSelectedOption] = useState<UserSelectedOptionInterface>({} as UserSelectedOptionInterface)
    const [reactions, setReactions] = useState<{ [key: string]: string[] }>({});

    const [updatedText, setUpdatedText] = useState<string>(content);

    const copyToClipboard = useCopyToClipboard()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    useEffect(() => {
        setUserSelectedOption({} as UserSelectedOptionInterface)
        setReactions({})
        if (selfProfile.data?.data && rawReactions) {
            rawReactions.forEach((reaction) => {
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


    }, [rawReactions, selfProfile.data?.data]);

    const handleEmojiClick = (emojiId: string) => {
        if(userSelectedOption.emojiId == emojiId) {
            removeReaction(userSelectedOption.reactionId)
            return
        }

        addReaction(emojiId, userSelectedOption.reactionId)
    }

    const addEmojiReaction = () => {

        dispatch(closePostCommentMessageLongPressDrawer())

        dispatch(openReactionPickerDrawer({
            onReactionSelect(reaction: StandardReaction | SyncCustomReaction): void {
                handleEmojiClick(reaction.id)
            },
            showCustomReactions: false
        }))

    }

    const copyText = () => {
        const t = removeHtmlTags(content)

        copyToClipboard.copy(t, 'copied body text')
    }

    const handleLongPressPostComment = () => {
        if(postUUID && channelUUID && !commentUUID) {
            dispatch(openPostMessageLongPressDrawer({
                onAddReaction: ()=>{
                    dispatch(closePostMessageLongPressDrawer())
                    addEmojiReaction()
                },
                postUUID: postUUID,
                channelUUID: channelUUID,
                editMessage: () => {
                    setIsMessageEditEnabled(true)
                },
                deleteMessage: () => {
                    deleteMessage(postUUID)
                },
                isOwner: (selfProfile.data?.data.user_uuid == userInfo.user_uuid),
                isAdmin: isAdmin,
                handleEmojiClick: handleEmojiClick,
                copyTextToClipboard: copyText
            }))
        }

        else if(postUUID && commentUUID) {
            dispatch(openPostCommentMessageLongPressDrawer({
                copyTextToClipboard: copyText,
                deleteMessage: () => {
                    deleteMessage(commentUUID)
                },
                editMessage: () => {
                    setIsMessageEditEnabled(true)
                },
                handleEmojiClick: handleEmojiClick,
                onAddReaction: ()=>{
                    dispatch(closePostCommentMessageLongPressDrawer())
                    addEmojiReaction()
                },
                isOwner: (selfProfile.data?.data.user_uuid == userInfo.user_uuid),
                isAdmin: isAdmin
            }))

        }

        else if(chatMessageUUID && chatUUID && !commentUUID) {
            dispatch(openDmChatMessageLongPressDrawer({
                copyTextToClipboard: copyText,
                deleteMessage: () => {
                    deleteMessage(chatUUID)
                },
                editMessage: () => {
                    setIsMessageEditEnabled(true)
                },
                handleEmojiClick: handleEmojiClick,
                chatUUID: chatUUID,
                chatMessageUUID: chatMessageUUID,
                onAddReaction: addEmojiReaction,
                isOwner: (selfProfile.data?.data.user_uuid == userInfo.user_uuid),
                isAdmin: isAdmin
            }))
        }

        else if (commentUUID && chatMessageUUID) {
            dispatch(openDmChatCommentMessageLongPressDrawer({
                copyTextToClipboard: copyText,
                deleteMessage: () => {
                    deleteMessage(commentUUID)
                },
                editMessage: () => {
                    setIsMessageEditEnabled(true)
                },
                handleEmojiClick: handleEmojiClick,

                onAddReaction: addEmojiReaction,
                isOwner: (selfProfile.data?.data.user_uuid == userInfo.user_uuid),
                isAdmin: isAdmin
            }))
        }

    }

    const longPressEvent = useLongPress(handleLongPressPostComment, {
        threshold: 500, // Reduced from 800ms to 500ms for quicker long press
        onLongPressStart: () =>{

        }
    })



    const handleSelectAttachment = (attachment: AttachmentMediaReq) => {

        if(attachments) {
            dispatch(openMediaLightboxDialog({allMedia: attachments, media: attachment, mediaGetUrl: getMediaUrl}))

        }

    }



    return (

        <TouchableDiv
            rippleBrightness={0.8}
            rippleDuration={800}

        >

            <div  className='flex p-4 space-x-4 w-[100vw] pb-0 select-none' {...longPressEvent}


            >

                <div className='h-12 w-12 flex-shrink-0'>
                    <ChannelMessageAvatar userInfo={userInfo}/>

                </div>
                <div className='w-full'>
                    <div className='flex items-baseline space-x-2'>
                        <div className='font-semibold text-m'>
                            {userInfo.user_name}
                        </div>
                        <div className='text-xs text-muted-foreground text'>
                            {formatTimeForPostOrComment(createdAt)}

                        </div>
                    </div>
                    <div className='break-all'>


                        <MinimalTiptapTextInput
                            throttleDelay={300}
                            isOutputText={true}
                            className={cn("w-full rounded-xl h-auto", isMessageEditEnabled ? "p-2" : "border-none")}
                            editorContentClassName="overflow-auto "
                            output="html"
                            content={content}
                            placeholder={"message"}
                            editable={isMessageEditEnabled}
                            PrimaryButtonIcon={Check}
                            buttonOnclick={()=>{
                                updateMessage( commentUUID || postUUID || chatMessageUUID || '', updatedText)
                                setIsMessageEditEnabled(false)

                            }}
                            SecondaryButtonIcon={X}
                            secondaryButtonOnclick={()=>{
                                setIsMessageEditEnabled(false)
                            }}
                            editorClassName="focus:outline-none"
                            onChange={(content) => {
                                const s = content as string

                                setUpdatedText(s)

                            }}
                        >
                        </MinimalTiptapTextInput>
                        <div className={`${content?.length > 0 ? 'mb-4' : ''}`}/>


                        {forwardedMessage && (
                            <MessagePreview
                                msgBy={forwardedMessage.msgBy}
                                msgText={forwardedMessage.msgText}
                                msgChannelName={forwardedMessage.msgChannelName}
                                msgChannelUUID={forwardedMessage.msgChannelUUID}
                                msgUUID={forwardedMessage.msgUUID}
                                msgCreatedAt={forwardedMessage.msgCreatedAt}
                                vewFooter={true}
                            />
                        )}

                        {
                            !isMessageEditEnabled && attachments && attachments?.length > 0 &&
                            <MessageAttachments attachmentSelected={handleSelectAttachment} attachments={attachments} mediaGetUrl={getMediaUrl}/>
                        }


                        { !isMessageEditEnabled && <BottomMenu handleEmojiClick={handleEmojiClick} reactions={reactions} selectedEmojiId={userSelectedOption.emojiId}/>}

                    </div>
                </div>
            </div>
        </TouchableDiv>
    )
}