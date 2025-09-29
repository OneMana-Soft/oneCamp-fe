import { createSlice } from "@reduxjs/toolkit";
import {UserEmojiStatus, UserProfileDataInterface, UserStatus} from "@/types/user";
import {ChannelInfoInterface} from "@/types/channel";
import {TeamInfoInterface} from "@/types/team";
import {ProjectInfoInterface} from "@/types/project";

interface UpdateUserEmojiStatusInterface {
  status: UserEmojiStatus;
  userUUID: string;
}

interface UpdateUserStatusInterface {
  status: string;
  userUUID: string;
}

interface UpdateUserConnectedDeviceInterface {
  deviceConnected: number;
  userUUID: string;
}

interface CreateUserStatusInterface {
  users: UserProfileDataInterface[]
}

interface CreateUserChatsInterface {
  chatUsers: UserProfileDataInterface[]
}

interface AddUserChatInterface {
  chatUser: UserProfileDataInterface
}

interface CreateUserChannelsInterface {
  channelsUser: ChannelInfoInterface[]
}

interface UpdateUserChannelInterface {
  channelUUID: string
  channelName: string
  channelPrivate: boolean
}

interface AddUserChannelInterface {
  channelUser: ChannelInfoInterface
}

interface CrateUserTeamsInterface {
  teamUsers: TeamInfoInterface[]
}

interface CrateUserTeamInterface {
  teamUser: TeamInfoInterface

}

interface UpdateUserTeamInterface {
  teamName: string
  teamUUID: string
}

interface CrateUserProjectsInterface {
  projectUsers: ProjectInfoInterface[]
}

interface CrateUserProjectInterface {
  projectUser: ProjectInfoInterface

}

interface UserEmojiInterface{
  emojiStatus: UserEmojiStatus;
  status: string;
  deviceConnected: number;
}

interface UserSidebarInterface {
  userChats:  UserProfileDataInterface[],
  userChannels:  ChannelInfoInterface[],
  userTeams: TeamInfoInterface[],
  userProjects:  ProjectInfoInterface[]
}

interface ExtendedUserEmojiStatusState {
  [key: string]:  UserEmojiInterface;
}

const initialState = {
  usersStatus: {} as ExtendedUserEmojiStatusState,
  userSidebar: {} as UserSidebarInterface
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {

    updateUserEmojiStatus: (state, action: {payload: UpdateUserEmojiStatusInterface}) => {
      const { userUUID, status } = action.payload;

      if(!state.usersStatus[userUUID]) {
        state.usersStatus[userUUID] = {} as UserEmojiInterface
      }

      state.usersStatus[userUUID].emojiStatus  = status;
    },

    updateUserStatus: (state, action: {payload: UpdateUserStatusInterface}) => {
      const { userUUID, status } = action.payload;

      if(!state.usersStatus[userUUID]) {
        state.usersStatus[userUUID] = {} as UserEmojiInterface
      }

      state.usersStatus[userUUID].status = status;
    },

    updateUsersStatusFromList: (state, action: {payload: CreateUserStatusInterface}) => {

      const {users} = action.payload;

      users.forEach(user => {

        if(!state.usersStatus[user.user_uuid]) {
          state.usersStatus[user.user_uuid] = {} as UserEmojiInterface
        }

        if(user.user_emoji_statuses) {
          state.usersStatus[user.user_uuid].emojiStatus = user.user_emoji_statuses[0]
        }

        if(user.user_status) {
          state.usersStatus[user.user_uuid].status = user.user_status

        }

      })

    },

    updateUserConnectedDeviceCount: (state, action: {payload: UpdateUserConnectedDeviceInterface}) => {
      const { userUUID, deviceConnected } = action.payload;

      if(!state.usersStatus[userUUID]) {
        state.usersStatus[userUUID] = {} as UserEmojiInterface
      }

      state.usersStatus[userUUID].deviceConnected = deviceConnected;
    },

    createUserChatList: (state, action: {payload: CreateUserChatsInterface}) => {
      const {chatUsers} = action.payload;

      state.userSidebar.userChats = chatUsers;
    },

    addUserToUserChatList: (state, action: {payload: AddUserChatInterface}) => {
      const {chatUser} = action.payload;

      let found = false

      if(!state.userSidebar.userChats) {
        state.userSidebar.userChats = [] as UserProfileDataInterface[]
      }


      state.userSidebar.userChats = state.userSidebar.userChats.map((item) => {
        if(item.user_uuid == chatUser.user_uuid) {
          found = true
          if(item.user_dms) {
            item.user_dms[0].dm_unread = 0
          }
        }

        return item
      })



      if(!found) {
        state.userSidebar.userChats.push(chatUser);

      }

    },

    createUserChannelList: (state, action: {payload: CreateUserChannelsInterface}) => {
      const {channelsUser} = action.payload;

      state.userSidebar.userChannels = channelsUser;
    },

    updateUserChannelName: (state, action: {payload: UpdateUserChannelInterface}) => {
      const {channelName, channelPrivate, channelUUID} = action.payload;

      state.userSidebar.userChannels = state.userSidebar.userChannels.map((item) => {

        if(item.ch_uuid === channelUUID) {
          item.ch_name = channelName;
          item.ch_private = channelPrivate;
        }
        return item;
      });

    },

    addUserChannelList: (state, action: {payload: AddUserChannelInterface}) => {
      const {channelUser} = action.payload;

      let found  = false

      if(!state.userSidebar.userChannels) {
        state.userSidebar.userChannels = [] as ChannelInfoInterface[]
      }

      state.userSidebar.userChannels = state.userSidebar.userChannels.map((item) => {
        if(item.ch_uuid == channelUser.ch_uuid) {
          found = true;
          item.unread_post_count = 0
        }
        return item
      })

      if(!found) {
        state.userSidebar.userChannels.push(channelUser);

      }
    },

    createUserTeamList: (state, action: {payload: CrateUserTeamsInterface}) => {
      const {teamUsers} = action.payload;

      state.userSidebar.userTeams = teamUsers;
    },

    addUserTeamList: (state, action: {payload: CrateUserTeamInterface}) => {
      const {teamUser} = action.payload;

      let found  = false

      state.userSidebar.userTeams.forEach((item) => {
        if(item.team_uuid == teamUser.team_uuid) {
          found = true;
          return
        }
      })

      if(!found) {
        state.userSidebar.userTeams.push(teamUser);
      }

    },

    updateUserTeamList: (state, action: {payload: UpdateUserTeamInterface}) => {
      const {teamName, teamUUID} = action.payload;

      state.userSidebar.userTeams = state.userSidebar.userTeams.map((item)=>{

        if(item.team_uuid == teamUUID) {
          item.team_name = teamName;
        }

        return item
      })
    },

    createUserProjectList: (state, action: {payload: CrateUserProjectsInterface}) => {
      const {projectUsers} = action.payload;

      state.userSidebar.userProjects = projectUsers;
    },

    addUserProjectList: (state, action: {payload: CrateUserProjectInterface}) => {
      const {projectUser} = action.payload;

      state.userSidebar.userProjects.push(projectUser);
    }

  },
});

export const {
  updateUserEmojiStatus,
  updateUserStatus,
  updateUserConnectedDeviceCount,
  createUserChatList,
  addUserToUserChatList,
  createUserChannelList,
  updateUserChannelName,
  addUserChannelList,
  createUserTeamList,
  addUserTeamList,
  updateUserTeamList,
  createUserProjectList,
  addUserProjectList,
  updateUsersStatusFromList

} = userSlice.actions;

export default userSlice;
