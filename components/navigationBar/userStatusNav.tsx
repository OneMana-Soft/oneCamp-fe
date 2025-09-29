"use client"

import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from 'next/image';
import {useDispatch, useSelector} from "react-redux";
import {openUpdateUserStatusDialog} from "@/store/slice/dialogSlice";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useFetch} from "@/hooks/useFetch";
import {UserEmojiStatus, UserEmojiStatusResp, UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {useEmojiMartData} from "@/hooks/reactions/useEmojiMartData";
import {findEmojiMartEmojiByEmojiID} from "@/lib/utils/reaction/findReaction";
import {Button} from "@/components/ui/button";
import {RootState} from "@/store/store";
import {PostsRes} from "@/types/post";

export function UserStatusNav({userUUID}: {userUUID: string}) {

    const dispatch = useDispatch();

    const emojiData = useEmojiMartData()

    const userStatusState = useSelector((state: RootState) => state.users.usersStatus[userUUID] || {} as UserEmojiStatus);
    const emojiInfo = findEmojiMartEmojiByEmojiID(emojiData.data, userStatusState.emojiStatus?.status_user_emoji_id ?? '')

    const statusMessage =  userStatusState.emojiStatus?.status_user_emoji_desc ?? null

    return (
        <div className='flex'>
            <Tooltip >
                <TooltipTrigger asChild>
                    <Button
                        variant='ghost'
                        // accessibilityLabel='Update status emoji'
                        className='group/emoji'
                        size={'icon'}
                        onClick={()=>{dispatch(openUpdateUserStatusDialog({userUUID:''}))}}
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