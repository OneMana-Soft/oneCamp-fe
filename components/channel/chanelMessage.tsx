import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {PostsRes} from "@/types/post";
import {cn} from "@/lib/utils/cn";
import {SendHorizontal} from "lucide-react";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {MessageDesktopHoverOption} from "@/components/message/MessageDesktopHoverOption";

import {useState} from "react";
import {usePathname} from "next/navigation";
import {MessagePreview} from "@/components/message/MessagePreview";

interface ChannelMessageProps {
    postInfo: PostsRes
    isAdmin: boolean
}


export const ChannelMessage = ({postInfo, isAdmin}: ChannelMessageProps) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const channelId = usePathname().split('/')[3]




    return (
        <div className={`flex relative space-x-4 pb-4 pt-4 hover:bg-secondary transition-colors delay-200 group ${isDropdownOpen? 'bg-secondary':''}`}>
            <div
                className={cn(
                    "ml-2 absolute -top-5 right-1 transition-opacity delay-200",
                    isDropdownOpen || "opacity-0 group-hover:opacity-100"
                )}
            >
                <MessageDesktopHoverOption setIsDropdownOpen={setIsDropdownOpen} channelUUID={channelId} postUUID={postInfo.post_uuid}/>
            </div>
            <div className='h-12 w-12 flex-shrink-0'>
                <ChannelMessageAvatar userInfo={postInfo.post_by}/>

            </div>
            <div>
                <div className='flex items-baseline space-x-2'>
                    <div className='font-semibold text-m'>
                        {postInfo.post_by.user_name}
                    </div>
                    <div className='text-xs text-muted-foreground text'>
                        {formatTimeForPostOrComment(postInfo.post_created_at)}

                    </div>
                </div>
                <div className='break-all'>

                    <MinimalTiptapTextInput
                        throttleDelay={300}
                        isOutputText={true}
                        className={cn("max-w-full rounded-xl h-auto border-none")}
                        editorContentClassName="overflow-auto mb-2"
                        output="html"
                        content={postInfo.post_text}
                        placeholder={"message"}
                        editable={false}
                        ButtonIcon={SendHorizontal}
                        buttonOnclick={() => {
                        }}
                        editorClassName="focus:outline-none "
                        onChange={(content) => {


                        }}
                    >
                    </MinimalTiptapTextInput>
                </div>

                {
                    (postInfo.post_fwd_msg_chat || postInfo.post_fwd_msg_post) &&

                    <MessagePreview
                        msgBy={postInfo.post_by || postInfo.post_fwd_msg_chat.chat_from }
                        msgText={postInfo.post_fwd_msg_post.post_text || postInfo.post_fwd_msg_chat?.chat_body_text || ''}
                        msgChannelName={postInfo.post_fwd_msg_post.post_channel?.ch_name}
                        msgChannelUUID={postInfo.post_fwd_msg_post.post_channel?.ch_uuid}
                        msgUUID={postInfo.post_fwd_msg_post.post_uuid || postInfo.post_fwd_msg_chat.chat_uuid}
                        msgCreatedAt={postInfo.post_fwd_msg_post.post_created_at || postInfo.post_fwd_msg_chat.chat_created_at}
                        vewFooter={true}
                    />
                }
            </div>
        </div>
    )
}