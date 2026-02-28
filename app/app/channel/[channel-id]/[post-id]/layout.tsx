"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path} from "@/types/paths";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {useFetch} from "@/hooks/useFetch";
import {CreatePostPaginationResRaw} from "@/types/post";
import {GetEndpointUrl} from "@/services/endPoints";
import {updateChannelPosts} from "@/store/slice/channelSlice";
import type {RootState} from "@/store/store";

export default function PostLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const {isMobile, isDesktop} = useMedia()
    const router = useRouter();
    const dispatch = useDispatch();

    const channelId = usePathname().split('/')[3]
    const postId = usePathname().split('/')[4]


    useEffect(() => {


        if (isDesktop) {
            dispatch(openRightPanel({taskUUID: "", chatMessageUUID: "", chatUUID: "", channelUUID:channelId, postUUID:postId, groupUUID: "", docUUID:""}))
            router.push(app_channel_path + '/' + channelId + '?postId=' + postId);
        }

    }, [isDesktop]);

    return (
        <>
            {
                isMobile && <>{children}</>
            }
        </>
    )

}