import {Button} from "@/components/ui/button";
import Image from "next/image";
import addEmojiIconSrc from "@/assets/addEmoji.svg";
import {Bookmark, Forward, MessageSquareText, MoreVertical} from "lucide-react";
import MessageDesktopDropdown from "@/components/MessageDesktopHover/MessageDesktopDropdown";
import {useDispatch} from "react-redux";
import {openForwardMessageDialog, openUpdateUserStatusDialog} from "@/store/slice/dialogSlice";
import {openRightPanel} from "@/store/slice/desktopRightPanelSlice";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ReactionPicker} from "@/components/reactionPicker/reactionPicker";
import {ReactionDataInterface, StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {SearchIndex} from "emoji-mart";
import {Editor} from "@tiptap/react";
import {HoverReactionPicker} from "@/components/MessageDesktopHover/hoverReactionPicker";

interface MessageDesktopHoverOptionProps {
    setIsDropdownOpen: (open: boolean) => void;
    chatUUID?: string;
    chatMessageID?: string;
    channelUUID?: string;
    postUUID?: string;
    getReplyNotification?: () => void;
    setEmojiPopupState?: (open: boolean) => void;
    editMessage: () => void;
    deleteMessage: () => void;
    isAdmin?: boolean;
    isOwner: boolean;
    onReactionSelect: (id: string) => void;
}
// raised_hands
export const MessageDesktopHoverOptionsForMainChatAndChannel = ({ isOwner, isAdmin, setEmojiPopupState, setIsDropdownOpen, channelUUID, chatUUID, postUUID, deleteMessage, editMessage, getReplyNotification, onReactionSelect, chatMessageID }: MessageDesktopHoverOptionProps) => {
    const dispatch = useDispatch();


    return (
        <div className='bg-background  rounded-lg flex items-center space-x-0.5 border-2 p-1'>
            <Button variant="ghost" size="icon" className="h-8 w-8 " onClick={()=>{onReactionSelect('white_check_mark')}}>
                {'✅'}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 " onClick={()=>{onReactionSelect('eyes')}}>
                {'👀'}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>{onReactionSelect('raised_hands')}}>
                {'🙌'}
            </Button>
            <Tooltip >
                <TooltipTrigger asChild>
                    <HoverReactionPicker onReactionIdSelected={onReactionSelect} setPopupState={setEmojiPopupState}/>

                </TooltipTrigger>
                <TooltipContent  className="flex items-center gap-4">

                        <span className="ml-auto">
                    {"Add reaction"}
                  </span>

                </TooltipContent>
            </Tooltip>

            <Tooltip >
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 " onClick={()=>{dispatch(openRightPanel({
                        chatMessageUUID: chatMessageID || '',
                        postUUID: postUUID||'', channelUUID: channelUUID || '', chatUUID: chatUUID || ''}))}}>
                        <MessageSquareText className="h-4 w-4" stroke='#616060'/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent  className="flex items-center gap-4">

                        <span className="ml-auto">
                    {"Thread"}
                  </span>

                </TooltipContent>
            </Tooltip>
            <Tooltip >
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>{dispatch(openForwardMessageDialog({chatUUID:chatUUID||'', channelUUID: channelUUID||'', postUUID:postUUID||''}))}}>
                        <Forward className="h-4 w-4" stroke='#616060'/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent  className="flex items-center gap-4">

                        <span className="ml-auto">
                    {"Forward"}
                  </span>

                </TooltipContent>
            </Tooltip>
            {/*<Tooltip >*/}
            {/*    <TooltipTrigger asChild>*/}
            {/*        <Button variant="ghost" size="icon" className="h-8 w-8 ">*/}
            {/*            <Bookmark className="h-4 w-4" stroke='#616060' />*/}
            {/*        </Button>*/}
            {/*    </TooltipTrigger>*/}
            {/*    <TooltipContent  className="flex items-center gap-4">*/}

            {/*            <span className="ml-auto">*/}
            {/*        {"Save for later"}*/}
            {/*      </span>*/}

            {/*    </TooltipContent>*/}
            {/*</Tooltip>*/}


            { (isAdmin || isOwner || getReplyNotification) && <MessageDesktopDropdown isAdmin={isAdmin} isOwner={isOwner} setIsDropdownOpen={setIsDropdownOpen} deleteMessage={deleteMessage} editMessage={editMessage} getReplyNotification={getReplyNotification}/>}
        </div>
    )
}

