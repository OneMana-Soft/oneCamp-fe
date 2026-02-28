import {ChatMessageList} from "@/components/chat/chatMessageList";
import {MobileChatTextInput} from "@/components/textInput/mobileChatTextInput";

export const ChatIdMobile = ({chatId, handleSend}: {chatId: string, handleSend: ()=>void }) => {
    return (
        <div className='flex flex-col h-full'>

            <div style={{ height: window.innerHeight-185 }}>
                <ChatMessageList chatId={chatId} />
            </div>
            <div>
                <MobileChatTextInput chatId={chatId} handleSend={handleSend}/>
            </div>

        </div>
    )
}