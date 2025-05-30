"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {DesktopReactionPicker} from "@/components/reactionPicker/DesktopReactionPicker";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils/cn";
import {CONTAINER_STYLES} from "@/lib/utils/containerStyles";

export interface ReactionPickerPopoverProps {
    showCustomReactions : boolean
    onReactionSelect: (reaction: StandardReaction | SyncCustomReaction) => void
    children: React.ReactNode
}

const COLLISION_PADDING = 16
const SIDE_OFFSET = 4

export function ReactionPickerPopover({showCustomReactions, onReactionSelect, children}:ReactionPickerPopoverProps) {

    const triggerRef = useRef<HTMLButtonElement>(null)
    const [triggerRect, setTriggerRect] = useState<{ top: number; bottom: number }>({ top: 0, bottom: 0 })
    const [popOpened, setPopOpened] = useState(false)

    useEffect(() => {
        if (popOpened) {
            const rect = triggerRef.current?.getBoundingClientRect() ?? new DOMRect()

            setTriggerRect({
                top: rect.top + COLLISION_PADDING + SIDE_OFFSET + 32,
                bottom: rect.bottom - COLLISION_PADDING - SIDE_OFFSET - 32
            })
        }
    }, [popOpened, triggerRef])


    return (
        <Popover open={popOpened} onOpenChange={setPopOpened}>
            <PopoverTrigger ref={triggerRef} asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className={cn([
                CONTAINER_STYLES.animation,
                CONTAINER_STYLES.rounded,
                CONTAINER_STYLES.shadows,
                ' h-[424px] border bg-clip-border dark:shadow-[0_0_0_1px_black] z-[100]'
            ])} style={{ maxHeight: `max(calc(100dvh - ${triggerRect.top}px), calc(${triggerRect.bottom}px))` }}>
                <DesktopReactionPicker
                    showCustomReactions={showCustomReactions}
                    onReactionSelect={onReactionSelect}
                />
            </PopoverContent>
        </Popover>
    )
}
