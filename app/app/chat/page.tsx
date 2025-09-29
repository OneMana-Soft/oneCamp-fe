"use client";


import {useMedia} from "@/context/MediaQueryContext";
import {ChatUserList} from "@/components/chat/chatUserList";


function ChatPage() {


    const { isDesktop, isMobile } = useMedia();


    return (
        <>
            {
                isDesktop &&

                <div className="flex justify-center items-center h-screen">
                    <div className="text-muted-foreground text-lg text-center">
                        Select a conversation
                    </div>
                </div>
            }

            {
                isMobile &&
                <ChatUserList chatId={''}/>

            }

        </>
    )
}

export default ChatPage;