"use client"

// src/components/channel/ChannelMessages.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import { groupByDate } from "@/lib/utils/groupByDate"
import { getGroupDateHeading } from "@/lib/utils/getMessageGroupDate"
import type { CreateOrUpdatePostsReq, CreatePostsRes, PostsRes } from "@/types/post"
import { ChannelMessage } from "@/components/channel/chanelMessage"
import type { FlatItem } from "@/types/virtual"
import { useMedia } from "@/context/MediaQueryContext"
import { ChannelMessageMobile } from "@/components/channel/channelMessageMobile"
import TouchableDiv from "@/components/animation/touchRippleAnimation"
import { usePost } from "@/hooks/usePost"
import type { CreateOrUpdatePostReaction } from "@/types/reaction"
import { GetEndpointUrl, PostEndpointUrl } from "@/services/endPoints"
import {
    createPostReactionPostId,
    removePostByPostId,
    removePostReactionByPostId,
    updateChannelScrollToBottom,
    updatePostByPostId,
    updatePostReactionPostId,
} from "@/store/slice/channelSlice"
import { useDispatch, useSelector } from "react-redux"
import { useFetchOnlyOnce } from "@/hooks/useFetch"
import type { UserProfileInterface } from "@/types/user"
import { openConfirmAlertMessageDialog } from "@/store/slice/dialogSlice"
import { MessageListVirtua } from "@/components/message/MessaageListVirtua"
import type { VListHandle } from "virtua"
import type { RootState } from "@/store/store"

interface ChannelMessagesProps {
    posts: PostsRes[]
    channelId: string
    isAdmin?: boolean
    getOldMessages: () => void
    hasMoreOldMsg: boolean
    getNewMessages: () => void
    hasMoreNewMsg: boolean
    isNewMsgLoading: boolean
    isOLdMsgLoading: boolean
    clickedScrollToBottom: () => void;

}

export const ChannelMessages = ({
                                    posts,
                                    channelId,
                                    isAdmin,
                                    hasMoreNewMsg,
                                    getNewMessages,
                                    hasMoreOldMsg,
                                    getOldMessages,
                                    clickedScrollToBottom,
                                    isNewMsgLoading,
                                    isOLdMsgLoading,
                                }: ChannelMessagesProps) => {
    const { isMobile } = useMedia()

    const [virtualShift, setVirtualShift] = useState(false)

    const post = usePost()

    const dispatch = useDispatch()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const channelScrollToBottom = useSelector((state: RootState) => state.channel.channelScrollToBottom[channelId] || {})

    const createOrUpdateReaction = (postId: string, emojiId: string, reactionId: string) => {
        if (!postId) return

        post
            .makeRequest<CreateOrUpdatePostReaction, CreateOrUpdatePostReaction>({
                apiEndpoint: PostEndpointUrl.CreateOrUpdatePostReaction,
                payload: {
                    post_id: postId,
                    reaction_emoji_id: emojiId,
                    reaction_dgraph_id: reactionId,
                },
            })
            .then((res) => {
                if (reactionId) {
                    dispatch(updatePostReactionPostId({ channelId, reactionId, emojiId, postId }))
                } else if (res?.reaction_dgraph_id && selfProfile.data?.data) {
                    dispatch(
                        createPostReactionPostId({
                            postId,
                            channelId,
                            reactionId: res?.reaction_dgraph_id,
                            emojiId,
                            addedBy: selfProfile.data?.data,
                        }),
                    )
                }
            })
    }

    const removeReaction = (postId: string, reactionId: string) => {
        post
            .makeRequest<CreateOrUpdatePostReaction>({
                apiEndpoint: PostEndpointUrl.RemovePostReaction,
                payload: {
                    post_id: postId,
                    reaction_dgraph_id: reactionId,
                },
            })
            .then(() => {
                dispatch(removePostReactionByPostId({ channelId: channelId, reactionId, postId }))
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

    const handleUpdatePost = (postHTMLText: string, postId: string) => {
        post
            .makeRequest<CreateOrUpdatePostsReq, CreatePostsRes>({
                apiEndpoint: PostEndpointUrl.UpdateChannelPost,
                payload: {
                    post_id: postId,
                    post_text_html: postHTMLText,
                },
                showToast: true,
            })
            .then((res) => {
                if (res) {
                    dispatch(
                        updatePostByPostId({
                            postId: postId,
                            channelId: channelId,
                            htmlText: postHTMLText,
                        }),
                    )
                }
            })
    }

    const handleDeletePost = (postId: string) => {
        if (!postId) return


        setTimeout(() => {
            dispatch(
                openConfirmAlertMessageDialog({
                    title: "Deleting post",
                    description: "Are you sure you want to proceed deleting the post",
                    confirmText: "Delete post",
                    onConfirm: () => {
                        setTimeout(() => {executeDeletePost(postId)},100)
                    },
                }),
            )
        }, 500)
    }

    const groupedPosts = useMemo(() => {
        try {
            return groupByDate(posts, (post) => post.post_created_at)
        } catch (error) {
            console.error("Error grouping posts:", error)
            return {}
        }
    }, [posts])

    const flatItems = useMemo(() => {
        const items: Array<FlatItem<PostsRes>> = []
        Object.keys(groupedPosts).forEach((date) => {
            items.push({ type: "separator", date, key: "separator" + date })
            groupedPosts[date].forEach((post) => items.push({ type: "item", data: post, key: post.post_uuid }))
        })

        return items
    }, [groupedPosts])

    const renderItem = (post: PostsRes) => (
        <div>
            {isMobile ? (
                <TouchableDiv rippleBrightness={0.8} rippleDuration={800}>
                    <ChannelMessageMobile
                        postInfo={post}
                        isAdmin={isAdmin}
                        channelId={channelId}
                        removePost={() => {
                            handleDeletePost(post.post_uuid)
                        }}
                        addReaction={(emojiId: string, reactionId: string) => {
                            createOrUpdateReaction(post.post_uuid, emojiId, reactionId)
                        }}
                        removeReaction={(reactionId: string) => {
                            removeReaction(post.post_uuid, reactionId)
                        }}
                        updatePost={(body: string) => {
                            handleUpdatePost(body, post.post_uuid)
                        }}
                    />
                </TouchableDiv>
            ) : (
                <ChannelMessage
                    postInfo={post}
                    isAdmin={isAdmin}
                    addReaction={(emojiId: string, reactionId: string) => {
                        createOrUpdateReaction(post.post_uuid, emojiId, reactionId)
                    }}
                    removeReaction={(reactionId: string) => {
                        removeReaction(post.post_uuid, reactionId)
                    }}
                    removePost={() => {
                        handleDeletePost(post.post_uuid)
                    }}
                    updatePost={(body: string) => {
                        handleUpdatePost(body, post.post_uuid)
                    }}
                />
            )}
        </div>
    )

    const containerRef = useRef<VListHandle>(null)

    useEffect(() => {

        if (channelScrollToBottom.shouldScrollToBottom && containerRef.current) {
            setVirtualShift(true)

            dispatch(updateChannelScrollToBottom({ channelId, scrollToBottom: false }))

            containerRef.current.scrollToIndex(flatItems.length - 1, {
                smooth: true,
            })

            setTimeout(() => {
                setVirtualShift(false)
            }, 1000)
        }
    }, [channelScrollToBottom.shouldScrollToBottom, flatItems.length])
    
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
            clickedScrollToBottom={clickedScrollToBottom}
        />
    )
}

ChannelMessages.displayName = "ChannelMessages"
