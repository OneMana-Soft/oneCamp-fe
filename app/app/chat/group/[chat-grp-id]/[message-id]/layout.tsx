"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {useEffect} from "react";
import {app_channel_path, app_chat_path, app_grp_chat_path, app_home_path} from "@/types/paths";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {MobileGroupChat} from "@/components/mobileChatMessage/mobileGroupChat";
import {MobileGroupChatMessageTextInput} from "@/components/textInput/mobileGroupChatMessageTextInput";
import {updateGroupChats} from "@/store/slice/groupChatSlice";
import {RootState} from "@/store/store";
import {CreateChatPaginationResRaw} from "@/types/chat";
import {useFetch} from "@/hooks/useFetch";
import {GetEndpointUrl} from "@/services/endPoints";

export default function ChatLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const {isMobile, isDesktop} = useMedia()
    const router = useRouter();
    const dispatch = useDispatch();

    const params = useParams()

    const chatId = params?.["chat-grp-id"] as string
    const chatMessageId = params?.["message-id"] as string

    useEffect(() => {

        if (isDesktop ) {
            dispatch(openRightPanel({chatMessageUUID: chatMessageId, chatUUID: "", channelUUID: '', postUUID: '', taskUUID: '', groupUUID: chatId, docUUID:''}))
            router.push(app_grp_chat_path + '/' + chatId + '?messageId=' + chatMessageId);
        }

    }, [ isDesktop]);


    return (
        <>
            {
                isMobile && <>{children}</>
            }
        </>
    )

}