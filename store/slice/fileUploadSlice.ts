import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelFileUpload: { isOpen: false },
  chatFileUpload: { isOpen: false },
  fwdMsgFileUpload: { isOpen: false },

};

export const fileUpload = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {

    closeChannelFileUpload: (
        state,

    ) => {
      state.channelFileUpload = {
        isOpen: false,
      };
    },

    openChannelFileUpload: (
        state,

    ) => {
      state.channelFileUpload = {
        isOpen: true,
      };
    },

    closeChatFileUpload: (
        state,

    ) => {
      state.chatFileUpload = {
        isOpen: false,
      };
    },

    openChatFileUpload: (
        state,

    ) => {
      state.chatFileUpload = {
        isOpen: true,
      };
    },

    closeFwdMsgFileUpload: (
        state,

    ) => {
      state.fwdMsgFileUpload = {
        isOpen: false,
      };
    },

    openFwdMsgFileUpload: (
        state,

    ) => {
      state.fwdMsgFileUpload = {
        isOpen: true,
      };
    },

  },
});

export const {
  openChannelFileUpload,
  closeChannelFileUpload,
  openFwdMsgFileUpload,
  closeFwdMsgFileUpload,
  openChatFileUpload,
  closeChatFileUpload
} = fileUpload.actions;

export default fileUpload;
