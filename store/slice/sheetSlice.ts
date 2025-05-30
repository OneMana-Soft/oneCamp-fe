import { createSlice } from "@reduxjs/toolkit";


interface sheetChannelInfo {
  channelUUID: string;
}

const initialState = {
  channelInfoSheet: { isOpen: false , data: { channelUUID: "" }},
};

export const dialogSheet = createSlice({
  name: "sheet",
  initialState,
  reducers: {

    openChannelInfoSheet: (
      state,
      action: { payload: sheetChannelInfo }
    ) => {
      state.channelInfoSheet = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeChannelInfoSheet: (state) => {
      state.channelInfoSheet = initialState.channelInfoSheet;
    },

  },
});

export const {
  openChannelInfoSheet,
  closeChannelInfoSheet
} = dialogSheet.actions;

export default dialogSheet;
