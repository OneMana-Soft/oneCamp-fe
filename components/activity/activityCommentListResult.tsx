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
    CommentActivityPaginationRes,
    MentionActivityPagination,
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

export const ActivityCommentListResult = () => {

    const [pageIndex, setPageIndex] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [allComment, setAllComment] = useState<CommentInfoInterface[]>([])
    const pageSize = 20
    const endpoint = `${GetEndpointUrl.GetCommentActivity}?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    const { data: pageData, isLoading } = useFetch<CommentActivityPaginationRes>(endpoint)

    const {isMobile} = useMedia()

    useEffect(() => {
        if (pageData?.data) {
            if (pageIndex === 0) {
                setAllComment(pageData.data.comments)
            } else {
                setAllComment(prev => [...prev, ...pageData.data.comments])
            }

            setHasMore(pageData.data.has_more)

        }
    }, [pageData, pageIndex])


    const renderItem = (activity: CommentInfoInterface, i: number) => {

        const activityItem: UnifiedActivityItem = {
            activity_type: "COMMENT",
            time: activity.comment_created_at,
            comment: activity
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
            {allComment && allComment.length > 0 ?
                <div className="w-full h-full flex justify-center overflow-y-auto">
                    <div className=" w-full md:w-[40vw]  md:px-6">
                         <VirtualInfiniteScroll
                             items={allComment}
                             renderItem={renderItem}
                             onLoadMore={onLoadMore || (()=>{})}
                             hasMore={hasMore || false}
                             keyExtractor={(item) => item.comment_uuid}
                         />



                    </div>
                </div> :
                (!isLoading && (
                    <div className="p-4">
                        <StatePlaceholder
                            type={'empty'}
                            title={"No comments found"}
                            description={"No one has commented on your content yet."}

                        />
                    </div>
                ))
            }
        </div>

    )
}