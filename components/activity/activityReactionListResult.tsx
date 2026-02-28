import {ChannelInfoInterface, ChannelInfoListInterfaceResp} from "@/types/channel";
import {ChannelListChannel} from "@/components/channel/channelListChannel";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {app_channel_path} from "@/types/paths";
import {useRouter} from "next/navigation";
import {ConditionalWrap} from "@/components/conditionalWrap/conditionalWrap";
import {useMedia} from "@/context/MediaQueryContext";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import {VirtualInfiniteScroll} from "@/components/list/virtualInfiniteScroll";
import {ActivityCard} from "@/components/activity/activityCard";
import {
    CommentActivityPagination,
    MentionActivityPagination,
    ReactionActivityPagination, ReactionActivityPaginationRes,
    UnifiedActivityItem
} from "@/types/activity";
import {MentionInfoInterface} from "@/types/mention";
import {GetEndpointUrl} from "@/services/endPoints";
import {useEffect, useState} from "react";
import {useFetch} from "@/hooks/useFetch";
import {sortChannelList} from "@/lib/utils/sortChannelList";
import {StatePlaceholder} from "@/components/ui/StatePlaceholder";
import {Button} from "@/components/ui/button";
import {openUI} from "@/store/slice/uiSlice";
import {CommentInfoInterface} from "@/types/comment";
import {ReactionActivity} from "@/types/reaction";

export const ActivityReactionListResult = () => {

    const [pageIndex, setPageIndex] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [allReaction, setAllReaction] = useState<ReactionActivity[]>([])
    const pageSize = 20
    const endpoint = `${GetEndpointUrl.GetReactionsActivity}?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    const { data: pageData, isLoading } = useFetch<ReactionActivityPaginationRes>(endpoint)


    const {isMobile} = useMedia()

    useEffect(() => {
        if (pageData?.data.reactions) {
            if (pageIndex === 0) {
                setAllReaction(pageData.data.reactions)
            } else {
                setAllReaction(prev => [...prev, ...pageData.data.reactions])
            }

            setHasMore(pageData.data.has_more)

        }
    }, [pageData, pageIndex])


    const renderItem = (activity: ReactionActivity, i: number) => {

        const activityItem: UnifiedActivityItem = {
            activity_type: "REACTION",
            time: activity.reaction_added_at,
            reaction: activity
        }
        return (
            <ConditionalWrap key = {i} condition={isMobile} wrap={
                (c)=>(
                    <TouchableDiv rippleBrightness={0.8} rippleDuration={800}>{c}
                    </TouchableDiv>

                )
            }>
                <div key = {i}>
                    <ActivityCard
                        activity={activityItem}
                        onClick={()=>{}}
                    />
                </div>
            </ConditionalWrap>
        )
    }

    const onLoadMore = () => {

        // Main List Load More
        if (!isLoading && hasMore) {
            setPageIndex(prev => prev + 1)
        }

    }


    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {allReaction && allReaction.length > 0 ?
                <div className="w-full h-full flex justify-center overflow-y-auto">
                    <div className=" w-full md:w-[40vw]  md:px-6">
                         <VirtualInfiniteScroll
                             items={allReaction}
                             renderItem={renderItem}
                             onLoadMore={onLoadMore || (()=>{})}
                             hasMore={hasMore || false}
                             keyExtractor={(item) => item.uid}
                         />



                    </div>
                </div> :
                (!isLoading && (
                    <div className="p-4">
                        <StatePlaceholder
                            type={'empty'}
                            title={"No reactions found"}
                            description={"No one has reacted to your content yet."}

                        />
                    </div>
                ))
            }
        </div>

    )
}