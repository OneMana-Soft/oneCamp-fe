"use client"

import { ChannelMessageAvatar } from "@/components/channel/channelMessageAvatar"
import { formatTimeForPostOrComment } from "@/lib/utils/formatTimeForPostOrComment"
import MinimalTiptapTextInput from "@/components/textInput/textInput"
import { MessagePreview } from "@/components/message/MessagePreview"
import { cn } from "@/lib/utils/cn"
import {Check, SendHorizontal, X} from "lucide-react"
import {UserProfileDataInterface, UserProfileInterface, UserSelectedOptionInterface} from "@/types/user";
import {ForwardedMessageData} from "@/types/rightPanel";

import {useEffect, useState} from "react";
import {
    MessageDesktopHoverOptionsForRightPanelChatAndChannel
} from "@/components/MessageDesktopHover/MessageDesktopHoverOptionsForRightPanelChatAndChannel";
import {GroupedReaction} from "@/types/reaction";
import {BottomMenu} from "@/components/message/bottomMenu";
import { useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {AttachmentMediaReq} from "@/types/attachment";
import {MessageAttachments} from "@/components/message/MessageAttachments";
import {openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import {useDispatch} from "react-redux";

interface MessageContentProps {
    userInfo: UserProfileDataInterface
    createdAt: string
    content: string
    forwardedMessage?: ForwardedMessageData
    channelUUID?: string
    commentUUID?: string
    postUUID?: string
    chatUUID?: string
    rawReactions?: GroupedReaction[]
    removeReaction: (reactionId: string) => void
    attachments: AttachmentMediaReq[]
    addReaction: (emojiId:string, reactionId: string) => void
    isAdmin?: boolean;
    updateMessage: (id: string, body: string) => void;
    deleteMessage: (id: string) => void;
    getMediaUrl: string
}

export const MessageContent = ({
                                   userInfo,
                                   createdAt,
                                   content,
                                   forwardedMessage,
    getMediaUrl,
    attachments,
    commentUUID,
    deleteMessage,
    isAdmin,
   updateMessage,
    removeReaction,
    addReaction,
    rawReactions,
    channelUUID,
    postUUID,
    chatUUID
                               }: MessageContentProps) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userSelectedOption, setUserSelectedOption] = useState<UserSelectedOptionInterface>({} as UserSelectedOptionInterface)
    const [reactions, setReactions] = useState<{ [key: string]: string[] }>({});

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const[isMessageEditEnabled, setIsMessageEditEnabled] = useState(false);

    const [updatedText, setUpdatedText] = useState<string>(content||'');

    const dispatch = useDispatch()

    const handleEmojiClick = (emojiId: string) => {
        if(userSelectedOption.emojiId == emojiId) {
            removeReaction(userSelectedOption.reactionId)
            return
        }

        addReaction(emojiId, userSelectedOption.reactionId)
    }

    useEffect(() => {
        setUserSelectedOption({} as UserSelectedOptionInterface)
        setReactions({})
        if (rawReactions && selfProfile.data?.data) {
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


    }, [selfProfile.data?.data, rawReactions]);

    const handleSelectAttachment = (attachment: AttachmentMediaReq) => {

        if(attachments) {
            dispatch(openMediaLightboxDialog({allMedia:  attachments, media: attachment, mediaGetUrl: getMediaUrl}))

        }

    }


    return (
        <div className={`flex relative space-x-4 pt-4 hover:bg-primary/5 transition-colors delay-200 group ${isDropdownOpen || isEmojiPickerOpen? 'bg-primary/5':''}`}>

            {!isMessageEditEnabled && <div
                className={cn(
                    "absolute -top-0.5 right-2 transition-opacity delay-200 z-40",
                    (isDropdownOpen || isEmojiPickerOpen) || "opacity-0 group-hover:opacity-100",
                )}
            >
                <MessageDesktopHoverOptionsForRightPanelChatAndChannel
                    setIsDropdownOpen={setIsDropdownOpen}
                    channelUUID={channelUUID}
                    postUUID={postUUID}
                    setEmojiPopupState={setIsEmojiPickerOpen}
                    onReactionSelect={handleEmojiClick}
                    editMessage={()=>{setIsMessageEditEnabled(true)}}
                    isOwner={selfProfile.data?.data.user_uuid == userInfo.user_uuid}
                    isAdmin={isAdmin}
                    deleteMessage={()=>{deleteMessage(chatUUID || postUUID || commentUUID || '')}}

                />
            </div>}
            <div className="h-12 w-12 flex-shrink-0">
                <ChannelMessageAvatar userInfo={userInfo}/>
            </div>
            <div className="flex-1 mb-4">
                <div className="flex items-baseline space-x-2 mb-1">
                    <div className="font-semibold text-sm">{userInfo.user_name}</div>
                    <div className="text-xs text-muted-foreground">{formatTimeForPostOrComment(createdAt)}</div>
                </div>

                <div className="break-all">
                    <MinimalTiptapTextInput
                        throttleDelay={300}
                        isOutputText={true}
                        className={cn("max-w-full rounded-xl h-auto",
                            isMessageEditEnabled ? "p-2" : "border-none"
                        )}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={content}
                        placeholder="message"
                        editable={isMessageEditEnabled}

                        editorClassName="focus:outline-none"
                        onChange={(content) => {

                            const s = content as string

                            setUpdatedText(s)
                        }}
                        PrimaryButtonIcon={Check}
                        buttonOnclick={()=>{
                            updateMessage(chatUUID || postUUID || commentUUID || '', updatedText)
                            setIsMessageEditEnabled(false)
                            setIsDropdownOpen(false)

                        }}
                        SecondaryButtonIcon={X}
                        secondaryButtonOnclick={()=>{
                            setIsMessageEditEnabled(false)
                            setIsDropdownOpen(false)
                        }}
                        toggleToolbar={true}
                    />
                </div>

                {forwardedMessage && !isMessageEditEnabled && (
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
                    !isMessageEditEnabled && attachments && attachments.length  > 0 &&
                    <MessageAttachments attachmentSelected={handleSelectAttachment} attachments={attachments} mediaGetUrl={getMediaUrl}/>
                }


                {!isMessageEditEnabled && <BottomMenu handleEmojiClick={handleEmojiClick} reactions={reactions} selectedEmojiId={userSelectedOption.emojiId}/>}

            </div>
        </div>
    )
}
