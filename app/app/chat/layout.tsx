"use client"

import {useMedia} from "@/context/MediaQueryContext";
import {Button} from "@/components/ui/button";
import {openCreateChatMessageDialog} from "@/store/slice/dialogSlice";
import {Plus} from "lucide-react";
import {useDispatch} from "react-redux";

export default function ChatLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    const {isMobile, isDesktop} = useMedia()
    const dispatch = useDispatch();

    return (
        <>
            {
                isMobile && <>{children}</>
            }

            {
                isDesktop && <div className='flex  h-full'>
                    <div className='w-[20vw] h-full flex flex-col border-r '>
                        <div className=' text-lg flex justify-between p-4 border-b text-center'>
                            <div className='text-center flex justify-between items-center'>
                                Messages
                            </div>
                            <Button size='icon' variant='ghost' onClick={() => (dispatch(openCreateChatMessageDialog()))}>
                                <Plus/>
                            </Button>
                        </div>
                        <div>
                            pojpo
                        </div>
                    </div>
                    <div className=' w-[75vw]'>

                        {children}
                    </div>
                </div>
            }


        </>
    )
}