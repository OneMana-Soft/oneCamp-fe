
import {ReactionPill} from "@/components/message/reactionPill";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import addEmojiIconSrc from "@/assets/addEmoji.svg";
import Image from "next/image";
import {HoverReactionPicker} from "@/components/MessageDesktopHover/hoverReactionPicker";
import {ReactionPicker} from "@/components/reactionPicker/reactionPicker";
import {useState} from "react";
import {AddReactionTrigger} from "@/components/reactionPicker/AddReactionTrigger";

interface BottomMenuProps {
    reactions: { [key: string]: string[] };
    handleEmojiClick: (id: string) => void
    selectedEmojiId: string
}





export const BottomMenu = ({reactions, handleEmojiClick, selectedEmojiId}: BottomMenuProps) => {

    const [isTooltipOpen, setIsTooltipOpen] = useState(false)
    const [isEmojiPopupOpen, setIsEmojiPopupOpen] = useState(false)
    const [suppressUntilLeave, setSuppressUntilLeave] = useState(false)
    return(
        <div>
            {Object.keys(reactions).length > 0 && <div className='flex items-center justify-start gap-2'>
                { Object.entries(reactions).map(([emojiId, userNames]) => (
                    <ReactionPill key={emojiId} emojiId={emojiId} reactionUserNames={userNames}
                                      onClickEmoji={handleEmojiClick} isSelected={selectedEmojiId == emojiId}/>
                ))}
                <AddReactionTrigger onReactionSelect={(id)=>{ handleEmojiClick(id) }} showCustomReactions={false} size="sm" variant="outline" />
            </div>}

        </div>
    )

}