// src/components/channel/ChannelMessages.tsx
import { useMemo } from "react";
import { groupByDate } from "@/lib/utils/groupByDate";
import { getGroupDateHeading } from "@/lib/utils/getMessageGroupDate";
import { PostsRes } from "@/types/post";
import {ChannelMessage} from "@/components/channel/chanelMessage";
import {MessageList} from "@/components/message/MessageList";
import {FlatItem} from "@/types/virtual";
import {useMedia} from "@/context/MediaQueryContext";
import {ChannelMessageMobile} from "@/components/channel/channelMessageMobile";
import TouchableDiv from "@/components/animation/touchRippleAnimation";

interface ChannelMessagesProps {
    posts: PostsRes[];
}

export const ChannelMessages = ({ posts }: ChannelMessagesProps) => {
    const { isMobile, isDesktop } = useMedia();


    const groupedPosts = useMemo(() => {
        try {
            return groupByDate(posts, (post) => post.post_created_at);
        } catch (error) {
            console.error("Error grouping posts:", error);
            return {};
        }
    }, [posts]);

    const flatItems = useMemo(() => {
        const items: Array<FlatItem<PostsRes>> = [];
        Object.keys(groupedPosts).forEach((date) => {
            items.push({ type: "separator", date });
            groupedPosts[date].forEach((post) => items.push({ type: "item", data: post }));
        });
        return items;
    }, [groupedPosts]);

    const renderItem = (post: PostsRes) => (
        <div >
            {isMobile ?
                <TouchableDiv
                    rippleBrightness={0.8}
                    rippleDuration={800}

                >
                    <ChannelMessageMobile postInfo={post} isAdmin={true} />
                    </TouchableDiv>:
                <ChannelMessage postInfo={post} isAdmin={true} />
            }
        </div>
    );

    return (
        <MessageList
            items={flatItems}
            renderItem={renderItem}
            getDateHeading={getGroupDateHeading}
        />
    );
};

ChannelMessages.displayName = "ChannelMessages";