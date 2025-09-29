import {ChannelInfoInterface} from "@/types/channel";
import {ChannelListChannel} from "@/components/channel/channelListChannel";
import {Separator} from "@/components/ui/separator";
import * as React from "react";
import {app_channel_path} from "@/types/paths";
import {useRouter} from "next/navigation";

export const ChannelListResult = ({channelList}: {channelList: ChannelInfoInterface[]}) => {

    const router = useRouter();

    const handleClick = (channelUUID: string) => {
        router.push(app_channel_path + '/' + channelUUID);
    }


    return (
        <div className="w-full flex justify-center overflow-y-auto ">
            <div className=" w-full md:w-[40vw]  md:px-6">
                {
                    channelList.map((channel: ChannelInfoInterface, i) => {
                        return (
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
                            </div>
                        )
                    })

                }

                {
                    channelList.length && <Separator orientation="horizontal" className=" mx-6 w-[calc(100%-3rem)]" />
                }


            </div>
        </div>
    )
}