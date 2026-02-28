import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils/helpers/cn";

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
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {clearFwdMsgInputState, createOrUpdateFwdMsg} from "@/store/slice/fwdMessageSlice";
import {LoaderCircle} from "lucide-react";
import * as React from "react";


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


    const fwdMsgInputState = useSelector((state: RootState) => state.fwdMsg.fwdMsgInputInputState);

    const dispatch = useDispatch();

    const { makeRequest, isSubmitting } = usePost();


    if(!chatUUID && !channelUUID) {
        return null;
    }

    const selectChatsOrChannels = (input:ChannelAndUserListInterfaceResp[]) => {
        setSelectedUsersOrChannels(input);
    }

    const clickFwdMessage = () => {
        if(selectedUsersOrChannels.length == 0) return
        makeRequest<MessageFwdReq>({
            apiEndpoint: PostEndpointUrl.FwdMsgToChatOrChannel,
            payload: {
                fwd_list: selectedUsersOrChannels,
                fwd_attachments: fwdMsgInputState.filesUploaded,
                fwd_channel_uuid: channelUUID||'',
                fwd_post_uuid: postUUID||'',
                fwd_chat_uuid: chatUUID||'',
                fwd_text: fwdMsgInputState.fwdMsgBody
            },
            showToast: true
        }).then(()=>{
            dispatch(clearFwdMsgInputState())
            closeModal()
        })

    }

    const closeModal = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}  >
            <DialogContent className="max-w-[95vw] md:max-w-[35vw] space-y-2.5">
                <DialogHeader>
                    <DialogTitle>Forward this message</DialogTitle>
                    <DialogDescription >
                    </DialogDescription>
                </DialogHeader>


                <ForwardMessageDropdown onSelect={selectChatsOrChannels}/>
                <MinimalTiptapTextInput
                    throttleDelay={300}

                    className={cn("max-w-full rounded-xl h-auto border bg-secondary/20")}
                    editorContentClassName="overflow-auto"
                    output="html"
                    placeholder={"Add a message, if you'd like..."}
                    editable={true}
                    editorClassName="focus:outline-none px-2 py-2"
                    onChange={(content ) => {
                        const t = content as string
                        dispatch(createOrUpdateFwdMsg({body: t}))

                    }}
                >

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
                    disabled={isSubmitting || selectedUsersOrChannels.length == 0 || chatInfo.isLoading || postInfo.isLoading}
                    >
                        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"/>}
                        Forward
                    </Button>
                </DialogFooter>
            </DialogContent>


        </Dialog>
    );
};
