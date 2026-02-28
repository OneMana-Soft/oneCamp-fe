"use client"

import React, { useState, useEffect, useCallback } from "react";
import { VirtualInfiniteScroll } from "@/components/list/virtualInfiniteScroll";
import { PostCard } from "@/components/posts/PostCard";
import { PostsRes, CreatePostPaginationResRaw } from "@/types/post";
import { useFetch } from "@/hooks/useFetch";
import { GetEndpointUrl } from "@/services/endPoints";
import { StatePlaceholder } from "@/components/ui/StatePlaceholder";
import { Loader2 } from "lucide-react";
import { ConditionalWrap } from "@/components/conditionalWrap/conditionalWrap";
import { useMedia } from "@/context/MediaQueryContext";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import { useRouter } from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {ChannelListChannel} from "@/components/channel/channelListChannel";

const PostsPage = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [allPosts, setAllPosts] = useState<PostsRes[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 20;
    const router = useRouter();
    const { isMobile, isDesktop } = useMedia();


    const endpoint = `${GetEndpointUrl.GetUserPosts}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const { data: pageData, isLoading } = useFetch<CreatePostPaginationResRaw>(endpoint);

    useEffect(() => {
        if (pageData?.data.posts) {
            setAllPosts((prev) => {
                const combined = pageIndex === 0 ? pageData.data.posts : [...prev, ...pageData.data.posts];
                const unique = Array.from(new Map(combined.map(item => [item.post_uuid, item])).values());
                return unique;
            });
            setHasMore(pageData.data.has_more);
        }
    }, [pageData, pageIndex]);

    const onLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPageIndex((prev) => prev + 1);
        }
    }, [isLoading, hasMore]);

    const handleClick = (post: PostsRes) => {
        if (post.post_channel?.ch_uuid) {
            router.push(`/app/channel/${post.post_channel.ch_uuid}/${post.post_uuid}`);
        }
    };

    const renderItem = (post: PostsRes, i: number) => (
        <ConditionalWrap key={post.post_uuid} condition={isMobile} wrap={
            (c) => (
                <TouchableDiv rippleBrightness={0.8} rippleDuration={800} onClick={() => handleClick(post)}>
                    {c}
                </TouchableDiv>
            )
        }>

            {i!=0 && <Separator orientation="horizontal" className=" mx-6 w-[calc(100%-3rem)]" />}
            <div >
                <PostCard post={post} onClick={isMobile ? undefined : () => handleClick(post)} />
            </div>

        </ConditionalWrap>
    );

    return (
        <div className="flex h-full flex-col bg-background/30">
            {isDesktop && <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 md:px-6 py-3 md:py-4 backdrop-blur-md">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground/90">Your Posts</h1>
                {isLoading && (
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground animate-in fade-in">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="hidden sm:inline">Refreshing...</span>
                    </div>
                )}
            </div>}

            <div className="flex-1 overflow-auto">
                {allPosts.length > 0 ? (
                    <div className="w-full h-full flex justify-center">
                        <div className="w-full md:w-[40vw] ">
                            <VirtualInfiniteScroll
                                items={allPosts}
                                renderItem={renderItem}
                                onLoadMore={onLoadMore}
                                hasMore={hasMore}
                                isLoading={isLoading}
                                className="no-scrollbar"
                                keyExtractor={(item: PostsRes) => item.post_uuid}
                            />
                        </div>
                    </div>
                ) : !isLoading ? (
                    <div className="flex h-full items-center justify-center p-8">
                        <StatePlaceholder
                            type="empty"
                            title="No posts found"
                            description="You haven't created any posts yet."
                        />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                            <span className="text-sm font-medium">Loading your posts...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostsPage;
