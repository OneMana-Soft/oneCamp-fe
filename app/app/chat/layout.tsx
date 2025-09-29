"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {Button} from "@/components/ui/button";
import {openCreateChatMessageDialog} from "@/store/slice/dialogSlice";
import {Plus} from "lucide-react";
import {useDispatch} from "react-redux";
import {ChatUserList} from "@/components/chat/chatUserList";
import {usePathname} from "next/navigation";

export default function ChatLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    const {isMobile, isDesktop} = useMedia()
    const dispatch = useDispatch();

    const chatId = usePathname().split('/')[3]


    return (
        <>
            {
                isMobile && <>{children}</>
            }

            {
                isDesktop && <div className='flex  h-full'>
                    <div className='w-[26vw] h-full flex flex-col border-r '>
                        <div className=' text-lg flex justify-between p-4 pb-2 pt-2  text-center'>
                            <div className='text-center flex justify-between items-center'>
                                Messages
                            </div>
                            <Button size='icon' variant='ghost' onClick={() => (dispatch(openCreateChatMessageDialog()))}>
                                <Plus/>
                            </Button>
                        </div>
                        <div>
                            <ChatUserList chatId={chatId}/>
                        </div>
                    </div>
                    <div className=' w-full'>

                        {children}
                    </div>
                </div>
            }


        </>
    )
}