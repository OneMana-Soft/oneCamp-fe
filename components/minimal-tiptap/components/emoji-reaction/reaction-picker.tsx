"use client"

import type { Editor } from '@tiptap/react'
import type { VariantProps } from 'class-variance-authority'
import type { toggleVariants } from '@/components/ui/toggle'
import { ToolbarButton } from '../toolbar-button'
import {Smile} from "lucide-react";
import {ReactionPicker} from "@/components/reactionPicker/reactionPicker";
import {ReactionDataInterface, StandardReaction, SyncCustomReaction} from "@/types/reaction";
import data from "@emoji-mart/data";
import {SearchIndex, init } from "emoji-mart";

interface EmojiReactionPickerProps extends VariantProps<typeof toggleVariants> {
    editor: Editor
}

const EmojiReactionPicker = ({ editor, size, variant }: EmojiReactionPickerProps) => {
    init({ data });
    const onReactionSelect = async (reaction: StandardReaction | SyncCustomReaction) => {

        const emojis = await SearchIndex.search(reaction.id);
        const emojiData = emojis?.find((emoji: ReactionDataInterface) => emoji.id === reaction.id);
        if(emojiData){
            editor.commands.insertContent(emojiData.skins[0].native);
        }
    }

    return (
        <ReactionPicker showCustomReactions={false} onReactionSelect={onReactionSelect}>

            <ToolbarButton
                isActive={editor.isActive('emoji')}
                tooltip="Emoji"
                aria-label="Insert emoji"
                disabled={editor.isActive('emojiPicker')}
                size={size}
                variant={variant}
            >
                <Smile className="size-5" />
            </ToolbarButton>

        </ReactionPicker>
    )
}

export { EmojiReactionPicker }
