"use client"
import {ReactionPickerPopover, ReactionPickerPopoverProps} from "@/components/popover/reactionPickerPopover";
import {useMedia} from "@/context/MediaQueryContext";
import {openReactionPickerDrawer} from "@/store/slice/drawerSlice";
import {useDispatch} from "react-redux";

export const ReactionPicker = ({children, onReactionSelect, showCustomReactions, setPopupState}:ReactionPickerPopoverProps) => {
    const { isMobile} = useMedia()
    const dispatch = useDispatch()
    const onClick = () => {

        dispatch(openReactionPickerDrawer(
            {
                onReactionSelect: onReactionSelect,
                showCustomReactions: showCustomReactions
            }
        ))
    }



    return (
        <>
            {isMobile ?
               (<div onClick={onClick}>
                   {children}
                </div>)
                :
                (<ReactionPickerPopover onReactionSelect={onReactionSelect} showCustomReactions={showCustomReactions} setPopupState={setPopupState}>
                    {children}
                </ReactionPickerPopover>)

            }
        </>
    )

}