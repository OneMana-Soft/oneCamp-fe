"use client"


import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {type CreateOrUpdatePostsReq, CreatePostsRes, PostsResRaw} from "@/types/post";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {
    CreateOrUpdateCommentReaction,
    type CreateOrUpdatePostReaction,

} from "@/types/reaction";
import {MobileMessage} from "@/components/mobileMessage/mobileMessage";
import {getForwardedMessageData, getMainMessageData} from "@/lib/utils/rightPanelHelper";
import {MobileMessageCommentList} from "@/components/mobileMessage/mobileMessageCommentList";
import {ReplyDivider} from "@/components/rightPanel/replyDivider";
import {LoadingStateCircle} from "@/components/loading/loadingStateCircle";
import {ErrorState} from "@/components/error/errorState";
import { UserProfileInterface} from "@/types/user";
import {useEffect} from "react";
import {
    addChannelComments,
    createChannelCommentReaction, removeChannelComment, removeChannelCommentReaction, updateChannelComment,
    updateChannelCommentReaction
} from "@/store/slice/channelCommentSlice";
import type {RootState} from "@/store/store";
import {openConfirmAlertMessageDialog} from "@/store/slice/dialogSlice";
import {
    createPostReactionPostId,
    removePostByPostId,
    removePostReactionByPostId, updateChannelMessageReplyDecrement, updatePostByPostId,
    updatePostReactionPostId
} from "@/store/slice/channelSlice";
import {usePost} from "@/hooks/usePost";
import {CreateUpdateCommentReqInterface} from "@/types/comment";

export const MobilePost = ({ channelId, postUUID }: { channelId: string, postUUID: string }) => {

    const postInfo = useFetch<PostsResRaw>(
        channelId && postUUID ? `${GetEndpointUrl.GetPostWithAllComments}/${postUUID}` : "",
    )

    const channelState = useSelector((state: RootState) => state.channel.channelPosts[channelId] || []);

    const postState = channelState?.find(p => p.post_uuid === postUUID);

    const postCommentState = useSelector((state: RootState) => state.channelComment.postComments[postUUID] || []);

    const post = usePost()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)



    const dispatch = useDispatch()
    const handleRetry = () => {
        // Trigger refetch - this would depend on your useFetch implementation
        window.location.reload()
    }

    useEffect(() => {

        if(postInfo.data?.data && postInfo.data.data.post_comments && postCommentState.length != postInfo.data.data.post_comments.length) {
            dispatch(addChannelComments({postId: postUUID, comments:postInfo.data.data.post_comments}))
        }



    }, [postInfo.data?.data]);


    if (postInfo.isLoading || !postState) {
        return <LoadingStateCircle />
    }

    if (postInfo.isError  || !postInfo.data?.data) {
        return <ErrorState onRetry={handleRetry}  errorMessage={'failed to fetch the thread'} errorTitle={'Thread not found'}/>
    }


    const mainMessageData = getMainMessageData(postState)
    const forwardedMessageData = getForwardedMessageData(postState)

    const handleDeletePost = () => {
        if (!postUUID) return


        setTimeout(() => {
            dispatch(
                openConfirmAlertMessageDialog({
                    title: "Deleting post",
                    description: "Are you sure you want to proceed deleting the post",
                    confirmText: "Delete post",
                    onConfirm: () => {
                        setTimeout(() => {executeDeletePost(postUUID)},100)
                    },
                }),
            )
        }, 500)
    }

    const handleUpdatePost = (postId: string, postHTMLText: string) => {

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
                        channelId: channelId,
                        htmlText: postHTMLText,
                    }))
                }

            })

    }

    const executeDeletePost = (postId: string) => {

        post.makeRequest<CreateOrUpdatePostsReq>({
            apiEndpoint: PostEndpointUrl.DeleteChannelPost,
            payload: {
                post_id: postId,
            },
            showToast: true,
        })
            .then(() => {
                dispatch(removePostByPostId({ postId, channelId }))

            })


    }


    const createOrUpdateReaction = ( emojiId: string, reactionId: string) => {
        if (!postUUID) return

        post
            .makeRequest<CreateOrUpdatePostReaction, CreateOrUpdatePostReaction>({
                apiEndpoint: PostEndpointUrl.CreateOrUpdatePostReaction,
                payload: {
                    post_id: postUUID,
                    reaction_emoji_id: emojiId,
                    reaction_dgraph_id: reactionId,
                },
            })
            .then((res) => {
                if (reactionId) {
                    dispatch(updatePostReactionPostId({ channelId, reactionId, emojiId, postId:postUUID }))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data) {
                    dispatch(
                        createPostReactionPostId({
                            postId: postUUID,
                            channelId,
                            reactionId: res?.reaction_dgraph_id,
                            emojiId,
                            addedBy: selfProfile.data?.data,
                        }),
                    )
                }
            })
    }


    const removeReaction = (reactionId: string) => {
        post
            .makeRequest<CreateOrUpdatePostReaction>({
                apiEndpoint: PostEndpointUrl.RemovePostReaction,
                payload: {
                    post_id: postUUID,
                    reaction_dgraph_id: reactionId,
                },
            })
            .then(() => {
                dispatch(removePostReactionByPostId({ channelId: channelId, reactionId, postId: postUUID }))
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
                    dispatch(updateChannelCommentReaction({commentIndex: commentIdx, reactionId, emojiId, postId:postUUID}))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data){
                    dispatch(createChannelCommentReaction({postId:postUUID, commentIndex: commentIdx, reactionId: res?.reaction_dgraph_id, emojiId, addedBy: selfProfile.data?.data}))
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


                dispatch(removeChannelCommentReaction({commentIndex: commentIdx, reactionId, postId:postUUID}))

            })
    }

    const handleUpdatePostComment = ( commentUUID: string, commentHTMLText: string, commentIndex: number) => {

        post.makeRequest<CreateUpdateCommentReqInterface>({
            apiEndpoint: PostEndpointUrl.UpdatePostComment,
            payload: {
                post_id: postUUID,
                comment_id: commentUUID,
                comment_text_html: commentHTMLText
            },
            showToast: true
        })
            .then((res)=>{

                if(res) {
                    dispatch(updateChannelComment({
                        commentIndex: commentIndex,
                        postId: postUUID,
                        htmlText: commentHTMLText,
                    }))
                }

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
                post_id: postUUID,
                comment_id: commentUUID,
            },
            showToast: true
        })
            .then(() => {
                dispatch(removeChannelComment({postId: postUUID, commentIndex}))
                // dispatch(decrementPostCommentCountByPostID({channelId: rightPanelState.data.channelUUID, postId: rightPanelState.data.postUUID}))
                dispatch(updateChannelMessageReplyDecrement({channelId: channelId, messageId: postUUID, comment:{comment_uuid: commentUUID, comment_text:""}}))


            })

    }



    return (
            <div style={{height: window.innerHeight - 190}} className='overflow-y-auto'>
                <MobileMessage
                    userInfo={mainMessageData.userInfo}
                    createdAt={mainMessageData.createdAt}
                    content={mainMessageData.content}
                    forwardedMessage={forwardedMessageData}
                    getMediaUrl={GetEndpointUrl.GetChannelMedia + '/' + channelId}
                    rawReactions={mainMessageData.reactions}
                    addReaction={createOrUpdateReaction}
                    attachments={mainMessageData.attachments}
                    removeReaction={removeReaction}
                    channelUUID={channelId}
                    postUUID={postUUID}
                    deleteMessage={handleDeletePost}
                    updateMessage={handleUpdatePost}
                    isAdmin={postInfo.data.data.post_channel?.ch_is_admin}
                />
                <ReplyDivider replyCount={mainMessageData.commentCount}/>

                    <MobileMessageCommentList
                        comments={postCommentState}
                        addReaction={createOrUpdateCommentReaction}
                        removeReaction={removeCommentReaction}
                        updateMessage={handleUpdatePostComment}
                        deleteMessage={handleDeletePostComment}
                        getMediaURL={GetEndpointUrl.GetChannelMedia + '/' + channelId}
                        channelUUID={channelId}
                        postUUID={postUUID}
                        isAdmin={postInfo.data.data.post_channel?.ch_is_admin}

                    />

            </div>

    )
}