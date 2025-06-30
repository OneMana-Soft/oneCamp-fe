"use client"

import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from 'next/image';
import {useDispatch} from "react-redux";
import {openUpdateUserStatusDialog} from "@/store/slice/dialogSlice";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useFetch} from "@/hooks/useFetch";
import {UserEmojiStatusResp, UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {useEmojiMartData} from "@/hooks/reactions/useEmojiMartData";
import {findEmojiMartEmojiByEmojiID} from "@/lib/utils/reaction/findReaction";
import {Button} from "@/components/ui/button";

export function UserStatusNav() {

    const dispatch = useDispatch();

    const emojiData = useEmojiMartData()

    const userActiveEmojiStatus = useFetch<UserEmojiStatusResp>(GetEndpointUrl.GetUserEmojiStatus)
    const emojiInfo = findEmojiMartEmojiByEmojiID(emojiData.data, userActiveEmojiStatus.data?.data?.status_user_emoji_id ?? '')

    const statusMessage =  userActiveEmojiStatus.data?.data?.status_user_emoji_desc ?? null

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