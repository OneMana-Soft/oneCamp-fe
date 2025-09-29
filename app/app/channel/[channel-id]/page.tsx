"use client";

import { useRef, useEffect } from "react";
import { useMedia } from "@/context/MediaQueryContext";
import { MobileTextInput } from "@/components/textInput/mobileTextInput";
import { ChannelIdDesktop } from "@/components/channel/chanelIdDesktop";
import {usePathname} from "next/navigation";
import {ChannelIdMobile} from "@/components/channel/channelIdMobile";
import {CreateOrUpdatePostsReq, CreatePostPaginationResRaw, CreatePostsRes, PostsRes} from "@/types/post";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import {clearChannelInputState, createPostLocally, updateChannelScrollToBottom} from "@/store/slice/channelSlice";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useFetch, useFetchOnlyOnce} from "@/hooks/useFetch";
import {ChannelInfoInterfaceResp} from "@/types/channel";
import {addUserChannelList} from "@/store/slice/userSlice";
import {removeEmptyPTags} from "@/lib/utils/removeEmptyPTags";


function Channel() {


    const channelId = usePathname().split('/')[3]

    const post = usePost()

    const channelPostState = useSelector((state: RootState) => state.channel.channelPosts[channelId] || [] as PostsRes[]);

    const channelState = useSelector((state: RootState) => state.channel.channelInputState[channelId] || {});

    const dispatch = useDispatch();

    const channelInfo  = useFetch<ChannelInfoInterfaceResp>(`${GetEndpointUrl.ChannelBasicInfo}/${channelId}`)

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const latestMsg = useFetch<CreatePostPaginationResRaw>( GetEndpointUrl.GetChannelLatestPost + '/' + channelId)


    useEffect(() => {

        if(channelInfo.data?.channel_info) {
            dispatch(addUserChannelList({channelUser: channelInfo.data?.channel_info}))
        }


    }, [channelInfo.data?.channel_info]);


    const handleSend = () => {

        const body = removeEmptyPTags(channelState.inputTextHTML)

        if(body.length==0) return


        post.makeRequest<CreateOrUpdatePostsReq, CreatePostsRes>({
            apiEndpoint: PostEndpointUrl.CreateChannelPost,
            payload: {
                post_attachments: channelState.filesUploaded,
                channel_id: channelId,
                post_text_html: body
            }
        })
            .then((res)=>{

                if (
                    res &&
                    (latestMsg?.data?.data?.posts?.[0]?.post_uuid &&
                    channelPostState?.length > 0 &&
                    channelPostState[channelPostState.length - 1]?.post_uuid &&
                    latestMsg.data.data.posts[0].post_uuid === channelPostState[channelPostState.length - 1].post_uuid)
                    ||
                    (channelPostState?.length == 0)
                ) {
                    dispatch(createPostLocally({
                        channelId,
                        postCreatedAt:res?.post_created_at || '',
                        postBy: selfProfile.data?.data || {} as UserProfileDataInterface,
                        postText: body,
                        attachments: channelState.filesUploaded,
                        postUUID: res?.post_id || '',
                    }))

                    latestMsg.mutate()
                    if(channelPostState.length > 2) {
                        dispatch(updateChannelScrollToBottom({channelId, scrollToBottom: true}))
                    }


                }

            })
        dispatch(clearChannelInputState({channelId}))
    }




    const { isMobile, isDesktop } = useMedia();

    return (
        <>

            {isMobile && <ChannelIdMobile channelId={channelId} handleSend={handleSend}/>}

            {isDesktop && <ChannelIdDesktop channelId={channelId} handleSend={handleSend}/>}
        </>
    );
}

export default Channel;
