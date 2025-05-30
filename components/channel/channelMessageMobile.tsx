import {ChannelMessageAvatar} from "@/components/channel/channelMessageAvatar";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {PostsRes} from "@/types/post";
import {openChannelFileUpload} from "@/store/slice/fileUploadSlice";
import {cn} from "@/lib/utils/cn";
import {SendHorizontal} from "lucide-react";
import {updateChannelInputText} from "@/store/slice/channelSlice";
import {ChannelFileUpload} from "@/components/fileUpload/channelFileUpload";
import MinimalTiptapTextInput from "@/components/textInput/textInput";
import {MessageDesktopHoverOption} from "@/components/message/MessageDesktopHoverOption";
import {useLongPress} from "@/hooks/useLongPress";
import {useMedia} from "@/context/MediaQueryContext";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {
    closeChannelMessageLongPressDrawer,
    openChannelMessageLongPressDrawer,
    openReactionPickerDrawer
} from "@/store/slice/drawerSlice";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";

interface ChannelMessageProps {
    postInfo: PostsRes
    isAdmin: boolean
}


export const ChannelMessageMobile = ({postInfo, isAdmin}: ChannelMessageProps) => {

    const dispatch = useDispatch();




    const addEmojiReaction = () => {

        dispatch(closeChannelMessageLongPressDrawer())

        dispatch(openReactionPickerDrawer({
            onReactionSelect(reaction: StandardReaction | SyncCustomReaction): void {
            },
            showCustomReactions: false
        }))

    }

    const onLongPress = () => {
        dispatch(openChannelMessageLongPressDrawer({
            onAddReaction: addEmojiReaction
        }))
    }


    const longPressEvent = useLongPress(onLongPress, {
        threshold: 500, // Reduced from 800ms to 500ms for quicker long press
        onLongPressStart: () =>{

        }
    })



    return (

        <div  className='flex p-4 space-x-4 ' {...longPressEvent}>

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
                <div className='break-all' >

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
            </div>
        </div>
    )
}