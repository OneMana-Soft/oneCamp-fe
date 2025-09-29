import { createSlice } from "@reduxjs/toolkit";
import {StandardReaction, SyncCustomReaction} from "@/types/reaction";
import {ChannelMessageLongPressDrawer} from "@/components/drawers/channelMessageLongPressDrawer";

interface reactionPickerDrawerProps {
  showCustomReactions: boolean
  onReactionSelect: (reaction: StandardReaction | SyncCustomReaction) => void
}

interface channelMessageLongPressDrawerProps {
  onAddReaction: () => void
  editMessage: () => void
  deleteMessage: () => void
  copyTextToClipboard: () => void
  handleEmojiClick: (emojiId: string) => void
  channelUUID: string
  postUUID: string
  isAdmin?: boolean
  isOwner: boolean
}

interface chatMessageLongPressDrawerProps {
  onAddReaction: () => void
  editMessage: () => void
  deleteMessage: () => void
  handleEmojiClick: (emojiId: string) => void
  otherUserUUID: string
  chatUUID: string
  isAdmin?: boolean
  isOwner?: boolean
  copyTextToClipboard: () => void

}

interface postMessageLongPressDrawerProps {
  onAddReaction: () => void
  copyTextToClipboard: () => void
  editMessage: () => void
  channelUUID: string
  postUUID: string
  deleteMessage: () => void
  handleEmojiClick: (emojiId: string) => void
  isAdmin?: boolean
  isOwner?: boolean
}

interface dmChatMessageLongPressDrawerProps {
  onAddReaction: () => void
  chatMessageUUID: string
  chatUUID: string
  editMessage: () => void
  deleteMessage: () => void
  handleEmojiClick: (emojiId: string) => void
  copyTextToClipboard: () => void
  isAdmin?: boolean
  isOwner?: boolean
}


interface postCommentMessageLongPressDrawerProps {
  onAddReaction: () => void
  copyTextToClipboard: () => void
  editMessage: () => void
  deleteMessage: () => void
  handleEmojiClick: (emojiId: string) => void
  isAdmin?: boolean
  isOwner?: boolean
}

interface dmChatCommentMessageLongPressDrawerProps {
  onAddReaction: () => void
  copyTextToClipboard: () => void
  editMessage: () => void
  deleteMessage: () => void
  handleEmojiClick: (emojiId: string) => void
  isAdmin?: boolean
  isOwner?: boolean
}

interface drawerChannelOption {
  channelUUID: string;
}


const initialState = {

  reactionPickerDrawer: {isOpen:false, data: { showCustomReactions: false, onReactionSelect: ()=>{} } as reactionPickerDrawerProps},
  channelOptionsDrawer: { isOpen: false, data: {channelUUID: ""} },
  channelMessageLongPressDrawer: {isOpen: false, data: {} as channelMessageLongPressDrawerProps},
  chatMessageLongPressDrawer: {isOpen: false, data: {} as chatMessageLongPressDrawerProps},
  postMessageLongPressDrawer: {isOpen: false, data: {} as postMessageLongPressDrawerProps},
  dmChatMessageLongPressDrawer: {isOpen: false, data: {} as dmChatMessageLongPressDrawerProps},
  postCommentMessageLongPressDrawer: {isOpen: false, data: {} as postCommentMessageLongPressDrawerProps},
  dmChatCommentMessageLongPressDrawer: {isOpen: false, data: {} as dmChatCommentMessageLongPressDrawerProps},
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

    openChatMessageLongPressDrawer: (
        state,
        action: { payload: chatMessageLongPressDrawerProps }
    ) => {
      state.chatMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closeChatMessageLongPressDrawer: (state) => {
      state.chatMessageLongPressDrawer = initialState.chatMessageLongPressDrawer;
    },

    openPostMessageLongPressDrawer: (
        state,
        action: { payload: postMessageLongPressDrawerProps }
    ) => {
      state.postMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closePostMessageLongPressDrawer: (state) => {
      state.postMessageLongPressDrawer = initialState.postMessageLongPressDrawer;
    },

    openDmChatMessageLongPressDrawer: (
        state,
        action: { payload: dmChatMessageLongPressDrawerProps }
    ) => {
      state.dmChatMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closeDmChatMessageLongPressDrawer: (state) => {
      state.dmChatMessageLongPressDrawer = initialState.dmChatMessageLongPressDrawer;
    },


    openPostCommentMessageLongPressDrawer: (
        state,
        action: { payload: postCommentMessageLongPressDrawerProps }
    ) => {
      state.postCommentMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closePostCommentMessageLongPressDrawer: (state) => {
      state.postCommentMessageLongPressDrawer = initialState.postCommentMessageLongPressDrawer;
    },


    openDmChatCommentMessageLongPressDrawer: (
        state,
        action: { payload: dmChatCommentMessageLongPressDrawerProps }
    ) => {
      state.dmChatCommentMessageLongPressDrawer = {
        isOpen: true,
        data: action.payload
      };
    },

    closeDmChatCommentMessageLongPressDrawer: (state) => {
      state.dmChatCommentMessageLongPressDrawer = initialState.dmChatCommentMessageLongPressDrawer;
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
  closeChannelMessageLongPressDrawer,
  openPostMessageLongPressDrawer,
  closePostMessageLongPressDrawer,
  openDmChatMessageLongPressDrawer,
  closeDmChatMessageLongPressDrawer,
  openPostCommentMessageLongPressDrawer,
  closePostCommentMessageLongPressDrawer,
  openDmChatCommentMessageLongPressDrawer,
  closeDmChatCommentMessageLongPressDrawer,
  openChatMessageLongPressDrawer,
  closeChatMessageLongPressDrawer
} = drawerSlice.actions;

export default drawerSlice;
