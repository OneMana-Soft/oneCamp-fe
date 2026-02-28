"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path, app_chat_path, app_doc_path, app_home_path} from "@/types/paths";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";

export default function DocCommentLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const params = useParams();

    const {isMobile, isDesktop} = useMedia()
    const router = useRouter();
    const dispatch = useDispatch();

    const docId = params?.['doc-id'] as string;


    useEffect(() => {
        if (isDesktop) {
            dispatch(openRightPanel({chatMessageUUID: '', chatUUID: '', channelUUID: '', postUUID: '', taskUUID: '', groupUUID: '', docUUID: docId}))
            router.push(app_doc_path + '/' + docId);
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