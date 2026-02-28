"use client"
import {ReactionPickerPopover, ReactionPickerPopoverProps} from "@/components/popover/reactionPickerPopover";
import {useMedia} from "@/context/MediaQueryContext";
import {openUI} from "@/store/slice/uiSlice";
import {useDispatch} from "react-redux";

export const ReactionPicker = ({children, onReactionSelect, showCustomReactions, setPopupState}:ReactionPickerPopoverProps) => {
    const { isMobile} = useMedia()
    const dispatch = useDispatch()
    const onClick = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        // Defer the drawer opening to allow UI to update (e.g. ripple to finish or button state to change)
        setTimeout(() => {
            dispatch(openUI(
                {
                    key: 'reactionPickerDrawer',
                    data: {
                        onReactionSelect: onReactionSelect,
                        showCustomReactions: showCustomReactions
                    }
                }
            ))
        }, 50);
    }

    return (
        <>
            {isMobile ?
               (<div onClick={onClick} onTouchStart={(e) => e.stopPropagation()}>
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