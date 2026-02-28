import {GroupedReaction, StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {EmojiMartData} from "@emoji-mart/data";
import {isExistingReaction} from "@/lib/utils/reaction/checker";


export function findGroupedReaction(
    groupedReactions: GroupedReaction[],
    reaction: StandardReaction | SyncCustomReaction
): GroupedReaction | undefined {
    return groupedReactions.find((groupedReaction) => isExistingReaction(groupedReaction, reaction))
}

export function findEmojiMartEmoji(emojiMartData: EmojiMartData, nativeEmoji: string) {
    return Object.values(emojiMartData.emojis).find((emoji) => emoji.skins.some((skin) => skin.native === nativeEmoji))
}


export function findEmojiMartEmojiByEmojiID(emojiMartData: EmojiMartData| null, emojiId: string) {
    if(!emojiMartData) return

    return Object.values(emojiMartData.emojis).find((emoji) => emoji.id === emojiId)
}
