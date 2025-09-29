"use client";

import {usePathname} from "next/navigation";
import ChannelsPage from "@/app/app/channel/page";
import {MobilePost} from "@/components/mobilePost/mobilePost";
import {MobileChannelTextInput} from "@/components/textInput/mobileChannelTextInput";
import {MobileChannelPostTextInput} from "@/components/textInput/mobileChannelPostTextInput";
import {useFetch} from "@/hooks/useFetch";
import {CreatePostPaginationResRaw} from "@/types/post";
import {GetEndpointUrl} from "@/services/endPoints";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store/store";
import {updateChannelPosts} from "@/store/slice/channelSlice";


function PostMobilePage() {

    const channelId = usePathname().split('/')[3]
    const postId = usePathname().split('/')[4]

    const dispatch = useDispatch();

    const getNewPostsWithCurrentPost = useFetch<CreatePostPaginationResRaw>(postId ? GetEndpointUrl.GetNewPostIncludingCurrentPost + '/' + channelId + '/' + postId: '')

    const channelState = useSelector((state: RootState) => state.channel.channelPosts[channelId] || []);

    const postState = channelState?.find(p => p.post_uuid === postId);


    useEffect(() => {

        if(getNewPostsWithCurrentPost.data?.data.posts && !postState) {
            const newPosts = getNewPostsWithCurrentPost.data?.data?.posts ?? [];
            dispatch(updateChannelPosts({channelId, posts: newPosts}))

        }

    }, [getNewPostsWithCurrentPost.data?.data]);

    return (
        <div className='flex flex-col h-full'>
            <MobilePost postUUID={postId} channelId={channelId}/>
            <div>
                <MobileChannelPostTextInput channelId={channelId} postUUID={postId}/>
            </div>

        </div>
    )
}

export default PostMobilePage;