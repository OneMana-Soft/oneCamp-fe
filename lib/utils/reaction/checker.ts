import {GroupedReaction, StandardReaction, SyncCustomReaction} from "@/types/reaction";

export function isExistingReaction(
    groupedReaction: GroupedReaction,
    reaction: StandardReaction | SyncCustomReaction
): boolean {
    if (isStandardReaction(reaction)) return reaction.native === groupedReaction.emoji
    return reaction.id === groupedReaction.custom_content?.id
}

export function isStandardReaction(reaction: StandardReaction | SyncCustomReaction): reaction is StandardReaction {
    return (reaction as StandardReaction).native !== undefined
}