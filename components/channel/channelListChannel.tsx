import React from "react";
import {ChatUserAvatar} from "@/components/chat/chatUserAvatar";
import {removeHtmlTags} from "@/lib/utils/removeHtmlTags";
import {formatTimeForPostOrComment} from "@/lib/utils/formatTimeForPostOrComment";
import {ChatUserListUserAvatar} from "@/components/chat/chatUserListUserAvatar";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {Hash} from "lucide-react";
import {app_channel_path} from "@/types/paths";

interface DmItemProps {
    lastUsername: string;
    lastUserMessage: string;
    lastMessageTime: string;
    channelName: string;
    unseenMessageCount: number;
    userSelected: boolean
    attachmentCount: number
}

export const ChannelListChannel: React.FC<DmItemProps> = ({
                                                     lastUsername,
                                                     lastUserMessage,
                                                     lastMessageTime,
                                                     channelName,
                                                     unseenMessageCount,
                                                     userSelected,
                                                     attachmentCount
                                                 }) => {





    let message = ''

    if(lastUserMessage == '' && attachmentCount > 0) {

        message = 'sent attachment'
    }

    if(lastUserMessage != '') {
        message = removeHtmlTags(lastUserMessage)
    }

    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);

    return (
        <div className={`flex pl-2 pr-4 p-2 border-b-slate-300 pt-6 pb-4 hover:cursor-pointer rounded-lg hover:bg-primary/5 hover:shadow-xl  w-full ${userSelected ? "bg-primary/5": ""}`}>
            <div className="relative">
                <Hash className="h-4 w-4" stroke='#616060'/>


            </div>
            <div className="ml-2 flex-1 flex flex-col ">
                <div className="flex justify-between items-center">
                    <div
                        className=" font-medium overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[15ch] text-sm">
                        {`${channelName}`}
                    </div>
                    {lastMessageTime && <div className={`text-xs text-gray-500 overflow-ellipsis overflow-hidden whitespace-nowrap ${rightPanelState.isOpen ? 'max-w-[8ch]' : ''}`}>{formatTimeForPostOrComment(lastMessageTime)}</div>}
                </div>
                <div className="flex flex-row mt-0.5">
                    <div className="flex-1 flex items-center text-sm w-12">
                        {
                            message ?
                                <>
                                    <div className="mr-1 whitespace-nowrap">{lastUsername}:</div>
                                    <div className="truncate">{message}</div>
                                </>
                                :

                                    <div className="mr-1 whitespace-nowrap">Start Conversation by saying Hi 👋 </div>
                        }

                    </div>
                    {unseenMessageCount !== 0 && (
                        <div
                            className="rounded-full flex items-center justify-center w-6 h-6 bg-destructive text-sm text-gray-50 font-mono text-center">
                            {unseenMessageCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

