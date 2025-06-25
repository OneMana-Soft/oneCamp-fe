"use client"

import MinimalTiptapTextInput from "@/components/textInput/textInput";
import { cn } from "@/lib/utils/cn";
import { SendHorizontal } from "lucide-react";
import DraggableDrawer from "@/components/drawers/dragableDrawer";
import { useEffect, useRef, useState } from "react";
import { ChannelFileUpload } from "@/components/fileUpload/channelFileUpload";
import { openChannelFileUpload } from "@/store/slice/fileUploadSlice";
import { useDispatch } from "react-redux";

export const MobileChannelTextInput = ({ channelId }: { channelId: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // New ref for the entire content
    const [isExpanded, setIsExpanded] = useState(false);
    const [initialHeight, setInitialHeight] = useState(130 + 90); // Default height
    const dispatch = useDispatch();

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
                        attachmentOnclick={() => { dispatch(openChannelFileUpload()) }}
                        throttleDelay={300}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={""}
                        placeholder={"message"}
                        editable={true}
                        ButtonIcon={SendHorizontal}
                        buttonOnclick={() => {}}
                        editorClassName="focus:outline-none px-5 py-4"
                        onChange={() => {}}
                    >

                    </MinimalTiptapTextInput>
                    <div className='pb-6'>
                        <ChannelFileUpload channelId={channelId} />

                    </div>
                </div>
            </div>
        </DraggableDrawer>
    );
};