import {Button} from "@/components/ui/button";
import {ArrowRight, Bookmark, Forward, Hash, MessageSquareText, MoreVertical} from "lucide-react";
import MessageDesktopDropdown from "@/components/MessageDesktopHover/MessageDesktopDropdown";
import {useDispatch} from "react-redux";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {HoverReactionPicker} from "@/components/MessageDesktopHover/hoverReactionPicker";

interface MessageDesktopHoverOptionProps {
    setIsDropdownOpen: (open: boolean) => void;
    chatUUID?: string;
    channelUUID?: string;
    postUUID?: string;
    getReplyNotification?: () => void;
    editMessage: () => void;
    deleteMessage: () => void;
    onReactionSelect: (id: string) => void;
    setEmojiPopupState?: (open: boolean) => void;
    isAdmin?: boolean;
    isOwner: boolean;

}

export const MessageDesktopHoverOptionsForRightPanelChatAndChannel = ({isOwner, isAdmin, onReactionSelect, setEmojiPopupState, setIsDropdownOpen, channelUUID, chatUUID, postUUID, deleteMessage, editMessage, getReplyNotification }: MessageDesktopHoverOptionProps) => {
    return (
        <div className='bg-background  rounded-lg flex items-center space-x-0.5 border-2 p-1'>
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

            {postUUID && channelUUID && <Tooltip >
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon"  >

                        <div className="relative flex">
                            <Hash className="h-4 w-4" stroke='#616060'/>
                        </div>

                    </Button>
                </TooltipTrigger>
                <TooltipContent  className="flex items-center gap-4">

                        <span className="ml-auto">
                    {"Show in channel"}
                  </span>

                </TooltipContent>
            </Tooltip>}
            {postUUID && <Tooltip >
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" >
                        <Forward className="h-4 w-4" stroke='#616060'/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent  className="flex items-center gap-4">

                        <span className="ml-auto">
                    {"Forward"}
                  </span>

                </TooltipContent>
            </Tooltip>}
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


            {(isAdmin || isOwner || getReplyNotification) && <MessageDesktopDropdown isAdmin={isAdmin} isOwner={isOwner} setIsDropdownOpen={setIsDropdownOpen} deleteMessage={deleteMessage} editMessage={editMessage} getReplyNotification={getReplyNotification}/>}
        </div>
    )
}

