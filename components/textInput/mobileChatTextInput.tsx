"use client"

import MinimalTiptapTextInput from "@/components/textInput/textInput";
import { cn } from "@/lib/utils/cn";
import { SendHorizontal } from "lucide-react";
import DraggableDrawer from "@/components/drawers/dragableDrawer";
import { useEffect, useRef, useState } from "react";
import { ChannelFileUpload } from "@/components/fileUpload/channelFileUpload";
import {openChannelFileUpload, openChatFileUpload} from "@/store/slice/fileUploadSlice";
import {useDispatch, useSelector} from "react-redux";
import {

    updateChannelInputText
} from "@/store/slice/channelSlice";
import {createOrUpdateChatBody} from "@/store/slice/chatSlice";
import {ChatFileUpload} from "@/components/fileUpload/chatFileUpload";
import {RootState} from "@/store/store";


export const MobileChatTextInput = ({ chatId, handleSend }: { chatId: string, handleSend: ()=>void }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // New ref for the entire content
    const [isExpanded, setIsExpanded] = useState(false);
    const [initialHeight, setInitialHeight] = useState(126); // Default height
    const dispatch = useDispatch();



    const chatInputState = useSelector((state: RootState) => state.chat.chatInputState[chatId] || {});

    useEffect(() => {
        if (!contentRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Update initialHeight based on the entire content height
                setInitialHeight(Math.max(entry.contentRect.height, 30) + 70);
            }
        });

        resizeObserver.observe(contentRef.current);

        return () => resizeObserver.disconnect();
    }, []);



    return (
        <DraggableDrawer isExpanded={isExpanded} setIsExpanded={setIsExpanded} initialHeight={initialHeight}>
            <div ref={contentRef}> {/* Wrap all content in a ref */}
                <div ref={editorRef}>
                    <MinimalTiptapTextInput
                        attachmentOnclick={() => { dispatch(openChatFileUpload()) }}
                        throttleDelay={300}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={chatInputState.chatBody}
                        placeholder={"message"}
                        editable={true}
                        buttonOnclick={handleSend}
                        ButtonIcon={SendHorizontal}
                        editorClassName="focus:outline-none px-5"
                        onChange={(content ) => {

                            dispatch(createOrUpdateChatBody({chatUUID: chatId, body: content?.toString()||'' }))
                        }}
                        fixedToolbarToBottom={true}
                    >



                    </MinimalTiptapTextInput>
                    <div className='pb-6'>
                        <ChatFileUpload chatUUID={chatId}/>

                    </div>
                </div>
            </div>
        </DraggableDrawer>
    );
};