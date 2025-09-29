import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {ChannelComments} from "@/components/rightPanel/channelComments";
import {ChatComments} from "@/components/rightPanel/chatComments";


export const RightPanel = () => {

    const rightPanelState = useSelector((state: RootState) => state.rightPanel.rightPanelState);


    const renderRightPanel = () => {


        if (rightPanelState.data.chatUUID && rightPanelState.data.chatMessageUUID) {
            console.log("sadasd sadd ", rightPanelState)

            return <ChatComments/>
        }

        if (rightPanelState.data.channelUUID && rightPanelState.data.postUUID) {
            return <ChannelComments/>
        }
    }


    return (<>

        {renderRightPanel()}
    </>)
}