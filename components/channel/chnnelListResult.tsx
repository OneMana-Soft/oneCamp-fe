import {ChannelInfoInterface} from "@/types/channel";
import {ChannelListChannel} from "@/components/channel/channelListChannel";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {app_channel_path} from "@/types/paths";
import {useRouter} from "next/navigation";
import {ConditionalWrap} from "@/components/conditionalWrap/conditionalWrap";
import {useMedia} from "@/context/MediaQueryContext";
import TouchableDiv from "@/components/animation/touchRippleAnimation";
import {VirtualInfiniteScroll} from "@/components/list/virtualInfiniteScroll";

export const ChannelListResult = ({channelList, onLoadMore, hasMore, isLoading}: {channelList: ChannelInfoInterface[], onLoadMore?: ()=>void, hasMore?: boolean, isLoading?: boolean}) => {

    const router = useRouter();

    const handleClick = (channelUUID: string) => {
        router.push(app_channel_path + '/' + channelUUID);
    }
    const {isMobile} = useMedia()


    if(channelList.length == 0 && !isLoading) {
        return (
            <div className='flex justify-center items-center h-full text-muted-foreground'>
                No results found 😓
            </div>
        )
    }

    const renderItem = (channel: ChannelInfoInterface, i: number) => {
        return (
            <ConditionalWrap key = {channel.ch_uuid} condition={isMobile} wrap={
                (c)=>(
                    <TouchableDiv rippleBrightness={0.8} rippleDuration={800}>{c}
                    </TouchableDiv>

                )
            }>
                <div key = {channel.ch_uuid}  onClick={()=>handleClick(channel.ch_uuid)}>
                    {i!=0 && <Separator orientation="horizontal" className=" mx-6 w-[calc(100%-3rem)]" />}
                    <ChannelListChannel
                        lastUsername={channel.ch_posts?.[0].post_by.user_name || ''}
                        lastUserMessage={channel.ch_posts?.[0].post_text || ''}
                        lastMessageTime={channel.ch_posts?.[0].post_created_at || ''}
                        channelName={channel.ch_name}
                        unseenMessageCount={channel.unread_post_count || 0}
                        userSelected={false}
                        attachmentCount={channel.ch_posts?.[0].post_attachments?.length || 0}
                    />
                    {i==(channelList.length -1) && <Separator orientation="horizontal" className=" mx-6 w-[calc(100%-3rem)]" />}

                </div>
            </ConditionalWrap>
        )
    }


    return (
        <div className="w-full h-full flex justify-center overflow-y-auto">
            <div className=" w-full md:w-[40vw]  md:px-6">
                 <VirtualInfiniteScroll
                     items={channelList}
                     renderItem={renderItem}
                     onLoadMore={onLoadMore || (()=>{})}
                     hasMore={hasMore || false}
                     keyExtractor={(item) => item.ch_uuid}
                 />


            </div>
        </div>
    )
}