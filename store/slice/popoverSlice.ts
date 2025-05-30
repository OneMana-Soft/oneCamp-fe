import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  docShare: { isOpen: false },
};

export const popoverSlice = createSlice({
  name: "popover",
  initialState,
  reducers: {

    openDocSharePopover: (
      state,
    ) => {
      state.docShare = {
        isOpen: true,
      };
    },

    closeDocSharePopover: (state) => {
      state.docShare = initialState.docShare;
    },

  },
});

export const {
  openDocSharePopover,
  closeDocSharePopover
} = popoverSlice.actions;

export default popoverSlice;
