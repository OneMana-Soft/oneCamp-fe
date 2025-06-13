import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {openChannelFileUpload} from "@/store/slice/fileUploadSlice";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import type { Content } from "@tiptap/react";
import {SendHorizontal} from "lucide-react";
import {updateChannelInputText} from "@/store/slice/channelSlice";
import {ChannelFileUpload} from "@/components/fileUpload/channelFileUpload";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {ChatFileUpload} from "@/components/fileUpload/chatFileUpload";
import {FwdMsgToDropdown} from "@/components/searchDropdown/fwdMsgToDropdown/fwdMsgToDropdown";


interface FileDialogProps {
    chatUUID?: string;
    channelUUID?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ForwardMessage = ({ chatUUID, channelUUID, open, onOpenChange }: FileDialogProps) => {
    const [message, setMessage] = useState<Content>({ type: "doc", content: [] });

    if(!chatUUID && !channelUUID) {
        console.log("ASdfasdfsdf YYYY")
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
            <DialogContent className="max-w-[95vw] md:max-w-[35vw]">
                <DialogHeader>
                    <DialogTitle>Forward this message</DialogTitle>
                    <DialogDescription >
                    </DialogDescription>
                </DialogHeader>

                <FwdMsgToDropdown/>
                <MinimalTiptapTextInput
                    throttleDelay={300}
                    attachmentOnclick = {()=>{}}
                    className={cn("max-w-full rounded-xl h-auto border bg-secondary/20")}
                    editorContentClassName="overflow-auto"
                    output="html"
                    placeholder={"Add a message, if you'd like..."}
                    editable={true}
                    editorClassName="focus:outline-none px-5 py-4"
                    value={message}
                    onChange={setMessage}
                >
                    {
                        channelUUID ?
                            <ChannelFileUpload channelId={channelUUID}/>
                            :
                            chatUUID && <ChatFileUpload chatUUID={chatUUID}/>
                    }

                </MinimalTiptapTextInput>
            </DialogContent>
        </Dialog>
    );
};
