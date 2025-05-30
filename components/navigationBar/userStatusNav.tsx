"use client"

import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from 'next/image';
import {useDispatch} from "react-redux";
import {openUpdateUserStatusDialog} from "@/store/slice/dialogSlice";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function UserStatusNav() {

    const dispatch = useDispatch();

    return (
        <div className='flex'>
            <Tooltip >
                <TooltipTrigger asChild>
                    <Image src={addEmojiIconSrc || "/placeholder.svg?height=24&width=24"} alt="Add Emoji" width={18} className='hover:cursor-pointer' height={18} onClick={()=>{dispatch(openUpdateUserStatusDialog({userUUID:''}))}}/>

                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">

                        <span className="ml-auto">
                    Change status
                  </span>

                </TooltipContent>
            </Tooltip>
        </div>
    );
}