import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {PostsRes} from "@/types/post";
import {cn} from "@/lib/utils/cn";
import {Check, SendHorizontal, X} from "lucide-react";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {useLongPress} from "@/hooks/useLongPress";
import {useDispatch} from "react-redux";
import {
    closeChannelMessageLongPressDrawer,
    openChannelMessageLongPressDrawer,
    openReactionPickerDrawer
} from "@/store/slice/drawerSlice";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {MessagePreview} from "@/components/message/MessagePreview";
import {app_channel_path, app_home_path} from "@/types/paths";
import {usePathname, useRouter} from "next/navigation";
import {MessageAttachments} from "@/components/message/MessageAttachments";
import {GetEndpointUrl} from "@/services/endPoints";
import {BottomMenu} from "@/components/message/bottomMenu";
import {useEffect, useState} from "react";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface, UserSelectedOptionInterface} from "@/types/user";
import {ATTACHMENT_MAX_IMAGE_GRID_SIZE, AttachmentMediaReq} from "@/types/attachment";
import {openConfirmAlertMessageDialog, openMediaLightboxDialog} from "@/store/slice/dialogSlice";
import { ConditionalWrap } from "../conditionalWrap/conditionalWrap";
import {MessageReplyCount} from "@/components/message/messageReplyCount";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";
import {removeHtmlTags} from "@/lib/utils/removeHtmlTags";

interface ChannelMessageProps {
    postInfo: PostsRes
    isAdmin?: boolean
    addReaction: (emojiId: string, reactionId: string) => void
    removeReaction: (reactionId: string) => void
    channelId: string
    removePost: () => void
    updatePost: (body: string) => void
}


export const ChannelMessageMobile = ({postInfo, channelId, isAdmin, addReaction, removeReaction, removePost, updatePost}: ChannelMessageProps) => {

    const dispatch = useDispatch();

    const router = useRouter();

    const copyToClipboard = useCopyToClipboard()

    const[isMessageEditEnabled, setIsMessageEditEnabled] = useState(false);

    const [userSelectedOption, setUserSelectedOption] = useState<UserSelectedOptionInterface>({} as UserSelectedOptionInterface)
    const [reactions, setReactions] = useState<{ [key: string]: string[] }>({});

    const [updatedText, setUpdatedText] = useState<string>(postInfo.post_text||'');

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    useEffect(() => {
        setUserSelectedOption({} as UserSelectedOptionInterface)
        setReactions({})
        if (selfProfile.data?.data && postInfo.post_reactions) {
            postInfo.post_reactions.forEach((reaction) => {
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


    }, [postInfo, selfProfile.data?.data]);

    const addEmojiReaction = () => {

        dispatch(closeChannelMessageLongPressDrawer())

        dispatch(openReactionPickerDrawer({
            onReactionSelect(reaction: StandardReaction | SyncCustomReaction): void {
                handleEmojiClick(reaction.id)
            },
            showCustomReactions: false
        }))

    }

    const copyPostText = () => {
        const t = removeHtmlTags(postInfo.post_text)

        copyToClipboard.copy(t, 'copied post text')
    }

    const onLongPress = () => {
        dispatch(openChannelMessageLongPressDrawer({
            onAddReaction: addEmojiReaction,
            postUUID: postInfo.post_uuid||'',
            channelUUID: channelId,
            editMessage: () => {setIsMessageEditEnabled(true)},
            deleteMessage: removePost,
            isAdmin: isAdmin,
            isOwner: postInfo.post_by.user_uuid == selfProfile.data?.data.user_uuid,
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

        if(postInfo.post_attachments) {
            dispatch(openMediaLightboxDialog({allMedia:  postInfo.post_attachments, media: attachment, mediaGetUrl: GetEndpointUrl.GetChannelMedia + '/' + channelId}))

        }

    }

    const handleOnCLick = () => {

        setTimeout(() => {
            router.push(`${app_channel_path}/${channelId}/${postInfo.post_uuid}`);

        }, 500);


    }



    return (

        <div  className='flex p-4 space-x-4 select-none' {...longPressEvent} >

            <div className='h-12 w-12 flex-shrink-0'>
                <ChannelMessageAvatar userInfo={postInfo.post_by}/>

            </div>
            <div className='w-full'>
                <div className='flex items-baseline space-x-2'>
                    <div className='font-semibold text-m'>
                        {postInfo.post_by.user_name}
                    </div>
                    <div className='text-xs text-muted-foreground text'>
                        {formatTimeForPostOrComment(postInfo.post_created_at, true)}

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
                        editorContentClassName={cn("overflow-auto")}
                        output="html"
                        content={postInfo.post_text}
                        placeholder={"message"}
                        editable={isMessageEditEnabled}
                        PrimaryButtonIcon={Check}
                        buttonOnclick={()=>{
                            updatePost(updatedText)
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
                    <div className={`${postInfo.post_text && postInfo.post_text.length > 0 ? 'mb-4' : ''}`}/>


                        {
                            (postInfo.post_fwd_msg_chat || postInfo.post_fwd_msg_post) &&

                            <MessagePreview
                                msgBy={postInfo.post_by || postInfo.post_fwd_msg_chat?.chat_from}
                                msgText={postInfo.post_fwd_msg_post?.post_text || postInfo.post_fwd_msg_chat?.chat_body_text || ''}
                                msgChannelName={postInfo.post_fwd_msg_post?.post_channel?.ch_name}
                                msgChannelUUID={postInfo.post_fwd_msg_post?.post_channel?.ch_uuid}
                                msgUUID={postInfo.post_fwd_msg_post?.post_uuid || postInfo.post_fwd_msg_chat?.chat_uuid}
                                msgCreatedAt={postInfo.post_fwd_msg_post?.post_created_at || postInfo.post_fwd_msg_chat?.chat_created_at}
                                vewFooter={true}
                            />
                        }
                    </div>

                </ConditionalWrap>

                {
                    !isMessageEditEnabled && postInfo.post_attachments && postInfo.post_attachments?.length > 0 &&
                    <MessageAttachments attachmentSelected={handleSelectAttachment} attachments={postInfo.post_attachments} mediaGetUrl={GetEndpointUrl.GetChannelMedia + '/' + channelId}/>
                }

                {postInfo.post_comments && postInfo.post_comment_count && <div className='mb-3' onClick={handleOnCLick}><MessageReplyCount replyCount={postInfo.post_comment_count} lastCommentCreatedAt={postInfo.post_comments[postInfo.post_comments.length-1].comment_created_at}/></div>}

                { !isMessageEditEnabled && <BottomMenu handleEmojiClick={handleEmojiClick} reactions={reactions} selectedEmojiId={userSelectedOption.emojiId}/>}



            </div>



        </div>
    )
}