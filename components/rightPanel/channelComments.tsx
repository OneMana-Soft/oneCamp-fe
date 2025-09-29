import {useDispatch, useSelector} from "react-redux"
import type { RootState } from "@/store/store"

import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {CreateOrUpdatePostsReq, CreatePostsRes, PostsResRaw} from "@/types/post";
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
import {openChannelCommentFileUpload} from "@/store/slice/fileUploadSlice";
import {
    addChannelComments,
    clearChannelCommentMsgInputState,
    createChannelComment,
    createChannelCommentReaction,
    createOrUpdateChannelCommentMsg,
    removeChannelComment,
    removeChannelCommentReaction,
    updateChannelComment,
    updateChannelCommentReaction
} from "@/store/slice/channelCommentSlice";
import {ChannelCommentFileUpload} from "@/components/fileUpload/channelCommentFileUpload";
import {SendHorizontal} from "lucide-react";
import {usePost} from "@/hooks/usePost";
import {
    CreateCommentResInterface,
     CreateUpdateCommentReqInterface,

} from "@/types/comment";
import {useEffect} from "react";
import {CreateOrUpdateCommentReaction, CreateOrUpdatePostReaction} from "@/types/reaction";
import {
    createPostReactionPostId,

    removePostByPostId,
    removePostReactionByPostId,
    updateChannelMessageReplyDecrement,
    updateChannelMessageReplyIncrement,
    updatePostByPostId,
    updatePostReactionPostId
} from "@/store/slice/channelSlice";
import {UserProfileInterface} from "@/types/user";
import {openConfirmAlertMessageDialog} from "@/store/slice/dialogSlice";

export const ChannelComments = () => {
    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState)

    const channelCommentState = useSelector((state: RootState) => state.channelComment.commentInputState[rightPanelState.data.channelUUID])
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const channelState = useSelector((state: RootState) => state.channel.channelPosts[rightPanelState.data.channelUUID] || []);

    const postCommentState = useSelector((state: RootState) => state.channelComment.postComments[rightPanelState.data.postUUID] || {});


    const postInfo = useFetch<PostsResRaw>(
        rightPanelState.data.channelUUID && rightPanelState.data.postUUID ? `${GetEndpointUrl.GetPostWithAllComments}/${rightPanelState.data.postUUID}` : "",
    )

    const dispatch = useDispatch()

    const post = usePost()
    const handleRetry = () => {
        // Trigger refetch - this would depend on your useFetch implementation
        window.location.reload()
    }

    const postState = channelState?.find(p => p.post_uuid === rightPanelState.data.postUUID);


    useEffect(() => {

        if(postInfo.data?.data && postInfo.data.data.post_comments && postCommentState.length != 0) {
            dispatch(addChannelComments({postId: rightPanelState.data.postUUID, comments:postInfo.data.data.post_comments}))
        }



    }, [postInfo.data]);


    if (postInfo.isLoading || !postInfo.data?.data || !postState) {
        return <LoadingStateCircle />
    }

    if (postInfo.isError  ) {
        return <ErrorState onRetry={handleRetry}  errorMessage={'failed to fetch the thread'} errorTitle={'Thread not found'}/>
    }


    const mainMessageData = getMainMessageData(postState)
    const forwardedMessageData = getForwardedMessageData(postState)


    const handleDeletePost = (postId: string) => {

        if(!postId) return

        setTimeout(() => {
            dispatch(openConfirmAlertMessageDialog({
                title: "Deleting post",
                description: "Are you sure you want to proceed deleting the post",
                confirmText: "Delete post",
                onConfirm: ()=>{executeDeletePost(postId)}
            }));
        }, 500);


    }

    const executeDeletePost = (postId: string) => {

        post.makeRequest<CreateOrUpdatePostsReq>({
            apiEndpoint: PostEndpointUrl.DeleteChannelPost,
            payload: {
                post_id: postId
            },
            showToast: true
        })
            .then(() => {
                dispatch(removePostByPostId({postId, channelId: rightPanelState.data.channelUUID}))
            })

    }

    const handleDeletePostComment = (commentUUID: string, commentIndex: number) => {

        if(!commentUUID) return

        setTimeout(() => {
            dispatch(openConfirmAlertMessageDialog({
                title: "Deleting post",
                description: "Are you sure you want to proceed deleting the post comment",
                confirmText: "Delete post comment",
                onConfirm: ()=>{executeDeletePostComment(commentIndex, commentUUID)}
            }));
        }, 500);


    }


    const executeDeletePostComment = ( commentIndex: number, commentUUID: string) => {

        post.makeRequest<CreateUpdateCommentReqInterface>({
            apiEndpoint: PostEndpointUrl.RemovePostComment,
            payload: {
                post_id: rightPanelState.data.postUUID,
                comment_id: commentUUID,
            },
            showToast: true
        })
            .then(() => {
                dispatch(removeChannelComment({postId: rightPanelState.data.postUUID, commentIndex}))
                // dispatch(decrementPostCommentCountByPostID({channelId: rightPanelState.data.channelUUID, postId: rightPanelState.data.postUUID}))
                dispatch(updateChannelMessageReplyDecrement({channelId: rightPanelState.data.channelUUID, messageId: rightPanelState.data.postUUID, comment:{comment_uuid: commentUUID, comment_text:""}}))


            })

    }

    const handleUpdatePostComment = ( commentUUID: string, commentHTMLText: string, commentIndex: number) => {

        post.makeRequest<CreateUpdateCommentReqInterface>({
            apiEndpoint: PostEndpointUrl.UpdatePostComment,
            payload: {
                post_id: rightPanelState.data.postUUID,
                comment_id: commentUUID,
                comment_text_html: commentHTMLText
            },
            showToast: true
        })
            .then((res)=>{

                if(res) {
                    dispatch(updateChannelComment({
                        commentIndex: commentIndex,
                        postId: rightPanelState.data.postUUID,
                        htmlText: commentHTMLText,
                    }))
                }

            })
    }

    const handleUpdatePost = (postHTMLText: string, postId: string) => {

        post.makeRequest<CreateOrUpdatePostsReq, CreatePostsRes>({
            apiEndpoint: PostEndpointUrl.UpdateChannelPost,
            payload: {
                post_id: postId,
                post_text_html: postHTMLText
            },
            showToast: true
        })
            .then((res)=>{

                if(res) {
                    dispatch(updatePostByPostId({
                        postId: postId,
                        channelId: rightPanelState.data.channelUUID,
                        htmlText: postHTMLText,
                    }))
                }

            })

    }

    const handleSend = () => {

        post.makeRequest<CreateUpdateCommentReqInterface, CreateCommentResInterface>({
            apiEndpoint: PostEndpointUrl.CreatePostComment,
            payload: {
                post_id: rightPanelState.data.postUUID,
                comment_attachments: channelCommentState.filesUploaded,
                comment_text_html: channelCommentState.commentMsgBody,
            }
        })
            .then((res)=>{

                if(res?.comment_id && selfProfile.data?.data) {
                    dispatch(createChannelComment({commentId: res?.comment_id, commentCreatedAt: res?.comment_created_at, commentText: channelCommentState.commentMsgBody, postId: rightPanelState.data.postUUID, commentBy: selfProfile.data?.data, attachments:channelCommentState.filesUploaded}))

                }

                // postInfo.mutate()
                dispatch(clearChannelCommentMsgInputState({channelId: rightPanelState.data.channelUUID}))

                dispatch(updateChannelMessageReplyIncrement({channelId: rightPanelState.data.channelUUID, messageId: rightPanelState.data.postUUID, comment:{comment_uuid: res?.comment_id||'', comment_created_at: res?.comment_created_at, comment_text: ""}}))


            })
    }

    const createOrUpdateReaction = ( emojiId:string, reactionId:string)=> {

        post.makeRequest<CreateOrUpdatePostReaction, CreateOrUpdatePostReaction>({apiEndpoint: PostEndpointUrl.CreateOrUpdatePostReaction,
            payload :{
                post_id: rightPanelState.data.postUUID,
                reaction_emoji_id: emojiId,
                reaction_dgraph_id: reactionId
            }})
            .then((res)=>{


                if(reactionId) {
                    dispatch(updatePostReactionPostId({channelId: rightPanelState.data.channelUUID, reactionId, emojiId, postId:rightPanelState.data.postUUID}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createPostReactionPostId({postId:rightPanelState.data.postUUID, channelId: rightPanelState.data.channelUUID, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
                }
            })
    }

    const removeReaction = (reactionId:string) => {

        post.makeRequest<CreateOrUpdatePostReaction>({apiEndpoint: PostEndpointUrl.RemovePostReaction,
            payload :{
                post_id: rightPanelState.data.postUUID,
                reaction_dgraph_id: reactionId
            }})
            .then(()=>{


                dispatch(removePostReactionByPostId({channelId: rightPanelState.data.channelUUID, reactionId, postId:rightPanelState.data.postUUID}))

            })
    }


    const createOrUpdateCommentReaction = (emojiId:string, reactionId:string, commentId:string, commentIdx: number) => {
        post.makeRequest<CreateOrUpdateCommentReaction, CreateOrUpdateCommentReaction>({apiEndpoint: PostEndpointUrl.CreateOrUpdatePostCommentReaction,
            payload :{
                comment_id: commentId,
                reaction_emoji_id: emojiId,
                reaction_dgraph_id: reactionId
            }})
            .then((res)=>{


                if(reactionId) {
                    dispatch(updateChannelCommentReaction({commentIndex: commentIdx, reactionId, emojiId, postId:rightPanelState.data.postUUID}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createChannelCommentReaction({postId:rightPanelState.data.postUUID, commentIndex: commentIdx, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
                }
            })
    }

    const removeCommentReaction = (reactionId:string, commentId: string, commentIdx: number) => {

        post.makeRequest<CreateOrUpdateCommentReaction>({apiEndpoint: PostEndpointUrl.RemovePostCommentReaction,
            payload :{
                comment_id: commentId,
                reaction_dgraph_id: reactionId
            }})
            .then(()=>{


                dispatch(removeChannelCommentReaction({commentIndex: commentIdx, reactionId, postId:rightPanelState.data.postUUID}))

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
                    updateMessage={handleUpdatePost}
                    postUUID={rightPanelState.data.postUUID}
                    isAdmin={postInfo.data.data.post_channel?.ch_is_admin}
                    getMediaUrl={GetEndpointUrl.GetChannelMedia + '/' + rightPanelState.data.channelUUID}
                    attachments={mainMessageData.attachments}
                />

                {mainMessageData.commentCount > 0 && (

                        <ReplyDivider replyCount={mainMessageData.commentCount} />


                )}

            <div className="flex-1 overflow-y-auto pb-4 pr-2 pt-2 space-y-4">


                <CommentsList
                    comments={postCommentState}
                    removeReaction={removeCommentReaction}
                    addOrUpdateReaction={createOrUpdateCommentReaction}
                    removeComment={handleDeletePostComment}
                    updateComment={handleUpdatePostComment}
                    getMediaURL={GetEndpointUrl.GetChannelMedia + '/' + rightPanelState.data.channelUUID}

                />

                <MinimalTiptapTextInput
                    throttleDelay={300}
                    attachmentOnclick = {()=>{
                        dispatch(openChannelCommentFileUpload())}
                    }
                    ButtonIcon={SendHorizontal}
                    buttonOnclick={handleSend}
                    className={cn("max-w-full rounded-xl h-auto border bg-secondary/20 p-2")}
                    editorContentClassName="overflow-auto"
                    output="html"
                    placeholder={"Add a message, if you'd like..."}
                    editable={true}
                    toggleToolbar={ true}
                    editorClassName="focus:outline-none px-5 py-4"
                    onChange={(content ) => {
                        dispatch(createOrUpdateChannelCommentMsg({channelId:rightPanelState.data.channelUUID, body: content as string}))
                    }}
                    content={channelCommentState?.commentMsgBody || null}
                >
                    <ChannelCommentFileUpload channelId={rightPanelState.data.channelUUID}/>

                </MinimalTiptapTextInput>
            </div>
        </div>
    )
}
