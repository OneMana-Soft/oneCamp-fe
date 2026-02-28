import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {ChannelComments} from "@/components/rightPanel/channelComments";
import {ChatComments} from "@/components/rightPanel/chatComments";
import TaskInfoPanel from "@/components/rightPanel/taskInfoPanel";
import {GroupChatComments} from "@/components/rightPanel/groupChatComments";
import {DocCommentList} from "@/components/rightPanel/docCommentList";


export const RightPanel = () => {

    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);


    const renderRightPanel = () => {


        if (rightPanelState.data.chatUUID && rightPanelState.data.chatMessageUUID) {
            return <ChatComments/>
        }

        if(rightPanelState.data.groupUUID && rightPanelState.data.chatMessageUUID) {
            return <GroupChatComments/>
        }

        if (rightPanelState.data.channelUUID && rightPanelState.data.postUUID) {
            return <ChannelComments/>
        }

        if(rightPanelState.data.taskUUID) {
            return <TaskInfoPanel key={rightPanelState.data.taskUUID} taskUUID={rightPanelState.data.taskUUID} />
        }

        if(rightPanelState.data.docUUID) {
            return <DocCommentList docId={rightPanelState.data.docUUID}/>
        }

    }


    return (<>

        {renderRightPanel()}
    </>)
}