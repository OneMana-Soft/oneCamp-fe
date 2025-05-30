"use client"

import { useRef, useEffect } from "react"
import MinimalTiptapTextInput from "@/components/textInput/textInput"
import { cn } from "@/lib/utils/cn"
import { SendHorizontal, ChevronRight, ChevronLeft } from "lucide-react"
import { useMedia } from "@/context/MediaQueryContext"
import { Button } from "@/components/ui/button"
import {MobileTextInput} from "@/components/textInput/mobileTextInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {toggleRightPanel} from "@/store/slice/rightPanelSlice";

function Channel() {
    const editorRef = useRef<HTMLDivElement>(null)

    const { isMobile, isDesktop } = useMedia()


    const dispatch = useDispatch()
    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);

    useEffect(() => {
        if (!editorRef.current) return


    }, [])

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1"></div>

            {isMobile && (
                <MobileTextInput/>
            )}

            {isDesktop && (
                <div className='flex flex-col'>
                    <div className="flex-1"></div>
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
            )}
        </div>
    )
}

export default Channel

