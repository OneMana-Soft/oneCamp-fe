"use client"

import {getReactionCategoryLabel, StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {MobileReactionPickerProps} from "@/components/drawers/emojiPickerDrawer";
import {cn} from "@/lib/utils/cn";
import {isStandardReaction} from "@/lib/utils/reaction/checker";
import Image from 'next/image'


interface MobileReactionPickerCategoryProps {
    id: string
    reactions: (StandardReaction | SyncCustomReaction)[]
    onReactionSelect: MobileReactionPickerProps['onReactionSelect']
}

export function MobileReactionPickerCategory({ id, reactions, onReactionSelect }: MobileReactionPickerCategoryProps) {
    return (
        <div
            className={cn(
                'h-[240px]',
                '[&:first-child>div]:pl-safe-offset-3 [&:last-child>div]:pr-safe-offset-3',
                '[&:first-child>h2]:pl-safe-offset-5 [&:last-child>h2]:pr-safe-offset-3'
            )}
        >
            <h2 className='sticky left-0 w-fit whitespace-nowrap px-5 py-2 text-base font-medium'>
                {getReactionCategoryLabel(id)}
            </h2>
            <div
                data-vaul-no-drag
                className='grid w-full grid-flow-col grid-rows-5 place-content-start items-center gap-x-1 pl-3'
            >
                {reactions.map((reaction) => (
                    <button
                        data-vaul-no-drag
                        key={reaction.id}
                        onClick={() => onReactionSelect(reaction)}
                        className='flex aspect-square h-10 w-10 shrink-0 items-center justify-center font-[emoji] text-3xl leading-none'
                    >
                        {isStandardReaction(reaction) ? (
                            <span>{reaction.native}</span>
                        ) : (
                            <Image
                                data-vaul-no-drag
                                className='h-7.5 w-7.5 object-contain'
                                src={reaction.file_url ?? ''}
                                alt={reaction.name}
                                width={30}
                                height={30}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
