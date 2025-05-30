import {MobileChannelTextInput} from "@/components/textInput/mobileChannelTextInput";
import {ChannelMessageList} from "@/components/channel/channelMessageList";

export const ChannelIdMobile = ({channelId}: {channelId: string}) => {
    return (
        <div className='flex flex-col h-full'>

            <div style={{ height: window.innerHeight-220 }}>
                <ChannelMessageList channelId={channelId} />
            </div>
            <div>
                <MobileChannelTextInput channelId={channelId} />
            </div>

        </div>
    )
}