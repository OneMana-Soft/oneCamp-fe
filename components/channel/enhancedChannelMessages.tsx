"use client"

import { useMemo } from "react"
import { groupByDate } from "@/lib/utils/date/groupByDate"
import { getGroupDateHeading } from "@/lib/utils/date/getMessageGroupDate"
import type { PostsRes } from "@/types/post"
import { ChannelMessage } from "@/components/channel/chanelMessage"
import { EnhancedMessageList } from "@/components/message/enhancedMessageList"
import type { FlatItem } from "@/types/virtual"
import { useMedia } from "@/context/MediaQueryContext"
import { ChannelMessageMobile } from "@/components/channel/channelMessageMobile"
import TouchableDiv from "@/components/animation/touchRippleAnimation"

interface EnhancedChannelMessagesProps {
    posts: PostsRes[]
    channelId: string
}

export const EnhancedChannelMessages = ({ posts, channelId }: EnhancedChannelMessagesProps) => {
    const { isMobile } = useMedia()

    const groupedPosts = useMemo(() => {
        try {
            return groupByDate(posts, (post) => post.post_created_at)
        } catch (error) {
            console.error("Error grouping posts:", error)
            return {}
        }
    }, [posts])

    const flatItems = useMemo(() => {
        const items: Array<FlatItem<PostsRes>> = []
        Object.keys(groupedPosts).forEach((date) => {
            items.push({ type: "separator", date, key: "separator" + date })
            groupedPosts[date].forEach((post) => items.push({ type: "item", data: post, key: post.post_uuid }))
        })
        return items
    }, [groupedPosts])

    const renderItem = (post: PostsRes) => (
        <div className="message-item">
            {isMobile ? (
                <TouchableDiv rippleBrightness={0.8} rippleDuration={800} className="w-full">
                    <ChannelMessageMobile 
                        postInfo={post} 
                        isAdmin={true} 
                        channelId={channelId}
                        removePost={() => {}}
                        addReaction={() => {}}
                        removeReaction={() => {}}
                        updatePost={() => {}}
                    />
                </TouchableDiv>
            ) : (
                <ChannelMessage 
                    postInfo={post} 
                    isAdmin={true} 
                    removePost={() => {}}
                    addReaction={() => {}}
                    removeReaction={() => {}}
                    updatePost={() => {}}
                />
            )}
        </div>
    )

    return (
        <EnhancedMessageList
            items={flatItems}
            renderItem={renderItem}
            getDateHeading={getGroupDateHeading}
            className="flex-1"
        />
    )
}

EnhancedChannelMessages.displayName = "EnhancedChannelMessages"
