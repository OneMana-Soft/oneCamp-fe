import {Button} from "@/components/ui/button";
import Image from "next/image";
import addEmojiIconSrc from "@/assets/addEmoji.svg";
import {Bookmark, Forward, MessageSquareText, MoreVertical} from "lucide-react";
import MessageDesktopDropdown from "@/components/message/MessageDesktopDropdown";
import {useDispatch} from "react-redux";
import {openForwardMessageDialog} from "@/store/slice/dialogSlice";

interface MessageDesktopHoverOptionProps {
    setIsDropdownOpen: (open: boolean) => void;
}

export const MessageDesktopHoverOption = ({ setIsDropdownOpen }: MessageDesktopHoverOptionProps) => {
    const dispatch = useDispatch();
    return (
        <div className='bg-background  rounded-lg flex items-center space-x-0.5 border-2 p-1'>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
                {'✅'}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
                {'👀'}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                {'🙌'}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Image src={addEmojiIconSrc || "/placeholder.svg?height=24&width=24"} alt="Add Emoji"  className='h-4 w-4' />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
                <MessageSquareText className="h-4 w-4" stroke='#616060'/>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>{dispatch(openForwardMessageDialog({chatUUID:'', channelUUID:'ughvb'}))}}>
                <Forward className="h-4 w-4" stroke='#616060'/>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
                <Bookmark className="h-4 w-4" stroke='#616060' />
            </Button>
            <MessageDesktopDropdown setIsDropdownOpen={setIsDropdownOpen}/>
        </div>
    )
}

