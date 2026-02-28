"use client"

import { useMemo } from 'react'

import {
    ReactionCategoryType,
    ReactionsCategory,
    ReactionsData,
    SyncCustomReactionResp
} from '@/types/reaction'

import { useEmojiMartData } from '@/hooks/reactions/useEmojiMartData'
import {useFetch} from "@/hooks/useFetch";

export function useReactionsData(): ReactionsData | null {
    const { data: emojiMartData } = useEmojiMartData()
    const  customReactions = useFetch<SyncCustomReactionResp>("")

    const aliases = useMemo(() => emojiMartData?.aliases ?? {}, [emojiMartData?.aliases])

    const categories: ReactionsCategory[] = useMemo(
        () => [
            ...(emojiMartData?.categories ?? []).map((category) => ({
                id: category.id as unknown as ReactionCategoryType,
                reactionIds: category.emojis
            })),
            {
                id: 'custom' as unknown as ReactionCategoryType,
                reactionIds: customReactions.data?.data
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                    .map((reaction) => reaction.id) || []
            }
        ],
        [emojiMartData?.categories, customReactions]
    )
    const { reactions, emoticons } = useMemo(() => {
        const reactions: ReactionsData['reactions'] = {}
        const emoticons: ReactionsData['emoticons'] = {}

        Object.values(emojiMartData?.emojis ?? {}).forEach((emoji) => {
            reactions[emoji.id] = {
                id: emoji.id,
                name: emoji.name,
                keywords: emoji.keywords,
                emoticons: emoji.emoticons ?? [],
                skins: emoji.skins
            }

            emoji.emoticons?.forEach((emoticon) => (emoticons[emoticon] = emoji.id))
        })

        customReactions.data?.data.forEach((reaction) => {
            reactions[reaction.id] = {
                id: reaction.id,
                name: reaction.name,
                keywords: [],
                emoticons: [],
                skins: [
                    {
                        file_url: reaction.file_url,
                        created_at: reaction.created_at
                    }
                ]
            }
        })

        return { reactions, emoticons }
    }, [emojiMartData?.emojis, customReactions])

    if (!emojiMartData) return null

    return { aliases, categories, reactions, emoticons }
}
