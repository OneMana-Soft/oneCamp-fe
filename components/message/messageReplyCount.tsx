import {Button} from "@/components/ui/button";
import {formatTimeForReplyCount} from "@/lib/utils/date/formatTimeForReplyCount";
import {ConditionalWrap} from "@/components/conditionalWrap/conditionalWrap";
import {useMedia} from "@/context/MediaQueryContext";
import {ChevronRight} from "lucide-react";

interface MessageReplyCountProps {

    replyCount?: number;
    lastCommentCreatedAt?: string
    openDesktopThread?: () => void


}
export const MessageReplyCount = ({replyCount, lastCommentCreatedAt, openDesktopThread}: MessageReplyCountProps) => {

    const {isDesktop} = useMedia()

    if(!replyCount || !lastCommentCreatedAt) return null;



    return (

            <ConditionalWrap
                condition={isDesktop}
                wrap={(c) => (
                    <Button variant='ghost' className='flex  justify-start p-0.5 mt-0' onClick={openDesktopThread}>{c} </Button>
                )}>
            <div className='flex space-x-2 group text-xs'>
               <div className='text-blue-500 hover:underline font-semibold'>
                   {replyCount} replies
               </div>
                <div className='text-muted-foreground font-normal flex gap-x-1'>
                    {isDesktop && <span>Last reply</span>}
                    <span>{formatTimeForReplyCount(lastCommentCreatedAt)}</span>
                </div>
                {isDesktop && <div className='pl-24 group-hover:block hidden flex-1 text-muted-foreground'>
                    <ChevronRight />
                </div>}
            </div>
            </ConditionalWrap>


    )
}