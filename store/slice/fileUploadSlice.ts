import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelFileUpload: { isOpen: false },
  channelCommentFileUpload: { isOpen: false },
  chatCommentFileUpload: { isOpen: false },
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

    closeChannelCommentFileUpload: (
        state,

    ) => {
      state.channelCommentFileUpload = {
        isOpen: false,
      };
    },

    openChannelCommentFileUpload: (
        state,

    ) => {
      state.channelCommentFileUpload = {
        isOpen: true,
      };
    },

    closeChatCommentFileUpload: (
        state,

    ) => {
      state.chatCommentFileUpload = {
        isOpen: false,
      };
    },

    openChatCommentFileUpload: (
        state,

    ) => {
      state.chatCommentFileUpload = {
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
  closeChannelCommentFileUpload,
  openChannelCommentFileUpload,
  closeChatCommentFileUpload,
  openChatCommentFileUpload,
  openFwdMsgFileUpload,
  closeFwdMsgFileUpload,
  openChatFileUpload,
  closeChatFileUpload
} = fileUpload.actions;

export default fileUpload;
