import {USER_STATUS_ONLINE, UserEmojiStatus, UserProfileDataInterface} from "@/types/user";
import {useMediaFetch} from "@/hooks/useFetch";
import {GetMediaURLRes} from "@/types/file";
import {GetEndpointUrl} from "@/services/endPoints";
import {getNameInitials} from "@/lib/utils/getNameIntials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {useEmojiMartData} from "@/hooks/reactions/useEmojiMartData";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {findEmojiMartEmojiByEmojiID} from "@/lib/utils/reaction/findReaction";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useMedia} from "@/context/MediaQueryContext";


export const DesktopNavigationEmojiStatus = ({userUUID}: {userUUID: string}) => {

    const emojiData = useEmojiMartData()

    const { isMobile } = useMedia();


    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[userUUID] || {} );
    const emojiInfo = findEmojiMartEmojiByEmojiID(emojiData.data, userStatusState.emojiStatus?.status_user_emoji_id ?? '')

    const statusMessage =  userStatusState.emojiStatus?.status_user_emoji_desc ?? null

    if(!emojiInfo) return null

    console.log("aca userStatusState", userStatusState, emojiInfo)


    return (
        <div className='flex'>
            <Tooltip >
                <TooltipTrigger asChild>

                    <div className='space-x-1'>
                            <span>{emojiInfo.skins[0].native}</span>
                    {isMobile &&
                        <span>{statusMessage}</span>
                    }
                    </div>

                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">

                        <span className="ml-auto">
                    {statusMessage ?? "Change status"}
                  </span>

                </TooltipContent>
            </Tooltip>
        </div>
    );
}