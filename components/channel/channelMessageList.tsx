"use client"

import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import { CreatePostPaginationResRaw, PostsRes} from "@/types/post";
import {useEffect} from "react";
import {updateChannelPosts} from "@/store/slice/channelSlice";
import {ChannelMessages} from "@/components/channel/channelMessages";

interface ChannelMessageListProps {
    channelId: string;
    postId?: string;
}

export const ChannelMessageList = ({channelId, postId}: ChannelMessageListProps) => {

    const latestMsg = useFetch<CreatePostPaginationResRaw>(postId ? '' : GetEndpointUrl.GetChannelLatestPost + '/' + channelId)
    const getNewPostsWithCurrentPost = useFetch<CreatePostPaginationResRaw>(postId ? GetEndpointUrl.GetNewPostIncludingCurrentPost + '/' + channelId + '/' + postId: '')

    const channelPostState = useSelector((state: RootState) => state.channel.channelPosts[channelId] || [] as PostsRes[]);

    const dispatch = useDispatch();


    useEffect(() => {

        if(postId && getNewPostsWithCurrentPost.data?.data?.posts) {
            const newPosts = getNewPostsWithCurrentPost.data?.data?.posts ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))
        }

        if(!postId && latestMsg.data?.data.posts && channelPostState.length == 0 ) {
            const newPosts = latestMsg.data?.data.posts ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))
        }

    }, [getNewPostsWithCurrentPost, latestMsg]);



    return (
        <div className='flex flex-col h-full space-y-2 '>
            <ChannelMessages posts={channelPostState}/>
        </div>
    )

}