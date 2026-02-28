"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path, app_chat_path, app_home_path} from "@/types/paths";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {MobileChat} from "@/components/mobileChatMessage/mobileChat";
import {MobileChatMessageTextInput} from "@/components/textInput/mobileChatMessageTextInput";
import {useFetch} from "@/hooks/useFetch";
import {CreateChatPaginationResRaw} from "@/types/chat";
import {updateChats} from "@/store/slice/chatSlice";
import {GetEndpointUrl} from "@/services/endPoints";
import {RootState} from "@/store/store";

export default function ChatLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const {isMobile, isDesktop} = useMedia()
    const router = useRouter();
    const dispatch = useDispatch();

    const chatId = usePathname().split('/')[3]
    const chatMessageId = usePathname().split('/')[4]



    useEffect(() => {

        if (isDesktop ) {
            dispatch(openRightPanel({chatMessageUUID: chatMessageId, chatUUID: chatId, channelUUID: '', postUUID: '', taskUUID: '', groupUUID: '', docUUID:''}))
            router.push(app_chat_path + '/' + chatId + '?messageId=' + chatMessageId);
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