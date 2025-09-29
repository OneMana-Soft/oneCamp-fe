import {useDispatch, useSelector} from "react-redux"
import type { RootState } from "@/store/store"

import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {getForwardedMessageData, getMainMessageData} from "@/lib/utils/rightPanelHelper";
import {LoadingStateCircle} from "@/components/loading/loadingStateCircle";
import {ErrorState} from "@/components/error/errorState";
import {MessageContent} from "@/components/rightPanel/messageContent";
import {ReplyDivider} from "@/components/rightPanel/replyDivider";
import {CommentsList} from "@/components/rightPanel/commentsList";
import {RightPanelHeader} from "@/components/rightPanel/rightPanelHeader";
import {cn} from "@/lib/utils/cn";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {
    openChannelCommentFileUpload,
} from "@/store/slice/fileUploadSlice";
import {SendHorizontal} from "lucide-react";
import {usePost} from "@/hooks/usePost";
import {
    CreateCommentResInterface,
     CreateUpdateCommentReqInterface,
} from "@/types/comment";
import {useEffect} from "react";
import {UserProfileInterface} from "@/types/user";

import {openConfirmAlertMessageDialog} from "@/store/slice/dialogSlice";

import {CreateOrUpdateChatReaction, CreateOrUpdateCommentReaction, CreateOrUpdatePostReaction} from "@/types/reaction";
import {ChatInfoRes, CreateOrUpdateChatsReq} from "@/types/chat";
import {
    addChatComments,
    clearChatCommentInputState,
    createChatComment, createChatCommentReaction, createOrUpdateChatCommentBody,
    removeChatComment, removeChatCommentReaction,
    updateChatComment, updateChatCommentReaction
} from "@/store/slice/chatCommentSlice";
import {
    createChatReactionChatId,
    decrementChatCommentCountByChatID,
    removeChatByChatId, removeChatReactionByChatId,
    updateChatByChatId, updateChatMessageReplyDecrement, updateChatMessageReplyIncrement, updateChatReactionByChatId
} from "@/store/slice/chatSlice";
import {ChatCommentFileUpload} from "@/components/fileUpload/chatCommentFileUpload";

export const ChatComments = () => {
    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState)

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const chatState = useSelector((state: RootState) => state.chat.chatMessages[rightPanelState.data.chatUUID] || []);

    const chatCommentState = useSelector((state: RootState) => state.chatComments.chatComments[rightPanelState.data.chatMessageUUID] || {});

    const chatCommentInputState = useSelector((state: RootState) => state.chatComments.chatCommentInputState[rightPanelState.data.chatUUID] || {});


    const chatInfo = useFetch<ChatInfoRes>(
        rightPanelState.data.chatUUID && rightPanelState.data.chatMessageUUID ? `${GetEndpointUrl.GetChatWithAllComments}/${rightPanelState.data.chatMessageUUID}` : "",
    )

    const dispatch = useDispatch()

    const post = usePost()
    const handleRetry = () => {
        // Trigger refetch - this would depend on your useFetch implementation
        window.location.reload()
    }

    const chatInfoState = chatState.find(p => p.chat_uuid === rightPanelState.data.chatMessageUUID);


    useEffect(() => {

        if(chatInfo.data?.data && chatInfo.data.data.chat_comments && chatCommentState.length != 0) {
            dispatch(addChatComments({chatId: rightPanelState.data.chatMessageUUID, comments:chatInfo.data.data.chat_comments}))
        }



    }, [chatInfo.data]);


    if (chatInfo.isLoading || !chatInfo.data?.data || !chatInfoState) {
        return <LoadingStateCircle />
    }

    if (chatInfo.isError  ) {
        return <ErrorState onRetry={handleRetry}  errorMessage={'failed to fetch the thread'} errorTitle={'Thread not found'}/>
    }


    const mainMessageData = getMainMessageData(chatInfoState)
    const forwardedMessageData = getForwardedMessageData(chatInfoState)


    const handleDeletePost = (postId: string) => {

        if(!postId) return

        setTimeout(() => {
            dispatch(openConfirmAlertMessageDialog({
                title: "Deleting post",
                description: "Are you sure you want to proceed deleting the post",
                confirmText: "Delete post",
                onConfirm: ()=>{executeDeleteChat(postId)}
            }));
        }, 500);


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
                dispatch(removeChatByChatId({chatId: rightPanelState.data.chatUUID, messageId}))
            })

    }

    const handleDeleteChatComment = (commentUUID: string, commentIndex: number) => {

        if(!commentUUID) return

        setTimeout(() => {
            dispatch(openConfirmAlertMessageDialog({
                title: "Deleting chat",
                description: "Are you sure you want to proceed deleting the chat",
                confirmText: "Delete post",
                onConfirm: ()=>{executeDeleteChatComment(commentIndex, commentUUID)}
            }));
        }, 500);


    }


    const executeDeleteChatComment = ( commentIndex: number, commentUUID: string) => {

        post.makeRequest<CreateUpdateCommentReqInterface>({
            apiEndpoint: PostEndpointUrl.RemoveChatComment,
            payload: {
                chat_id: rightPanelState.data.chatMessageUUID,
                comment_id: commentUUID,
            },
            showToast: true
        })
            .then(() => {
                dispatch(removeChatComment({chatId: rightPanelState.data.chatMessageUUID, commentIndex}))
                dispatch(updateChatMessageReplyDecrement({messageId: rightPanelState.data.chatMessageUUID, chatId: rightPanelState.data.chatUUID, comment: {comment_uuid: commentUUID, comment_text: ''}}))

            })

    }

    const handleUpdateChatComment = ( commentUUID: string, commentHTMLText: string, commentIndex: number) => {

        post.makeRequest<CreateUpdateCommentReqInterface>({
            apiEndpoint: PostEndpointUrl.UpdateChatComment,
            payload: {
                chat_id: rightPanelState.data.chatMessageUUID,
                comment_id: commentUUID,
                comment_text_html: commentHTMLText
            },
            showToast: true
        })
            .then((res)=>{

                if(res) {
                    dispatch(updateChatComment({
                        commentIndex: commentIndex,
                        chatId: rightPanelState.data.chatMessageUUID,
                        htmlText: commentHTMLText,
                    }))
                }

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
                        chatId: rightPanelState.data.chatUUID,
                        messageId,
                        htmlText: postHTMLText,
                    }))
                }

            })
    }

    const handleSend = () => {

        post.makeRequest<CreateUpdateCommentReqInterface, CreateCommentResInterface>({
            apiEndpoint: PostEndpointUrl.CreateChatComment,
            payload: {
                chat_id: rightPanelState.data.chatMessageUUID,
                comment_attachments: chatCommentInputState.filesUploaded,
                comment_text_html: chatCommentInputState.commentBody,
            }
        })
            .then((res)=>{

                if(res?.comment_id && selfProfile.data?.data) {
                    dispatch(createChatComment({commentId: res?.comment_id, commentCreatedAt: res?.comment_created_at, commentText: chatCommentInputState.commentBody, chatId: rightPanelState.data.chatMessageUUID, commentBy: selfProfile.data?.data, attachments:chatCommentInputState.filesUploaded}))
                    dispatch(updateChatMessageReplyIncrement({messageId: rightPanelState.data.chatMessageUUID, chatId: rightPanelState.data.chatUUID, comment: {comment_uuid: res?.comment_id, comment_created_at: res?.comment_created_at, comment_text: ""}}))

                }

                // chatInfo.mutate()
                dispatch(clearChatCommentInputState({chatUUID: rightPanelState.data.chatUUID}))


            })
    }

    const createOrUpdateReaction = ( emojiId:string, reactionId:string)=> {

        post.makeRequest<CreateOrUpdateChatReaction, CreateOrUpdateChatReaction>({apiEndpoint: PostEndpointUrl.CreateOrUpdateChatReaction,
            payload :{
                chat_id: rightPanelState.data.chatMessageUUID,
                reaction_emoji_id: emojiId,
                reaction_dgraph_id: reactionId
            }})
            .then((res)=>{


                if(reactionId) {
                    dispatch(updateChatReactionByChatId({chatId: rightPanelState.data.chatUUID, reactionId, emojiId, messageId: rightPanelState.data.chatMessageUUID}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createChatReactionChatId({chatId: rightPanelState.data.chatUUID, messageId: rightPanelState.data.chatMessageUUID, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
                }
            })
    }

    const removeReaction = (reactionId:string) => {

        post.makeRequest<CreateOrUpdateChatReaction>({apiEndpoint: PostEndpointUrl.RemoveChatReaction,
            payload :{
                chat_id: rightPanelState.data.chatMessageUUID,
                reaction_dgraph_id: reactionId
            }})
            .then(()=>{


                dispatch(removeChatReactionByChatId({ chatId: rightPanelState.data.chatUUID, messageId: rightPanelState.data.chatMessageUUID, reactionId}))


            })
    }


    const createOrUpdateCommentReaction = (emojiId:string, reactionId:string, commentId:string, commentIdx: number) => {
        post.makeRequest<CreateOrUpdateCommentReaction, CreateOrUpdateCommentReaction>({apiEndpoint: PostEndpointUrl.CreateOrUpdateChatCommentReaction,
            payload :{
                comment_id: commentId,
                reaction_emoji_id: emojiId,
                reaction_dgraph_id: reactionId
            }})
            .then((res)=>{


                if(reactionId) {
                    dispatch(updateChatCommentReaction({commentIndex: commentIdx, reactionId, emojiId, chatId:rightPanelState.data.chatMessageUUID}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createChatCommentReaction({chatId:rightPanelState.data.chatMessageUUID, commentIndex: commentIdx, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
                }
            })
    }

    const removeCommentReaction = (reactionId:string, commentId: string, commentIdx: number) => {

        post.makeRequest<CreateOrUpdateCommentReaction>({apiEndpoint: PostEndpointUrl.RemoveChatCommentReaction,
            payload :{
                comment_id: commentId,
                reaction_dgraph_id: reactionId
            }})
            .then(()=>{


                dispatch(removeChatCommentReaction({commentIndex: commentIdx, reactionId, chatId:rightPanelState.data.chatMessageUUID}))

            })
    }


    return (
        <div className="h-full flex flex-col p-4 pb-0">
            <RightPanelHeader titleKey={'thread'}/>

            <MessageContent
                userInfo={mainMessageData.userInfo}
                createdAt={mainMessageData.createdAt}
                content={mainMessageData.content}
                forwardedMessage={forwardedMessageData}
                channelUUID={mainMessageData.channelUUID}
                chatUUID={mainMessageData.chatUUID}
                removeReaction={removeReaction}
                addReaction={createOrUpdateReaction}
                rawReactions={mainMessageData.reactions}
                deleteMessage={handleDeletePost}
                updateMessage={handleUpdateChat}
                postUUID={rightPanelState.data.postUUID}
                isAdmin={selfProfile.data?.data.user_is_admin}
                getMediaUrl={GetEndpointUrl.GetChannelMedia + '/' + rightPanelState.data.channelUUID}
                attachments={mainMessageData.attachments}
            />

            {mainMessageData.commentCount > 0 && (

                <ReplyDivider replyCount={mainMessageData.commentCount} />


            )}

            <div className="flex-1 overflow-y-auto pb-4 pr-2 pt-2 space-y-4">


                <CommentsList
                    comments={chatCommentState}
                    removeReaction={removeCommentReaction}
                    addOrUpdateReaction={createOrUpdateCommentReaction}
                    removeComment={handleDeleteChatComment}
                    updateComment={handleUpdateChatComment}
                    getMediaURL={GetEndpointUrl.GetChannelMedia + '/' + rightPanelState.data.channelUUID}

                />

                <MinimalTiptapTextInput
                    throttleDelay={300}
                    attachmentOnclick = {()=>{
                        dispatch(openChannelCommentFileUpload())}
                    }
                    ButtonIcon={SendHorizontal}
                    buttonOnclick={handleSend}
                    className={cn("max-w-full rounded-xl h-auto border p-2 bg-secondary/20")}
                    editorContentClassName="overflow-auto"
                    output="html"
                    placeholder={"Add a message, if you'd like..."}
                    editable={true}
                    toggleToolbar={true}
                    editorClassName="focus:outline-none px-5 py-4"
                    onChange={(content ) => {
                        dispatch(createOrUpdateChatCommentBody({chatUUID:rightPanelState.data.chatUUID, body: content as string}))
                    }}
                    content={chatCommentInputState?.commentBody || null}
                >
                    <ChatCommentFileUpload chatUUID={rightPanelState.data.chatUUID} chatMessageUUID={rightPanelState.data.chatMessageUUID}/>

                </MinimalTiptapTextInput>
            </div>
        </div>
    )
}
