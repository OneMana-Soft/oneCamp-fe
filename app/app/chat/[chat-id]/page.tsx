"use client";


import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {cn} from "@/lib/utils/cn";
import {ChevronLeft, ChevronRight, SendHorizontal} from "lucide-react";
import {useMedia} from "@/context/MediaQueryContext";
import {useEffect, useRef, useState} from "react";
import {MobileTextInput} from "@/components/textInput/mobileTextInput";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {toggleRightPanel} from "@/store/slice/rightPanelSlice";

function ChatIdPage() {
    const { isMobile, isDesktop } = useMedia()

    const dispatch = useDispatch()
    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);

    const editorRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (!editorRef.current) return

    }, [])


    return (
        <div className="flex flex-col h-full">
            <div className="flex-1"></div>
            {
                isDesktop &&

                <div className='flex flex-col'>
                    <div className="flex-1 flex"></div>
                    <div className="sticky bottom-0 left-0 right-0 z-50 border-t p-4 ">
                        <div>
                            <MinimalTiptapTextInput
                                throttleDelay={300}
                                className={cn("max-w-full rounded-xl h-auto border-none")}
                                editorContentClassName="overflow-auto mb-2"
                                output="html"
                                content={""}
                                placeholder={"message"}
                                editable={true}
                                ButtonIcon={SendHorizontal}
                                buttonOnclick={() => {
                                }}
                                editorClassName="focus:outline-none px-5 py-4"
                                onChange={() => {
                                }}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={() => dispatch(toggleRightPanel())}
                        className=""
                    >
                        {rightPanelState.isOpen ? <ChevronRight/> : <ChevronLeft/>}
                    </Button>
                </div>
            }

            {isMobile && (

                <MobileTextInput/>
            )}

        </div>


    );
}

export default ChatIdPage;