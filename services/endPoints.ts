export enum GetEndpointUrl {
    SelfProfile = "/user/profile",
    SelfProfileSideNav = "/user/sidebarNav",
    UserListNotBelongToChannel = "user/usersListNotBelongToChannelId",
    CheckTeamNameAvailability = "/team/checkTeamNameExist",
    TeamListUserIsAdmin = "/team/teamListByAdminUID",
    CheckChannelNameAvailability = "/ch/chNameIsAvailable",
    ChannelBasicInfo = "/ch/channelBasicInfo",
    ChannelMemberInfoWithAdminFlagInfo = "/ch/channelInfoWithMemberAdminFlag",
    PublicAttachmentURL = "/getFile",
    GetChannelMedia = "/ch/getFile",
    GetChannelLatestPost = "/po/latestPosts",
    GetNewPostIncludingCurrentPost = "/po/newPostsIncludingCurrent",
    GetNewPostAfter = "/po/newPosts/{channel_uuid}/{time_stamp}",
    GetOldPostBefore = "/po/oldPosts/{channel_uuid}/{time_stamp}",
    GetChatMedia = "/chat/getFile",
    GetOnlyPostText = "/po/getOnlyPostText",
    GetOnlyChatText = "/chat/getChatOnlyText",
    GetUserStatuses = "/user/getAllUserEmojiStatusList",
    GetUserEmojiStatus = "/user/getActiveUserEmojiStatus"

}

export enum PostFileUploadURL {
    UploadFile = "/uploadFile",
}

export enum PostEndpointUrl {
    CreateTeam = "/team/createTeam",
    CreateProject = "/project/createProject",
    CreateChannel = "/ch/create",
    UpdateChannel = "/ch/updateInfo",
    RemoveChannelModerator = "/ch/removeModerator",
    RemoveChannelMember = "/ch/removeMember",
    AddChannelModerator = "/ch/addModerator",
    AddChannelMember = "/ch/addMember",
    AddFavChannel = "/user/addFavChannel",
    RemoveFavChannel = "/user/removeFavChannel",
    UpdateChannelNotification = "/user/updateUserChannelNotification",
    CreateChannelPost = "/po/createPost",
    SearchUserAndChannel = "/user/searchUserAndChannelList",
    FwdMsgToChatOrChannel = "/user/fwdMessage",
    UpdateUserEmojiStatus = "/user/updateStatusEmojiStatus",
    ClearEmojiStatus = "/user/clearUserEmojiStatus",
}