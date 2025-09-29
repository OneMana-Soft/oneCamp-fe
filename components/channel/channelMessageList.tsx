"use client"

import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import { CreatePostPaginationResRaw, PostsRes} from "@/types/post";
import {useEffect, useState} from "react";
import {updateChannelPosts, updateChannelScrollToBottom} from "@/store/slice/channelSlice";
import {ChannelMessages} from "@/components/channel/channelMessages";
import {TypingIndicator} from "@/components/typingIndicator/typyingIndicaator";
import {UserProfileInterface} from "@/types/user";

interface ChannelMessageListProps {
    channelId: string;
    postId?: string;
    isAdmin?: boolean;
}

export const ChannelMessageList = ({channelId, postId, isAdmin}: ChannelMessageListProps) => {

    const latestMsg = useFetch<CreatePostPaginationResRaw>(postId ? '' : GetEndpointUrl.GetChannelLatestPost + '/' + channelId)
    const getNewPostsWithCurrentPost = useFetch<CreatePostPaginationResRaw>(postId ? GetEndpointUrl.GetNewPostIncludingCurrentPost + '/' + channelId + '/' + postId: '')

    const channelTypingState = useSelector((state: RootState) => state.typing.channelTyping[channelId] || []).map(item => item.user);

    const channelPostState = useSelector((state: RootState) => state.channel.channelPosts[channelId] || [] as PostsRes[]);

    const [hasMoreOldPost, setHasMoreOldPost] = useState(true)
    const [oldChannelPostTime, setOldChannelPostTime] = useState(0)
    const oldMsg = useFetch<CreatePostPaginationResRaw>(oldChannelPostTime == 0 ? '' : GetEndpointUrl.GetOldPostBefore + '/' + channelId + '/' + oldChannelPostTime)

    const [hasMoreNewPost, setHasMoreNewPost] = useState(true)
    const [newChannelPostsTime, setNewChannelPostsTime] = useState(0)
    const newMsg = useFetch<CreatePostPaginationResRaw>(newChannelPostsTime == 0 ? '' : GetEndpointUrl.GetNewPostAfter + '/' + channelId + '/' + newChannelPostsTime)



    const dispatch = useDispatch();


    useEffect(() => {

        if(postId && getNewPostsWithCurrentPost.data?.data?.posts) {
            const newPosts = getNewPostsWithCurrentPost.data?.data?.posts ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))
        }

        if(!postId && latestMsg.data?.data.posts && channelPostState.length == 0 ) {
            const newPosts = latestMsg.data?.data.posts.reverse() ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))
            latestMsg.data?.data.posts.reverse()
        }

    }, [getNewPostsWithCurrentPost, latestMsg]);

    useEffect(() => {

        if(channelPostState && oldMsg.data?.data && oldChannelPostTime != 0) {
            setHasMoreOldPost(oldMsg.data.data.has_more)
            setOldChannelPostTime(0)
            if(oldMsg.data?.data.posts && oldMsg.data?.data.posts.length !== 0) {
                const posts = oldMsg.data.data.posts.reverse().concat(channelPostState)
                dispatch(updateChannelPosts({channelId: channelId, posts: posts}))
                oldMsg.data.data.posts.reverse()
            }
        }

    }, [ oldMsg.data?.data]);

    useEffect(() => {

        if(channelPostState && newMsg.data?.data && newChannelPostsTime != 0) {
            setHasMoreNewPost(newMsg.data.data.has_more)
            setNewChannelPostsTime(0)
            if(newMsg.data?.data.posts && newMsg.data?.data.posts.length !== 0) {
                const posts = channelPostState.concat(newMsg.data.data.posts)
                dispatch(updateChannelPosts({channelId: channelId, posts: posts}))
            }
        }

    }, [ newMsg.data?.data]);

    const handleClickedScrollToBottom = () => {

        if(channelPostState[channelPostState.length -1].post_uuid != latestMsg.data?.data.posts?.[0]?.post_uuid) {
            const newPosts = latestMsg.data?.data.posts.reverse() ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))
            latestMsg.data?.data.posts.reverse()
        }

        dispatch(updateChannelScrollToBottom({channelId, scrollToBottom: true}))

    }

    const getOldMessages = () => {
        const lastTimeString = channelPostState[0].post_created_at

        const epochTime = Math.floor(Date.parse(lastTimeString) / 1000);
        setOldChannelPostTime(epochTime)
        setHasMoreOldPost(false)
    }

    const getNewMessages = () => {

        const lastTimeString = channelPostState[channelPostState.length -1].post_created_at
        const epochTime = Math.ceil(Date.parse(lastTimeString) / 1000);
        setNewChannelPostsTime(epochTime)
        setHasMoreNewPost(false)
    }


    return (
        <div className='flex flex-col h-full space-y-2 '>
            <ChannelMessages
                posts={channelPostState || []}
                channelId={channelId} isAdmin={isAdmin}
                getNewMessages={getNewMessages}
                getOldMessages={getOldMessages}
                hasMoreNewMsg={hasMoreNewPost}
                hasMoreOldMsg={hasMoreOldPost}
                isNewMsgLoading={newMsg.isLoading}
                isOLdMsgLoading={oldMsg.isLoading}
                clickedScrollToBottom={handleClickedScrollToBottom}
            />

            <TypingIndicator users={channelTypingState}/>

        </div>
    )

}