"use client";


import {useMedia} from "@/context/MediaQueryContext";


function ChatPage() {


    const { isDesktop } = useMedia();


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

        </>
    )
}

export default ChatPage;