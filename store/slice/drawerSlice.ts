import { createSlice } from "@reduxjs/toolkit";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {ChannelMessageLongPressDrawer} from "@/components/drawers/channelMessageLongPressDrawer";

interface reactionPickerDrawerProps {
  showCustomReactions: boolean
  onReactionSelect: (reaction: StandardReaction | SyncCustomReaction) => void
}

interface channelMessageLongPressDrawerProps {
  onAddReaction: () => void
}

interface drawerChannelOption {
  channelUUID: string;
}

const initialState = {

  reactionPickerDrawer: {isOpen:false, data: { showCustomReactions: false, onReactionSelect: ()=>{} } as reactionPickerDrawerProps},
  channelOptionsDrawer: { isOpen: false, data: {channelUUID: ""} },
  channelMessageLongPressDrawer: {isOpen: false, data: {onAddReaction: () => {}} as channelMessageLongPressDrawerProps},
  orgProfileDrawer: { isOpen: false },
  userProfileDrawer: { isOpen: false },
  docFilterOptionsDrawer: { isOpen: false },
  docOptionsDrawer: { isOpen: false },
  taskFilterDrawer: { isOpen: false },
  taskOptionsDrawer: { isOpen: false },
  myTaskOptionsDrawer: { isOpen: false },
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {

    openOrgDrawer: (
      state
    ) => {
      state.orgProfileDrawer = {
        isOpen: true
      };
    },

    closeOrgDrawer: (state) => {
      state.orgProfileDrawer = initialState.orgProfileDrawer;
    },

    openUserProfileDrawer: (
        state
    ) => {
      state.userProfileDrawer = {
        isOpen: true
      };
    },

    closeUserProfileDrawer: (state) => {
      state.userProfileDrawer = initialState.userProfileDrawer;
    },

    openChannelOptionsDrawer: (
        state,
         action: { payload:  drawerChannelOption }
    ) => {
      state.channelOptionsDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closeChannelOptionsDrawer: (state) => {
      state.channelOptionsDrawer = initialState.channelOptionsDrawer;
    },

    openDocFilterOptionsDrawer: (
        state
    ) => {
      state.docFilterOptionsDrawer = {
        isOpen: true
      };
    },

    closeDocFilterOptionsDrawer: (state) => {
      state.docFilterOptionsDrawer = initialState.docFilterOptionsDrawer;
    },


    openDocOptionsDrawer: (
        state
    ) => {
      state.docOptionsDrawer = {
        isOpen: true
      };
    },

    closeDocOptionsDrawer: (state) => {
      state.docOptionsDrawer = initialState.docOptionsDrawer;
    },

    openReactionPickerDrawer: (
        state,
        action: { payload: reactionPickerDrawerProps }
    ) => {
      state.reactionPickerDrawer = {
        isOpen: true,
        data: action.payload
      };

    },

    closeReactionPickerDrawer: (state) => {
      state.reactionPickerDrawer = initialState.reactionPickerDrawer;
    },

    openTaskFilterDrawer: (
        state
    ) => {
      state.taskFilterDrawer = {
        isOpen: true
      };
    },

    closeTaskFilterDrawer: (state) => {
      state.taskFilterDrawer = initialState.taskFilterDrawer;
    },

    openTaskOptionsDrawer: (
        state
    ) => {
      state.taskOptionsDrawer = {
        isOpen: true
      };
    },

    closeTaskOptionsDrawer: (state) => {
      state.taskOptionsDrawer = initialState.taskOptionsDrawer;
    },

    openMyTaskOptionsDrawer: (
        state
    ) => {
      state.myTaskOptionsDrawer = {
        isOpen: true
      };
    },

    closeMyTaskOptionsDrawer: (state) => {
      state.myTaskOptionsDrawer = initialState.myTaskOptionsDrawer;
    },

    openChannelMessageLongPressDrawer: (
        state,
        action: { payload: channelMessageLongPressDrawerProps }
    ) => {
      state.channelMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closeChannelMessageLongPressDrawer: (state) => {
      state.channelMessageLongPressDrawer = initialState.channelMessageLongPressDrawer;
    },

  },
});

export const {
  openOrgDrawer,
  closeOrgDrawer,
  openUserProfileDrawer,
  closeUserProfileDrawer,
  openChannelOptionsDrawer,
  closeChannelOptionsDrawer,
  openDocFilterOptionsDrawer,
  closeDocFilterOptionsDrawer,
  openDocOptionsDrawer,
  closeDocOptionsDrawer,
  openReactionPickerDrawer,
  closeReactionPickerDrawer,
  openTaskFilterDrawer,
  closeTaskFilterDrawer,
  openTaskOptionsDrawer,
  closeTaskOptionsDrawer,
  openMyTaskOptionsDrawer,
  closeMyTaskOptionsDrawer,
  openChannelMessageLongPressDrawer,
  closeChannelMessageLongPressDrawer
} = drawerSlice.actions;

export default drawerSlice;
