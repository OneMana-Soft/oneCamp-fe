"use client"

import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from 'next/image';
import {useDispatch, useSelector} from "react-redux";
import {openUI} from "@/store/slice/uiSlice";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useEmojiMartData} from "@/hooks/reactions/useEmojiMartData";
import {findEmojiMartEmojiByEmojiID} from "@/lib/utils/reaction/findReaction";
import {Button} from "@/components/ui/button";
import {RootState} from "@/store/store";
import {useMemo} from "react";

export function UserStatusNav({userUUID}: {userUUID: string}) {

    const dispatch = useDispatch();

    const emojiData = useEmojiMartData()

    // Use a memoized selector with custom equality to prevent unnecessary re-renders
    const userStatusState = useSelector(
        (state: RootState) => state.users.usersStatus[userUUID],
        // Custom equality function to prevent re-renders on object reference changes
        (prev, next) => {
            // If both are undefined, they're equal
            if (!prev && !next) return true;
            
            // If one is undefined and the other isn't, they're different
            if (!prev || !next) return false;
            
            // Compare the actual properties that matter for rendering
            return (
                prev.emojiStatus?.status_user_emoji_id === next.emojiStatus?.status_user_emoji_id &&
                prev.emojiStatus?.status_user_emoji_desc === next.emojiStatus?.status_user_emoji_desc &&
                prev.status === next.status &&
                prev.deviceConnected === next.deviceConnected
            );
        }
    );
    
    // Memoize the fallback to ensure stable reference when userStatusState is undefined
    const safeUserStatusState = useMemo(() => 
        userStatusState || { emojiStatus: undefined } as any,
        [userStatusState]
    );
    
    const emojiInfo = findEmojiMartEmojiByEmojiID(emojiData.data, safeUserStatusState.emojiStatus?.status_user_emoji_id ?? '')

    const statusMessage =  safeUserStatusState.emojiStatus?.status_user_emoji_desc ?? null

    return (
        <div className='flex'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant='ghost'
                        // accessibilityLabel='Update status emoji'
                        className='group/emoji'
                        size={'icon'}
                        onClick={()=>{dispatch(openUI({ key: 'userStatusUpdate', data: { userUUID: '' } }))}}
                    >
                    { emojiInfo
                        ?
                        emojiInfo.skins[0].native
                        :<Image src={addEmojiIconSrc || "/placeholder.svg?height=24&width=24"} alt="Add Emoji" width={18} className='hover:cursor-pointer' height={18} />
                    }
                    </Button>
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