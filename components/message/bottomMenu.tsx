
import {ReactionPill} from "@/components/message/reactionPill";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from "next/image";
import {HoverReactionPicker} from "@/components/MessageDesktopHover/hoverReactionPicker";
import {ReactionPicker} from "@/components/reactionPicker/reactionPicker";

interface BottomMenuProps {
    reactions: { [key: string]: string[] };
    handleEmojiClick: (id: string) => void
    selectedEmojiId: string
}





export const BottomMenu = ({reactions, handleEmojiClick, selectedEmojiId}: BottomMenuProps) => {


    return(
        <div>
            {Object.keys(reactions).length > 0 && <div className='flex items-center justify-start space-x-2'>
                { Object.entries(reactions).map(([emojiId, userNames]) => (
                    <ReactionPill key={emojiId} emojiId={emojiId} reactionUserNames={userNames}
                                      onClickEmoji={handleEmojiClick} isSelected={selectedEmojiId == emojiId}/>
                ))}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ReactionPicker showCustomReactions={false} onReactionSelect={(reaction)=>{handleEmojiClick(reaction.id)}}>
                            <Button variant="outline" size="icon" className="h-6 w-6 bg-accent flex justify-center items-center rounded-full" >

                                <Image src={addEmojiIconSrc || "/placeholder.svg?height=24&width=24"} alt="Add Emoji"  className='md:h-3 md:w-3 h-4 w-4' />
                            </Button>
                        </ReactionPicker>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-xs'>{'Add reaction'}</p>
                    </TooltipContent>
                </Tooltip>
            </div>}

        </div>
    )

}