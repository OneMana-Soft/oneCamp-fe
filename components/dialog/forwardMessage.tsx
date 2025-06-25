import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils/cn";

import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {ForwardMessageDropdown} from "@/components/searchDropdown/fwdMsgToDropdown/fwdMsgToDropdown";
import {useFetch} from "@/hooks/useFetch";
import {ChatInfoRes} from "@/types/chat";
import {GetEndpointUrl, PostEndpointUrl} from "@/services/endPoints";
import { PostsResRaw} from "@/types/post";
import {MessagePreview} from "@/components/message/MessagePreview";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {ChannelAndUserListInterfaceResp, MessageFwdReq} from "@/types/user";
import {usePost} from "@/hooks/usePost";
import {FwdToChatAndChannelFileUpload} from "@/components/fileUpload/fwdToChatAndChannelFileUpload";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {clearFwdMsgInputState, createOrUpdateFwdMsg} from "@/store/slice/fwdMessageSlice";
import {LoaderCircle} from "lucide-react";
import * as React from "react";
import {openChannelFileUpload, openFwdMsgFileUpload} from "@/store/slice/fileUploadSlice";


interface FileDialogProps {
    chatUUID?: string;
    channelUUID?: string;
    postUUID?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ForwardMessage = ({ chatUUID, channelUUID, postUUID, open, onOpenChange }: FileDialogProps) => {

    const chatInfo = useFetch<ChatInfoRes>(chatUUID ? `${GetEndpointUrl.GetOnlyChatText}/${chatUUID}`: "")
    const postInfo = useFetch<PostsResRaw>(channelUUID ? `${GetEndpointUrl.GetOnlyPostText}/${channelUUID}/${postUUID}` : "")

    const [selectedUsersOrChannels, setSelectedUsersOrChannels] = useState<ChannelAndUserListInterfaceResp[]>([])

    const [selectedChannelUUIDs, setSelectedChannelUUIDs] = useState<string[]>([])
    const [selectedChatUUIDs, setSelectedChatUIDs] = useState<string[]>([])

    const fwdMsgInputState = useSelector((state: RootState) => state.fwdMsg.fwdMsgInputInputState);

    const dispatch = useDispatch();

    const { makeRequest, isSubmitting } = usePost();


    if(!chatUUID && !channelUUID) {
        return null;
    }

    const selectChatsOrChannels = (input:ChannelAndUserListInterfaceResp[]) => {
        setSelectedUsersOrChannels(input);
        const chatUUIDs: string[] = []
        const channelUUIDs: string[] = []


        input.forEach((value)=> {
            console.log("pppppp", value)
            if(value.type == 'channel') {
                channelUUIDs.push(value.channel_uuid)
            }

            if(value.type == 'chat') {
                chatUUIDs.push(value.user_uuid)
            }
        })

        setSelectedChannelUUIDs(channelUUIDs)
        setSelectedChatUIDs(chatUUIDs)

    }

    const clickFwdMessage = () => {
        makeRequest<MessageFwdReq>({
            apiEndpoint: PostEndpointUrl.FwdMsgToChatOrChannel,
            payload: {
                fwd_list: selectedUsersOrChannels,
                fwd_attachments: fwdMsgInputState.filesUploaded,
                fwd_channel_uuid: channelUUID||'',
                fwd_post_uuid: postUUID||'',
                fwd_chat_uuid: chatUUID||'',
                fwd_text: fwdMsgInputState.fwdMsgBody
            }
        }).then(()=>{
            dispatch(clearFwdMsgInputState())
        })

    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}  modal={false}>
            <DialogContent className="max-w-[95vw] md:max-w-[35vw] space-y-2.5">
                <DialogHeader>
                    <DialogTitle>Forward this message</DialogTitle>
                    <DialogDescription >
                    </DialogDescription>
                </DialogHeader>


                <ForwardMessageDropdown onSelect={selectChatsOrChannels}/>
                <MinimalTiptapTextInput
                    throttleDelay={300}
                    attachmentOnclick = {()=>{
                        console.log("sdfasdfsdf ", selectedChannelUUIDs, selectedChatUUIDs)

                        if(selectedChannelUUIDs.length == 0 &&  selectedChatUUIDs.length == 0) {

                            return

                        }
                        dispatch(openFwdMsgFileUpload())}
                    }
                    className={cn("max-w-full rounded-xl h-auto border bg-secondary/20")}
                    editorContentClassName="overflow-auto"
                    output="html"
                    placeholder={"Add a message, if you'd like..."}
                    editable={true}
                    editorClassName="focus:outline-none px-5 py-4"
                    onChange={(content ) => {
                        const t = content as string
                        dispatch(createOrUpdateFwdMsg({body: t}))

                    }}
                >
                    {
                        (selectedChannelUUIDs  && selectedChatUUIDs) &&
                            <FwdToChatAndChannelFileUpload channelUUIDs={selectedChannelUUIDs} chatUUIDs={selectedChatUUIDs}/>

                    }

                </MinimalTiptapTextInput>
                <MessagePreview
                    msgBy={postInfo.data?.data.post_by || chatInfo.data?.data.chat_from }
                    msgText={postInfo.data?.data.post_text || chatInfo.data?.data.chat_body_text}
                    msgChannelName={postInfo.data?.data.post_channel?.ch_name}
                    msgChannelUUID={postInfo.data?.data.post_channel?.ch_uuid}
                    msgUUID={postInfo.data?.data.post_uuid || chatInfo.data?.data.chat_uuid}
                    msgCreatedAt={postInfo.data?.data.post_created_at || chatInfo.data?.data.chat_created_at}

                />

                <DialogFooter>
                    <Button onClick={clickFwdMessage}
                    disabled={isSubmitting || selectedUsersOrChannels.length == 0}
                    >
                        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}
                        Forward
                    </Button>
                </DialogFooter>
            </DialogContent>


        </Dialog>
    );
};
