import {GroupedReaction, StandardReaction, SyncCustomReaction} from "@/types/reaction";

export function isExistingReaction(
    groupedReaction: GroupedReaction,
    reaction: StandardReaction | SyncCustomReaction
): boolean {
    if (isStandardReaction(reaction)) return reaction.native === groupedReaction.emoji
    const custom = reaction as SyncCustomReaction
    return custom.id === groupedReaction.custom_content?.id
}

export function isStandardReaction(reaction: StandardReaction | SyncCustomReaction): reaction is StandardReaction {
    return !('file_url' in reaction)
}