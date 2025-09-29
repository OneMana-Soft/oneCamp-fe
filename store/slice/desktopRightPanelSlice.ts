import {createSlice} from "@reduxjs/toolkit";

interface rightPanelProps {
    chatUUID: string;
    channelUUID: string;
    postUUID: string;
    chatMessageUUID: string;
}
const initialState = {
    rightPanelState: { isOpen: false,  data: { chatMessageUUID:"", chatUUID: "", channelUUID: "", postUUID: "" } },
};

export const rightPanelSlice = createSlice({
    name: "rightPanel",
    initialState,
    reducers: {

        openRightPanel:  (
            state,
            action: { payload: rightPanelProps }
        ) => {
            state.rightPanelState = {
                isOpen: true,
                data: action.payload,
            };
        },

        closeRightPanel: (state) => {
            state.rightPanelState.isOpen = false
        },

    }
});

export const {
    openRightPanel,
    closeRightPanel
} = rightPanelSlice.actions

export default rightPanelSlice;
