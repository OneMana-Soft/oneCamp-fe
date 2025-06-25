import { createSlice } from "@reduxjs/toolkit";
import {AttachmentMediaReq} from "@/types/attachment";


interface dialogUpdateUserStatus {
  userUUID: string;
}

interface dialogUpdateChannel {
  channelUUID: string;
}

interface mediaLightboxInterface {
  allMedia: AttachmentMediaReq[]
  mediaGetUrl: string
  media: AttachmentMediaReq
}

interface forwardMessageInterface {
  chatUUID: string
  channelUUID: string
  postUUID: string
}

const initialState = {
  createChannelDialog: { isOpen: false },
  createProjectDialog: { isOpen: false },
  createTeamDialog: { isOpen: false },
  forwardMessageDialog: { isOpen: false,  data: { chatUUID: "", channelUUID: "", postUUID: "" } },
  createChatMessageDialog: { isOpen: false },
  updateUserStatusDialog: { isOpen: false, data: { userUUID: "" } },
  editChannelDialog: { isOpen: false, data: { channelUUID: "" } },
  editChannelMemberDialog: { isOpen: false, data: { channelUUID: "" } },
  attachmentLightboxDialog: { isOpen: false, data: { allMedia: [] as AttachmentMediaReq[],  mediaGetUrl: "", media: {} as AttachmentMediaReq } },

};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {

    openUpdateUserStatusDialog: (
      state,
      action: { payload: dialogUpdateUserStatus }
    ) => {
      state.updateUserStatusDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeUpdateUserStatusDialog: (state) => {
      state.updateUserStatusDialog = initialState.updateUserStatusDialog;
    },

    openCreateChannelDialog: (
        state
    ) => {
      state.createChannelDialog = {
        isOpen: true
      };
    },

    closeCreateChannelDialog: (state) => {
      state.createChannelDialog = initialState.createChannelDialog;
    },

    openCreateTeamDialog: (
        state
    ) => {
      state.createTeamDialog = {
        isOpen: true
      };
    },

    closeCreateTeamDialog: (state) => {
      state.createTeamDialog = initialState.createTeamDialog;
    },

    openCreateProjectDialog: (
        state
    ) => {
      state.createProjectDialog = {
        isOpen: true
      };
    },

    closeCreateProjectDialog: (state) => {
      state.createProjectDialog = initialState.createProjectDialog;
    },

    openCreateChatMessageDialog: (
        state
    ) => {
      state.createChatMessageDialog = {
        isOpen: true
      };
    },

    closeCreateChatMessageDialog: (state) => {
      state.createChatMessageDialog = initialState.createChatMessageDialog;
    },

    openUpdateChannelDialog: (
        state,
        action: { payload: dialogUpdateChannel }
    ) => {
      state.editChannelDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeUpdateChannelDialog: (state) => {
      state.editChannelDialog = initialState.editChannelDialog;
    },

    openUpdateChannelMemberDialog: (
        state,
        action: { payload: dialogUpdateChannel }
    ) => {
      state.editChannelMemberDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeUpdateChannelMemberDialog: (state) => {
      state.editChannelMemberDialog = initialState.editChannelMemberDialog;
    },

    openMediaLightboxDialog: (
        state,
        action: { payload: mediaLightboxInterface }
    ) => {
      state.attachmentLightboxDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeMediaLightboxDialog: (state) => {
      state.attachmentLightboxDialog = initialState.attachmentLightboxDialog;
    },


    openForwardMessageDialog: (
        state,
        action: { payload:  forwardMessageInterface }
    ) => {
      state.forwardMessageDialog = {
        isOpen: true,
        data: action.payload,
      };
    },

    closeForwardMessageDialog: (state) => {
      state.forwardMessageDialog = initialState.forwardMessageDialog;
    },

  },
});

export const {
  openUpdateUserStatusDialog,
  closeUpdateUserStatusDialog,
  openCreateChannelDialog,
  closeCreateChannelDialog,
  openCreateChatMessageDialog,
  closeCreateChatMessageDialog,
  closeCreateProjectDialog,
  openCreateProjectDialog,
  closeCreateTeamDialog,
  openCreateTeamDialog,
  openUpdateChannelDialog,
  closeUpdateChannelDialog,
  openUpdateChannelMemberDialog,
  closeUpdateChannelMemberDialog,
  openMediaLightboxDialog,
  closeMediaLightboxDialog,
  openForwardMessageDialog,
  closeForwardMessageDialog
} = dialogSlice.actions;

export default dialogSlice;
