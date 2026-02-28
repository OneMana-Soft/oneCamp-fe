"use client"

import { useFetch } from "@/hooks/useFetch"
import { GetEndpointUrl } from "@/services/endPoints"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { CreatePostPaginationResRaw, PostsRes } from "@/types/post"
import { useEffect } from "react"
import { updateChannelPosts } from "@/store/slice/channelSlice"
import { EnhancedChannelMessages } from "@/components/channel/enhancedChannelMessages"

interface EnhancedChannelMessageListProps {
    channelId: string
    postId?: string
}

export const EnhancedChannelMessageList = ({ channelId, postId }: EnhancedChannelMessageListProps) => {
    const latestMsg = useFetch<CreatePostPaginationResRaw>(
        postId ? "" : GetEndpointUrl.GetChannelLatestPost + "/" + channelId,
    )
    const getNewPostsWithCurrentPost = useFetch<CreatePostPaginationResRaw>(
        postId ? GetEndpointUrl.GetNewPostIncludingCurrentPost + "/" + channelId + "/" + postId : "",
    )

    const channelPostState = useSelector(
        (state: RootState) => state.channel.channelPosts[channelId] || ([] as PostsRes[]),
    )

    const dispatch = useDispatch()

    useEffect(() => {
        if (postId && getNewPostsWithCurrentPost.data?.data?.posts) {
            const newPosts = getNewPostsWithCurrentPost.data?.data?.posts ?? []
            dispatch(updateChannelPosts({ channelId, posts: newPosts }))
        }

        if (!postId && latestMsg.data?.data?.posts && channelPostState.length === 0) {
            const newPosts = latestMsg.data?.data?.posts ?? []
            dispatch(updateChannelPosts({ channelId, posts: newPosts }))
        }
    }, [getNewPostsWithCurrentPost, latestMsg, channelId, postId, channelPostState.length, dispatch])

    return (
        <div className="flex flex-col h-full">
            <EnhancedChannelMessages posts={channelPostState} channelId={channelId} />
        </div>
    )
}
