import {ChatMessageList} from "@/components/chat/chatMessageList";
import {MobileChatTextInput} from "@/components/textInput/mobileChatTextInput";
import {GroupChatMessageList} from "@/components/groupChat/groupChatMessageList";
import {MobileGroupChatTextInput} from "@/components/textInput/mobileGroupChatTextInput";

export const GrpChatIdMobile = ({grpId, handleSend}: {grpId: string, handleSend: ()=>void }) => {
    return (
        <div className='flex flex-col h-full'>

            <div style={{ height: window.innerHeight-185 }}>
                <GroupChatMessageList grpId={grpId} />
            </div>
            <div>
                <MobileGroupChatTextInput grpId={grpId} handleSend={handleSend}/>
            </div>

        </div>
    )
}