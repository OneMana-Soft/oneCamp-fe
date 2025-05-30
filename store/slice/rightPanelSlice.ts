import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    rightPanelState: { isOpen: false },
}

export const rightPanelSlice = createSlice({
    name: 'rightPanel',
    initialState,
    reducers: {
        openRightPanel: (state) => {
            state.rightPanelState.isOpen = true
        },
        closeRightPanel: (state) => {
            state.rightPanelState = initialState.rightPanelState
        },

        toggleRightPanel: (state) => {
            state.rightPanelState.isOpen = !state.rightPanelState.isOpen
        }
    }

});

export const {
    openRightPanel,
    closeRightPanel,
    toggleRightPanel
} = rightPanelSlice.actions

export default rightPanelSlice;
