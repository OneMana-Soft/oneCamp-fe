import {UserProfileDataInterface} from "@/types/user";

type ReactionCategoryType =
    | 'frequent'
    | 'custom'
    | 'people'
    | 'nature'
    | 'foods'
    | 'activity'
    | 'places'
    | 'objects'
    | 'symbols'
    | 'flags'

export interface StandardReactionSkin {
    unified: string
    native: string
}

export interface CustomReactionSkin {
    file_url: string
    created_at: string
}

interface ReactionsCategory {
    id: ReactionCategoryType
    reactionIds: string[]
}

export type SyncCustomReaction = {
    id: string
    name: string
    file_url: string
    created_at: string
}

export type GroupedReaction = {
    uid: string
    emoji_id: string | null
    emoji?: string | null
    tooltip? : string
    reactions_count?: number
    reaction_added_by: UserProfileDataInterface
    custom_content?: SyncCustomReaction | null
}

export interface SyncCustomReactionResp {
    data: SyncCustomReaction[]
}

interface ReactionDataInterface {
    id: string
    name: string
    keywords: string[]
    emoticons: string[]
    skins: (StandardReactionSkin | CustomReactionSkin)[]
}

interface ReactionsData {
    aliases: { [key: string]: string }
    emoticons: { [key: string]: string }
    categories: ReactionsCategory[]
    reactions: { [key: string]: ReactionDataInterface }
}

const ALL_REACTION_CATEGORIES: Readonly<ReactionCategoryType[]> = [
    'frequent',
    'custom',
    'people',
    'nature',
    'foods',
    'activity',
    'places',
    'objects',
    'symbols',
    'flags'
]

function getReactionCategoryLabel(id: string) {
    switch (id) {
        case 'search':
            return 'Search Results'
        case 'frequent':
            return 'Frequently Used'
        case 'custom':
            return 'Custom'
        case 'people':
            return 'Smileys & People'
        case 'nature':
            return 'Animals & Nature'
        case 'foods':
            return 'Food & Drink'
        case 'activity':
            return 'Activity'
        case 'places':
            return 'Travel & Places'
        case 'objects':
            return 'Objects'
        case 'symbols':
            return 'Symbols'
        case 'flags':
            return 'Flags'
        default:
            return id
    }
}

export interface StandardReaction {
    id: string
    name: string
    native: string
}

function isStandardReactionSkin(skin: StandardReactionSkin | CustomReactionSkin): skin is StandardReactionSkin {
    return (skin as StandardReactionSkin).unified !== undefined
}

export { ALL_REACTION_CATEGORIES, getReactionCategoryLabel, isStandardReactionSkin }
export type { ReactionCategoryType, ReactionDataInterface, ReactionsCategory, ReactionsData }


export const MAX_FREQUENT_RESULTS = 27
export const DEFAULT_FREQUENT_REACTIONS = ['+1', 'smile', 'slightly_frowning_face', 'rocket', '-1', 'heart', 'eyes']
