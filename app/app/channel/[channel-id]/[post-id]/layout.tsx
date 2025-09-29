"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path, app_home_path} from "@/types/paths";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";

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
            dispatch(openRightPanel({chatMessageUUID: "", chatUUID: "", channelUUID:channelId, postUUID:postId}))
            router.push(app_channel_path + '/' + channelId);
        }
    }, [isDesktop, router]);

    return (
        <>
            {
                isMobile && <>{children}</>
            }
        </>
    )

}